import { useState } from "react";
import {
  User,
  Utensils,
  Phone,
  DoorOpen,
  ShieldCheck,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";

export default function UserSidebar({ user }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const restaurants = [
    { id: 1, name: "Restaurant One" },
    { id: 2, name: "Restaurant Two" },
    { id: 3, name: "Restaurant Three" },
  ];

  const displayName = user?.name ?? "User";
  const roomNumber = user?.roomNumber ?? "—";
  const phone = user?.phone ?? "—";

  return (
    <aside className="min-w-0 rounded-3xl bg-[#FFF9F0] p-4 shadow-sm sm:p-5">
      <div className="mb-5 overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-[#F4A261] p-5 text-white">
          <div className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full border-[18px] border-white/10" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-white/60 bg-white/20">
              <User size={31} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold text-white/80">
                Welcome back
              </p>

              <h2 className="break-words text-xl font-black">{displayName}</h2>

              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold">
                <ShieldCheck size={13} />
                User account
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-3">
          <div className="flex items-center gap-3 rounded-2xl bg-orange-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <DoorOpen size={20} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500">Room number</p>
              <p className="mt-1 font-black text-gray-800">{roomNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-orange-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Phone size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-500">Phone number</p>
              <p className="break-words text-sm font-black text-gray-800">
                {phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black tracking-wider text-gray-500">
          RESTAURANTS
        </h3>

        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
          {restaurants.length}
        </span>
      </div>

      <div className="space-y-2">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            type="button"
            onClick={() => setSelectedRestaurant(restaurant.id)}
            className={`flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-right transition ${
              selectedRestaurant === restaurant.id
                ? "border-orange-300 bg-orange-50"
                : "border-transparent bg-white hover:border-orange-200 hover:bg-orange-50"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Utensils size={18} />
            </div>

            <span className="min-w-0 flex-1 text-sm font-bold text-gray-700">
              {restaurant.name}
            </span>

            <ChevronLeft size={17} className="shrink-0 text-gray-400" />
          </button>
        ))}
      </div>

      {selectedRestaurant !== null && (
        <p className="mt-3 rounded-xl bg-orange-50 p-3 text-xs leading-6 text-gray-600">
          Restaurant selected. Connect the selection to your application logic.
        </p>
      )}

      <div className="my-5 border-t border-orange-100" />

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-4 font-extrabold text-white shadow-sm transition hover:bg-orange-600"
      >
        <ShoppingBag size={19} />
        Place an order
      </button>
    </aside>
  );
}
