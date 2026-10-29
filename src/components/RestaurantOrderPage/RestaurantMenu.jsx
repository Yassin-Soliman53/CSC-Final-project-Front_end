import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, ShoppingBag, X } from "lucide-react";
import MenuItemCard from "./MenuItemCard";

export default function RestaurantMenu({
  categories = [],
  sizeLabels = {},
  onAddToCart,
  stickyAction,
}) {
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState({});

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          String(item.name || "")
            .toLowerCase()
            .includes(query),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, search]);

  const selectedCount = Object.values(selectedItems).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const selectedTotal = Object.values(selectedItems).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const updateSelection = (item, sizeCode, price, quantity) => {
    const selectionId = `${item.id}-${sizeCode || "default"}`;

    setSelectedItems((current) => {
      const next = { ...current };

      if (quantity <= 0) {
        delete next[selectionId];
      } else {
        next[selectionId] = {
          id: item.id,
          name: item.name,
          sizeCode: sizeCode || null,
          sizeName: sizeCode ? sizeLabels[sizeCode] || sizeCode : null,
          price,
          quantity,
        };
      }

      return next;
    });
  };

  const confirmSelection = () => {
    const items = Object.values(selectedItems);

    if (!items.length) return;

    onAddToCart(items);
    setSelectedItems({});
  };

  const clearSelection = () => {
    setSelectedItems({});
  };

  const selectionActions = (
    <section
      dir="rtl"
      className="fixed bottom-3 left-3 right-3 z-50 max-h-[calc(100dvh-1.5rem)] space-y-2 overflow-y-auto rounded-2xl border border-[#737373]/30 bg-white/95 p-3 shadow-xl backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-auto sm:w-80 sm:p-4"
    >
      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FFF4E6] px-3 py-2">
        <div>
          <p className="text-sm font-bold text-[#1a1a1a]">الأصناف المحددة</p>

          <p className="mt-1 text-xs text-[#737373]">{selectedCount} قطعة</p>
        </div>

        <p className="text-lg font-extrabold text-[#1a1a1a]">
          {selectedTotal.toFixed(2)} ج.م
        </p>
      </div>

      <button
        type="button"
        onClick={confirmSelection}
        disabled={selectedCount === 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F4A261] px-4 py-3 font-bold text-[#1a1a1a] transition hover:bg-[#e9954e] disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <ShoppingBag size={19} />
        إضافة الأصناف المحددة للطلب
      </button>

      {stickyAction}

      {selectedCount > 0 && (
        <button
          type="button"
          onClick={clearSelection}
          className="mt-2 w-full rounded-lg py-2 text-sm font-semibold text-[#737373] hover:bg-[#FFF4E6] hover:text-[#1a1a1a]"
        >
          إلغاء الاختيارات
        </button>
      )}
    </section>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#737373]/30 bg-white/90 p-4 shadow-sm">
        <label
          htmlFor="restaurant-menu-search"
          className="mb-2 block text-sm font-bold text-[#1a1a1a]"
        >
          البحث في المنيو
        </label>

        <div className="relative">
          <Search
            size={19}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373]"
          />

          <input
            id="restaurant-menu-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث عن صنف..."
            className="w-full rounded-xl border border-[#737373]/40 bg-[#FFF4E6] py-3 pr-10 pl-10 text-sm outline-none transition focus:border-[#F4A261] focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="مسح البحث"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#737373] hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {search.trim() && (
          <p className="mt-2 text-xs text-[#737373]">نتائج البحث عن: {search}</p>
        )}
      </section>

      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#737373]/40 bg-white/90 px-5 py-12 text-center">
          <Search size={30} className="mx-auto mb-3 text-[#737373]" />

          <h3 className="font-bold text-[#1a1a1a]">مفيش أصناف مطابقة للبحث</h3>

          <p className="mt-2 text-sm text-[#737373]">
            جرّب اسم صنف تاني أو امسح البحث.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-[#737373] hover:bg-[#FFF4E6]"
          >
            مسح البحث
          </button>
        </div>
      ) : (
        filteredCategories.map((category) => (
          <section key={category.id} className="space-y-4">
            <h2 className="border-r-4 border-[#F4A261] pr-3 text-lg font-bold text-[#1a1a1a]">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  sizeLabels={sizeLabels}
                  selectedItems={selectedItems}
                  onSelectionChange={updateSelection}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {createPortal(selectionActions, document.body)}
    </div>
  );
}
