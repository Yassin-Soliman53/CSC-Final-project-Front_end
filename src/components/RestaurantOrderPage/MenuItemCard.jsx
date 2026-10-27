import { useMemo } from "react";
import { Check, Minus, Plus } from "lucide-react";

export default function MenuItemCard({
  item,
  sizeLabels = {},
  selectedItems = {},
  onSelectionChange,
}) {
  const availableSizes = useMemo(() => {
    if (item.prices && typeof item.prices === "object") {
      return Object.entries(item.prices)
        .filter(
          ([, price]) =>
            price !== null &&
            price !== undefined &&
            Number.isFinite(Number(price)) &&
            Number(price) >= 0,
        )
        .map(([code, price]) => ({
          code,
          label: sizeLabels[code] || code,
          price: Number(price),
        }));
    }

    if (
      item.price !== null &&
      item.price !== undefined &&
      Number.isFinite(Number(item.price))
    ) {
      return [
        {
          code: null,
          label: null,
          price: Number(item.price),
        },
      ];
    }

    return [];
  }, [item, sizeLabels]);

  const getSelection = (sizeCode) =>
    selectedItems[`${item.id}-${sizeCode || "default"}`];

  const updateQuantity = (size, quantity) => {
    onSelectionChange(item, size.code, size.price, quantity);
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900">{item.name}</h3>

          {item.description && (
            <p className="mt-1 text-sm leading-6 text-gray-500">
              {item.description}
            </p>
          )}
        </div>

        {availableSizes.length === 1 && !availableSizes[0].code && (
          <p className="shrink-0 font-bold text-orange-600">
            {availableSizes[0].price} ج.م
          </p>
        )}
      </div>

      {availableSizes.length === 0 ? (
        <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
          السعر غير متاح حاليًا.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {availableSizes.map((size) => {
            const selection = getSelection(size.code);
            const quantity = selection?.quantity || 0;

            return (
              <div
                key={size.code || "default"}
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition ${
                  quantity > 0
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      quantity > 0
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                    aria-hidden="true"
                  >
                    {quantity > 0 && <Check size={13} />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {size.label || "الحجم العادي"}
                    </p>

                    <p className="mt-1 text-sm font-bold text-orange-600">
                      {size.price} ج.م
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(size, quantity - 1)}
                    disabled={quantity === 0}
                    aria-label={`تقليل كمية ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={15} />
                  </button>

                  <span
                    className="min-w-5 text-center text-sm font-bold"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(size, quantity + 1)}
                    aria-label={`زيادة كمية ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
