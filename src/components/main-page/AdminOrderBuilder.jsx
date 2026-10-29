import { useMemo, useState } from "react";
import RestaurantMenu from "../RestaurantOrderPage/RestaurantMenu.jsx";
import OrderSummary from "../RestaurantOrderPage/OrderSummary.jsx";
import ReferenceMenuImages from "../RestaurantOrderPage/ReferenceMenuImages.jsx";

export default function AdminOrderBuilder({ restaurant, user, onCancel, onPublish }) {
  const [cart, setCart] = useState([]);
  const [collectorName, setCollectorName] = useState(user?.name ?? "");
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [note, setNote] = useState(restaurant.defaultMessage ?? "");
  const [closingPolicy, setClosingPolicy] = useState("manual");
  const [deadline, setDeadline] = useState("");
  const [targetDeliveryAmount, setTargetDeliveryAmount] = useState("");
  const [error, setError] = useState("");
  const [deliveryFees, setDeliveryFees] = useState(5);

  const addToCart = (selectedItems) => {
    setCart((currentCart) => {
      const updatedCart = [...currentCart];

      selectedItems.forEach((selectedItem) => {
        const cartItemId = `${selectedItem.id}-${selectedItem.sizeCode || "default"}`;
        const existingIndex = updatedCart.findIndex(
          (item) => item.cartItemId === cartItemId,
        );

        if (existingIndex >= 0) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity:
              updatedCart[existingIndex].quantity + selectedItem.quantity,
          };
        } else {
          updatedCart.push({
            ...selectedItem,
            cartItemId,
          });
        }
      });

      return updatedCart;
    });
  };

  const updateQuantity = (cartItemId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.cartItemId !== cartItemId),
    );
  };

  const itemsTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const handlePublish = (event) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("اختار صنفًا واحدًا على الأقل قبل نشر الأوردر.");
      return;
    }

    if (closingPolicy === "deadline" && !deadline) {
      setError("حدد آخر موعد لاستقبال الطلبات.");
      return;
    }

    if (
      closingPolicy === "delivery_target" &&
      (!targetDeliveryAmount || Number(targetDeliveryAmount) <= 0)
    ) {
      setError("أدخل هدف رسوم توصيل أكبر من صفر.");
      return;
    }

    onPublish({
      _id: `order_${Date.now()}`,
      restaurant: {
        name: restaurant.nameAr,
        key: restaurant.id,
        menuImage: restaurant.defaultMenuImage,
        deliveryFees,
      },
      collector: {
        name: collectorName.trim() || "كوليكتور",
        roomNumber: roomNumber.trim(),
        phone: phone.trim(),
        note: note.trim(),
      },
      settings: {
        closingPolicy,
        deadline:
          closingPolicy === "deadline" ? new Date(deadline).toISOString() : null,
        targetDeliveryAmount:
          closingPolicy === "delivery_target"
            ? Number(targetDeliveryAmount)
            : null,
      },
      status: "open",
      createdAt: new Date().toISOString(),
      items: cart,
      menuImage: restaurant.defaultMenuImage,
    });
  };

  return (
    <div className="relative z-10 space-y-5 font-cairo" dir="rtl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#737373]/30 pb-4">
        <div>
          <p className="font-oswald text-xs font-bold tracking-widest text-[#737373]">
            {restaurant.nameEn}
          </p>
          <h1 className="text-2xl font-black text-[#1a1a1a] sm:text-3xl">
            منيو {restaurant.nameAr}
          </h1>
          <p className="mt-1 text-sm font-bold text-[#737373]">
            اختار الأصناف والأحجام والكميات، ثم انشر الأوردر للضيوف.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border-2 border-[#4a4a4a] bg-[#737373] px-4 py-2 font-bold text-white transition hover:bg-[#5e5e5e]"
        >
          الرجوع للإعلانات
        </button>
      </header>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <RestaurantMenu
            categories={restaurant.categories}
            sizeLabels={restaurant.sizeLabels}
            onAddToCart={addToCart}
            stickyAction={
              <button
                type="submit"
                form="admin-order-settings-form"
                disabled={cart.length === 0}
                className="w-full rounded-xl border-2 border-[#4a4a4a] bg-[#F4A261] px-4 py-3 font-black text-[#1a1a1a] shadow-sm transition hover:bg-[#e9954e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                نشر الأوردر للضيوف
              </button>
            }
          />
          {restaurant.id === "shakshak" && <ReferenceMenuImages />}
        </div>

        <aside className="space-y-5 xl:sticky xl:top-5 xl:max-h-[calc(100vh-2.5rem)] xl:overflow-y-auto">
          <OrderSummary
            cart={cart}
            itemsTotal={itemsTotal}
            deliveryFees={deliveryFees}
            total={itemsTotal + deliveryFees}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            showSubmit={false}
          />

          <form
            id="admin-order-settings-form"
            onSubmit={handlePublish}
            className="space-y-4 rounded-2xl border-2 border-[#737373]/40 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-black text-[#1a1a1a]">
              بيانات وإعدادات الأوردر
            </h2>

            <label className="block text-sm font-bold text-[#3a3a3a]">
              مصاريف التوصيل للضيف
              <select
                value={deliveryFees}
                onChange={(event) => setDeliveryFees(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
              >
                <option value={5}>5 جنيه</option>
                <option value={10}>10 جنيه</option>
              </select>
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#3a3a3a]">
                اسم الكوليكتور
                <input
                  value={collectorName}
                  onChange={(event) => setCollectorName(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
                />
              </label>
              <label className="text-sm font-bold text-[#3a3a3a]">
                رقم الغرفة
                <input
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
                />
              </label>
              <label className="text-sm font-bold text-[#3a3a3a] sm:col-span-2">
                رقم الهاتف
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
                />
              </label>
            </div>

            <label className="block text-sm font-bold text-[#3a3a3a]">
              ملاحظة الكوليكتور
              <textarea
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
              />
            </label>

            <label className="block text-sm font-bold text-[#3a3a3a]">
              طريقة إغلاق الأوردر
              <select
                value={closingPolicy}
                onChange={(event) => setClosingPolicy(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
              >
                <option value="manual">إغلاق يدوي</option>
                <option value="deadline">موعد نهائي</option>
                <option value="delivery_target">هدف رسوم التوصيل</option>
              </select>
            </label>

            {closingPolicy === "deadline" && (
              <label className="block text-sm font-bold text-[#3a3a3a]">
                آخر موعد لاستقبال الطلبات
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
                />
              </label>
            )}

            {closingPolicy === "delivery_target" && (
              <label className="block text-sm font-bold text-[#3a3a3a]">
                هدف رسوم التوصيل
                <input
                  type="number"
                  min="1"
                  required
                  value={targetDeliveryAmount}
                  onChange={(event) =>
                    setTargetDeliveryAmount(event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-[#737373]/50 bg-[#FFF4E6] px-3 py-2"
                />
              </label>
            )}

            {error && (
              <p role="alert" className="text-sm font-bold text-red-700">
                {error}
              </p>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}
