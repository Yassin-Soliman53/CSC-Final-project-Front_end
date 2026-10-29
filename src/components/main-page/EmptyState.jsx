import { Megaphone, ShoppingBag } from "lucide-react";

export default function EmptyState({ onPlaceOrder }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-orange-200 bg-white/70 px-6 py-12 text-center">
      <div className="mb-5 rounded-2xl bg-orange-100 p-5 text-orange-600">
        <Megaphone size={34} />
      </div>

      <h3 className="text-xl font-black text-gray-800">No announcements yet</h3>

      <p className="mt-2 max-w-sm text-sm leading-7 text-gray-500">
        New restaurant announcements will appear here when they become
        available.
      </p>

      <button
        type="button"
        onClick={onPlaceOrder}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600"
      >
        <ShoppingBag size={18} />
        Place an order
      </button>
    </div>
  );
}
