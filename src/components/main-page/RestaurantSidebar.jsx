import { User, ShieldCheck, Upload } from "lucide-react";
import FoodDoodlePattern from "./FoodDoodlePattern";
import { FOUR_RESTAURANTS_CONFIG } from "./constants/restaurantsConfig";

export default function RestaurantSidebar({
  user,
  isAdmin,
  activeScreen,
  selectedRestaurantKey,
  onSelectRestaurant,
  requestMessage,
  onRequestAdmin,
}) {
  const displayName = user?.name ?? "User";
  const roomNumber = user?.roomNumber ?? "—";
  const phone = user?.phone ?? "—";

  return (
    <aside className="w-full lg:w-85 xl:w-92.5 shrink-0 rounded-[34px] border-[2.5px] border-[#b8926a] bg-[#FFF4E6] p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between relative overflow-hidden">
      <FoodDoodlePattern
        opacity={0.045}
      />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-center rounded-2xl border-2 border-[#4a4a4a] bg-[#636363] py-3.5 px-4 shadow-inner">
          <h2 className="font-oswald text-2xl sm:text-[28px] font-bold tracking-wider text-white uppercase">
            RESTAURANTS
          </h2>
        </div>

        <div className="mb-5 rounded-2xl border border-[#737373]/30 bg-white/80 p-3.5 text-xs">
          <div className="flex items-center gap-2.5 font-black text-[#1a1a1a]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#737373] text-[#FFF4E6]">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-black">{displayName}</p>
              <p className="text-[11px] text-[#555]">
                أوضة {roomNumber} - {phone}
              </p>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="flex flex-col gap-3.5">
            {Object.values(FOUR_RESTAURANTS_CONFIG).map((rest) => {
              const isActive =
                activeScreen === "orderPage" &&
                selectedRestaurantKey === rest.id;
              return (
                <button
                  key={rest.id}
                  type="button"
                  onClick={() => onSelectRestaurant(rest.id)}
                  className={`w-full rounded-full py-2.5 px-5 border-2 transition-all duration-200 flex items-center justify-between cursor-pointer shadow-sm ${
                    isActive
                      ? "bg-[#525252] border-[#1a1a1a] ring-4 ring-[#F4A261]/60 scale-[1.02]"
                      : "bg-[#737373] hover:bg-[#616161] border-[#4f4f4f]"
                  }`}
                >
                  <span className="font-cairo font-black text-lg sm:text-xl text-[#111111]">
                    {rest.nameAr}
                  </span>
                  <span className="font-oswald font-bold text-base sm:text-lg text-[#111111] tracking-wide uppercase">
                    {rest.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#737373]/30 bg-white p-4">
            <div className="flex items-center gap-2 font-black text-[#1a1a1a]">
              <ShieldCheck className="h-5 w-5 text-[#F4A261]" />
              <span>صلاحيات الحساب</span>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#555] font-bold">
              اختيار المطاعم وإصدار إعلان جديد متاح للأدمن (Collector). يمكنك
              طلب الصلاحية هنا:
            </p>
            <button
              type="button"
              onClick={onRequestAdmin}
              className="mt-3 w-full rounded-xl bg-[#737373] hover:bg-[#5a5a5a] py-2.5 text-xs font-black text-[#FFF4E6] cursor-pointer"
            >
              طلب صلاحية Admin
            </button>
            {requestMessage && (
              <p className="mt-2 rounded-xl bg-[#F4A261]/25 p-2.5 text-xs font-bold text-[#1a1a1a]">
                {requestMessage}
              </p>
            )}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="relative z-10 mt-8 pt-3">
          <button
            type="button"
            onClick={() => onSelectRestaurant("custom")}
            className={`w-full rounded-2xl py-2.5 px-4 border-2 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
              activeScreen === "orderPage" && selectedRestaurantKey === "custom"
                ? "bg-[#525252] text-white border-[#1a1a1a] ring-4 ring-[#F4A261]/60"
                : "bg-[#737373] hover:bg-[#616161] text-[#111111] border-[#4f4f4f]"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span className="font-oswald font-bold text-base sm:text-lg tracking-wider uppercase">
              ADD RESTAURANT +
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}
