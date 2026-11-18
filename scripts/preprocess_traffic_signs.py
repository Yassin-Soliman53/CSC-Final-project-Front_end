import argparse
import csv
from pathlib import Path

import numpy as np
from PIL import Image
from sklearn.model_selection import StratifiedGroupKFold


def normalized(name):
    return "".join(character.lower() for character in name if character.isalnum())


def find_column(fieldnames, candidates):
    columns = {normalized(field): field for field in fieldnames}
    for candidate in candidates:
        if normalized(candidate) in columns:
            return columns[normalized(candidate)]
    return None


def read_annotations(csv_path, group_column=None):
    with csv_path.open("r", newline="", encoding="utf-8-sig") as csv_file:
        sample = csv_file.read(2048)
        csv_file.seek(0)
        dialect = csv.Sniffer().sniff(sample)
        reader = csv.DictReader(csv_file, dialect=dialect)
        rows = list(reader)

    if not rows:
        raise ValueError(f"No annotations found in {csv_path}")

    fieldnames = reader.fieldnames or []
    path_column = find_column(fieldnames, ("Path", "Filename", "File", "Image"))
    label_column = find_column(fieldnames, ("ClassId", "Class", "Label", "Target"))
    roi_columns = [
        find_column(fieldnames, candidates)
        for candidates in (
            ("Roi.X1", "x1", "left", "XMin"),
            ("Roi.Y1", "y1", "top", "YMin"),
            ("Roi.X2", "x2", "right", "XMax"),
            ("Roi.Y2", "y2", "bottom", "YMax"),
        )
    ]
    resolved_group_column = None
    if group_column:
        resolved_group_column = find_column(fieldnames, (group_column,))

    if not path_column:
        raise ValueError("CSV must contain a Path or Filename column.")
    if not label_column:
        raise ValueError("CSV must contain a ClassId, Class, Label, or Target column.")

    missing_roi = [candidate for candidate, column in zip(
        ("x1", "y1", "x2", "y2"), roi_columns
    ) if column is None]
    if missing_roi:
        raise ValueError(
            "CSV must contain ROI coordinates. Missing: "
            + ", ".join(missing_roi)
        )
    if group_column and not resolved_group_column:
        raise ValueError(f"Group column '{group_column}' was not found in the CSV.")

    return (
        rows,
        path_column,
        label_column,
        roi_columns,
        resolved_group_column,
    )


def resolve_image_path(image_dir, relative_path):
    image_path = Path(relative_path)
    if not image_path.is_absolute():
        image_path = image_dir / image_path
    return image_path


def preprocess_rows(rows, image_dir, path_column, label_column, roi_columns,
                    group_column, image_size, normalize):
    images = []
    labels = []
    groups = []

    for row_index, row in enumerate(rows):
        image_path = resolve_image_path(image_dir, row[path_column].strip())
        if not image_path.is_file():
            raise FileNotFoundError(
                f"Missing image for CSV row {row_index + 1}: {image_path}"
            )

        try:
            x1, y1, x2, y2 = (
                int(float(row[column])) for column in roi_columns
            )
            label = int(row[label_column])
        except (TypeError, ValueError) as error:
            raise ValueError(
                f"Invalid ROI or label in CSV row {row_index + 1}"
            ) from error

        with Image.open(image_path) as source:
            image = source.convert("RGB")
            width, height = image.size
            x1 = max(0, min(width, x1))
            x2 = max(0, min(width, x2))
            y1 = max(0, min(height, y1))
            y2 = max(0, min(height, y2))

            if x2 <= x1 or y2 <= y1:
                raise ValueError(
                    f"Invalid ROI for CSV row {row_index + 1}: "
                    f"({x1}, {y1}, {x2}, {y2})"
                )

            cropped = image.crop((x1, y1, x2, y2))
            resized = cropped.resize(
                (image_size, image_size),
                resample=Image.Resampling.BICUBIC,
            )

        array = np.asarray(resized, dtype=np.float32)
        if normalize:
            array /= 255.0

        images.append(array)
        labels.append(label)
        if group_column:
            groups.append(str(row[group_column].strip()))
        else:
            groups.append(str(image_path.resolve()))

    return (
        np.stack(images).astype(np.float32, copy=False),
        np.asarray(labels, dtype=np.int64),
        np.asarray(groups),
    )


def split_indices(labels, groups, validation_fraction, random_state):
    unique_groups = np.unique(groups)
    n_splits = int(round(1.0 / validation_fraction))
    n_splits = max(2, n_splits)

    if len(unique_groups) < n_splits:
        raise ValueError(
            f"{len(unique_groups)} unique image sources cannot create "
            f"a {validation_fraction:.0%} split. "
            "Provide a group/source column or combine repeated observations."
        )

    splitter = StratifiedGroupKFold(
        n_splits=n_splits,
        shuffle=True,
        random_state=random_state,
    )
    train_indices, validation_indices = next(
        splitter.split(np.zeros(len(labels)), labels, groups)
    )

    train_groups = set(groups[train_indices])
    validation_groups = set(groups[validation_indices])
    if train_groups & validation_groups:
        raise RuntimeError("Group leakage detected between train and validation.")

    return train_indices, validation_indices


def parse_args():
    parser = argparse.ArgumentParser(
        description="Crop, resize, split, and array-convert traffic-sign images."
    )
    parser.add_argument("--csv", required=True, type=Path)
    parser.add_argument("--images", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--validation-fraction", type=float, default=0.20)
    parser.add_argument("--image-size", type=int, default=128)
    parser.add_argument("--random-state", type=int, default=42)
    parser.add_argument(
        "--group-column",
        default=None,
        help="CSV column identifying source scenes/sequences. "
             "Repeated values are never split across train and validation.",
    )
    parser.add_argument(
        "--no-normalize",
        action="store_true",
        help="Store pixel values in [0, 255] instead of [0, 1].",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    if not 0 < args.validation_fraction < 1:
        raise ValueError("--validation-fraction must be between 0 and 1.")
    if args.image_size <= 0:
        raise ValueError("--image-size must be greater than zero.")
    if not args.csv.is_file():
        raise FileNotFoundError(f"CSV not found: {args.csv}")
    if not args.images.is_dir():
        raise NotADirectoryError(f"Image directory not found: {args.images}")

    (
        rows,
        path_column,
        label_column,
        roi_columns,
        group_column,
    ) = read_annotations(args.csv, args.group_column)
    images, labels, groups = preprocess_rows(
        rows,
        args.images,
        path_column,
        label_column,
        roi_columns,
        group_column,
        args.image_size,
        normalize=not args.no_normalize,
    )
    train_indices, validation_indices = split_indices(
        labels,
        groups,
        args.validation_fraction,
        args.random_state,
    )

    args.output.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output / "traffic_signs.npz",
        X_train=images[train_indices],
        y_train=labels[train_indices],
        X_val=images[validation_indices],
        y_val=labels[validation_indices],
    )

    print(
        f"Saved {len(train_indices)} training and "
        f"{len(validation_indices)} validation samples "
        f"to {args.output / 'traffic_signs.npz'}"
    )
    print(f"X_train shape: {images[train_indices].shape}")
    print(f"X_val shape: {images[validation_indices].shape}")


if __name__ == "__main__":
    main()
