import { useMemo, useState } from "react";
import { Search, ShoppingBag, X } from "lucide-react";
import MenuItemCard from "./MenuItemCard";

export default function RestaurantMenu({
  categories = [],
  sizeLabels = {},
  onAddToCart,
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

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label
          htmlFor="restaurant-menu-search"
          className="mb-2 block text-sm font-bold text-gray-800"
        >
          البحث في المنيو
        </label>

        <div className="relative">
          <Search
            size={19}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="restaurant-menu-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث عن صنف..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-10 pl-10 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="مسح البحث"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {search.trim() && (
          <p className="mt-2 text-xs text-gray-500">نتائج البحث عن: {search}</p>
        )}
      </section>

      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <Search size={30} className="mx-auto mb-3 text-gray-400" />

          <h3 className="font-bold text-gray-800">مفيش أصناف مطابقة للبحث</h3>

          <p className="mt-2 text-sm text-gray-500">
            جرّب اسم صنف تاني أو امسح البحث.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
          >
            مسح البحث
          </button>
        </div>
      ) : (
        filteredCategories.map((category) => (
          <section key={category.id} className="space-y-4">
            <h2 className="border-r-4 border-orange-500 pr-3 text-lg font-bold text-gray-900">
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

      <section className="sticky bottom-3 z-20 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-800">الأصناف المحددة</p>

            <p className="mt-1 text-xs text-gray-500">{selectedCount} قطعة</p>
          </div>

          <p className="text-lg font-extrabold text-gray-900">
            {selectedTotal.toFixed(2)} ج.م
          </p>
        </div>

        <button
          type="button"
          onClick={confirmSelection}
          disabled={selectedCount === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <ShoppingBag size={19} />
          إضافة الأصناف المحددة للطلب
        </button>

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className="mt-2 w-full rounded-lg py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            إلغاء الاختيارات
          </button>
        )}
      </section>
    </div>
  );
}
