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
    <article className="rounded-2xl border border-[#737373]/30 bg-white/90 p-4 shadow-sm transition hover:border-[#F4A261]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-[#1a1a1a]">{item.name}</h3>

          {item.description && (
            <p className="mt-1 text-sm leading-6 text-gray-500">
              {item.description}
            </p>
          )}
        </div>

        {availableSizes.length === 1 && !availableSizes[0].code && (
          <p className="shrink-0 font-bold text-[#737373]">
            {availableSizes[0].price} ج.م
          </p>
        )}
      </div>

      {availableSizes.length === 0 ? (
        <p className="mt-4 rounded-lg bg-[#FFF4E6] p-3 text-sm text-[#737373]">
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
                    ? "border-[#F4A261] bg-[#F4A261]/15"
                    : "border-[#737373]/15 bg-[#FFF4E6]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      quantity > 0
                        ? "border-[#737373] bg-[#737373] text-white"
                        : "border-[#737373]/40 bg-white"
                    }`}
                    aria-hidden="true"
                  >
                    {quantity > 0 && <Check size={13} />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1a1a1a]">
                      {size.label || "الحجم العادي"}
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#737373]">
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#737373]/30 bg-white text-[#1a1a1a] hover:bg-[#FFF4E6] disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4A261] text-[#1a1a1a] hover:bg-[#e9954e]"
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
