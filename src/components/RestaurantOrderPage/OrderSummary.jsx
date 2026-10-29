import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";

export default function OrderSummary({
  cart = [],
  itemsTotal,
  deliveryFees = 0,
  total,
  onUpdateQuantity,
  onRemove,
  showSubmit = true,
  onSubmitOrder,
  submitLabel = "متابعة الطلب",
  submitContent,
}) {
  const calculatedItemsTotal =
    itemsTotal ??
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculatedTotal = total ?? calculatedItemsTotal + deliveryFees;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#737373]/30 bg-white/90 shadow-sm">
      <div className="border-b border-[#737373]/15 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4A261]/20 text-[#737373]">
            <ShoppingBag size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">ملخص الطلب</h2>

            <p className="mt-1 text-sm text-[#737373]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} قطعة
            </p>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <ShoppingBag size={34} className="mx-auto mb-3 text-[#737373]/40" />

          <h3 className="font-semibold text-[#1a1a1a]">الطلب لسه فاضي</h3>

          <p className="mt-2 text-sm leading-6 text-[#737373]">
            اختار الأصناف والأحجام من المنيو، وبعدها أضفها للطلب.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#737373]/15">
          {cart.map((item) => (
            <div key={item.cartItemId} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-bold text-[#1a1a1a]">
                    {item.name}
                  </h3>

                  {item.sizeName && (
                    <p className="mt-1 text-xs text-[#737373]">
                      الحجم: {item.sizeName}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-[#737373]">
                    {item.price} ج.م × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-[#1a1a1a]">
                  {(item.price * item.quantity).toFixed(2)} ج.م
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                    aria-label="تقليل الكمية"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#737373]/30 text-[#1a1a1a] hover:bg-[#FFF4E6]"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-5 text-center text-sm font-bold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                    aria-label="زيادة الكمية"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#737373]/30 text-[#1a1a1a] hover:bg-[#FFF4E6]"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item.cartItemId)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 border-t border-[#737373]/15 bg-[#FFF4E6] p-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[#737373]">إجمالي الأصناف</span>

          <span className="font-semibold text-[#1a1a1a]">
            {calculatedItemsTotal.toFixed(2)} ج.م
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <Truck size={16} />
            مصاريف التوصيل
          </span>

          <span className="font-semibold text-[#1a1a1a]">
            {Number(deliveryFees).toFixed(2)} ج.م
          </span>
        </div>

        <div className="border-t border-[#737373]/20 pt-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[#1a1a1a]">الإجمالي النهائي</span>

            <span className="text-xl font-extrabold text-[#737373]">
              {calculatedTotal.toFixed(2)} ج.م
            </span>
          </div>
        </div>

        {showSubmit && (
          <>
            {submitContent}
            <button
              type="button"
              disabled={cart.length === 0 || !onSubmitOrder}
              onClick={onSubmitOrder}
              className="w-full rounded-xl bg-[#737373] px-4 py-3 font-bold text-white transition hover:bg-[#5e5e5e] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {submitLabel}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
