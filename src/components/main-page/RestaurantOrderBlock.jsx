import { useState } from "react";
import { CheckSquare, Square, Image as ImageIcon, Upload, ZoomIn } from "lucide-react";

export default function RestaurantOrderBlock({
  restaurant,
  isVisible,
  menuImage,
  onUploadMenuImage,
  onIssueOrder,
  onPreviewFullImage,
}) {
  const [checkedItems, setCheckedItems] = useState([restaurant.row1Items[0]?.id]);
  const [selectedSize, setSelectedSize] = useState("S");
  const [announcementMessage, setAnnouncementMessage] = useState(
    restaurant.defaultMessage
  );

  const toggleItem = (itemId) => {
    setCheckedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleIssueClick = () => {
    const allItems = [...restaurant.row1Items, ...restaurant.row2Items];
    const chosenObjects = allItems
      .filter((item) => checkedItems.includes(item.id))
      .map((item) => ({
        id: item.id,
        name: `${item.name} (حجم ${selectedSize})`,
        size: selectedSize,
        quantity: 1,
        price: item.price,
      }));

    onIssueOrder({
      restaurantId: restaurant.id,
      restaurantNameAr: restaurant.nameAr,
      restaurantNameEn: restaurant.nameEn,
      size: selectedSize,
      items:
        chosenObjects.length > 0
          ? chosenObjects
          : [
              {
                id: "default_1",
                name: `طلب خاص من ${restaurant.nameAr} (${selectedSize})`,
                quantity: 1,
              },
            ],
      message: announcementMessage,
      menuImage: menuImage || restaurant.defaultMenuImage,
    });
  };

  return (
    <div className={isVisible ? "block animate-fadeIn" : "hidden"} dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#737373]/30 pb-4">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-[#737373] px-5 py-2 font-oswald text-sm font-bold tracking-wider text-[#FFF4E6]">
            {restaurant.nameEn}
          </span>
          <h2 className="text-3xl font-black text-[#1a1a1a] sm:text-4xl">
            {restaurant.nameAr}
          </h2>
        </div>

        <span className="rounded-full bg-[#F4A261]/30 px-4 py-1.5 text-xs font-black text-[#3a3a3a] border border-[#737373]/40">
          اختار طلبك كـ Admin وارفع المنيو ثم اضغط إصدار
        </span>
      </div>

      <div className="space-y-5 rounded-3xl bg-white/80 p-5 sm:p-6 border-2 border-[#737373]/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-[#737373]/20 pb-4">
          <div className="w-36 shrink-0">
            <span className="inline-block rounded-xl bg-[#737373] px-4 py-2 text-base font-black text-[#FFF4E6] shadow-sm">
              {restaurant.row1Label} :
            </span>
          </div>

          <div className="grid flex-1 grid-cols-2 sm:grid-cols-4 gap-3">
            {restaurant.row1Items.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-right transition-all cursor-pointer ${
                    isChecked
                      ? "border-[#1a1a1a] bg-[#F4A261] text-[#1a1a1a] shadow-md scale-[1.02]"
                      : "border-[#737373]/40 bg-[#FFF4E6] text-[#3a3a3a] hover:border-[#737373]"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="h-5 w-5 shrink-0 text-[#1a1a1a]" />
                  ) : (
                    <Square className="h-5 w-5 shrink-0 text-[#737373]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-black">{item.name}</p>
                    <p className="text-[11px] font-bold opacity-80">{item.price} ج.م</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-[#737373]/20 pb-4">
          <div className="w-36 shrink-0">
            <span className="inline-block rounded-xl bg-[#737373] px-4 py-2 text-base font-black text-[#FFF4E6] shadow-sm">
              {restaurant.row2Label} :
            </span>
          </div>

          <div className="grid flex-1 grid-cols-2 sm:grid-cols-4 gap-3">
            {restaurant.row2Items.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-right transition-all cursor-pointer ${
                    isChecked
                      ? "border-[#1a1a1a] bg-[#F4A261] text-[#1a1a1a] shadow-md scale-[1.02]"
                      : "border-[#737373]/40 bg-[#FFF4E6] text-[#3a3a3a] hover:border-[#737373]"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="h-5 w-5 shrink-0 text-[#1a1a1a]" />
                  ) : (
                    <Square className="h-5 w-5 shrink-0 text-[#737373]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-black">{item.name}</p>
                    <p className="text-[11px] font-bold opacity-80">{item.price} ج.م</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
          <div className="w-36 shrink-0">
            <span className="inline-block rounded-xl bg-[#737373] px-4 py-2 text-base font-black text-[#FFF4E6] shadow-sm">
              الحجم :
            </span>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            {["S", "M", "L"].map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className="group flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <span className="font-oswald text-xl font-bold text-[#1a1a1a]">
                    {size}
                  </span>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all ${
                      active
                        ? "border-[#1a1a1a] bg-[#F4A261] shadow-md scale-110"
                        : "border-[#737373] bg-[#FFF4E6] group-hover:bg-[#F4A261]/30"
                    }`}
                  >
                    {active && <CheckSquare className="h-5 w-5 text-[#1a1a1a]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex-1 mt-2 sm:mt-0">
            <input
              type="text"
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="رسالة الكوليكتور التي ستظهر مع الأوردر..."
              className="w-full rounded-2xl border-2 border-[#737373]/50 bg-[#FFF4E6] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border-[3px] border-[#4a4a4a] bg-white/90 p-4 sm:p-6 shadow-md">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-[#737373]" />
            <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
              صورة المنيو الكاملة ({restaurant.nameAr})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-full bg-[#F4A261] hover:bg-[#e58e49] px-4 py-2 text-xs font-black text-[#1a1a1a] border-2 border-[#4a4a4a] shadow-sm cursor-pointer transition">
              <Upload className="h-4 w-4" />
              <span>ارفع صورة المنيو من جهازك</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    onUploadMenuImage(restaurant.id, url);
                  }
                }}
              />
            </label>

            <button
              type="button"
              onClick={() =>
                onPreviewFullImage(menuImage || restaurant.defaultMenuImage)
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-[#737373] hover:bg-[#5a5a5a] px-3.5 py-2 text-xs font-bold text-[#FFF4E6] cursor-pointer"
            >
              <ZoomIn className="h-4 w-4 text-[#F4A261]" />
              <span>تكبير</span>
            </button>
          </div>
        </div>

        <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#737373] bg-[#FFF4E6] flex items-center justify-center group">
          <img
            src={menuImage || restaurant.defaultMenuImage}
            alt={`منيو ${restaurant.nameAr}`}
            className="h-full w-full object-contain bg-black/5"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded-2xl bg-[#FFF4E6]/95 px-5 py-2.5 text-base font-black text-[#1a1a1a] shadow-lg">
              صورة المنيو — اضغط "ارفع صورة المنيو" لتغييرها بصورتك
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 flex justify-center">
        <button
          type="button"
          onClick={handleIssueClick}
          className="w-full max-w-xs rounded-2xl border-[3px] border-[#2b2b2b] bg-[#737373] hover:bg-[#5c5c5c] py-3.5 px-10 text-2xl sm:text-3xl font-black text-[#111111] shadow-[0_6px_0_#2b2b2b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          إصدار
        </button>
      </div>
    </div>
  );
}