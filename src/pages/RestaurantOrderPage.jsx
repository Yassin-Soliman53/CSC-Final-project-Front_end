import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import RestaurantMenu from "..//components/RestaurantOrderPage/RestaurantMenu";
import OrderSummary from "../components/RestaurantOrderPage/OrderSummary";
import ReferenceMenuImages from "../components/RestaurantOrderPage/ReferenceMenuImages.jsx";
import { FOUR_RESTAURANTS_CONFIG } from "../components/main-page/constants/restaurantsConfig.js";
import { getGuestOrders, saveGuestOrder } from "../utils/guestOrderStorage.js";
import {
  getStoredAnnouncements,
  isAnnouncementConditionMet,
  saveAnnouncements,
} from "../utils/announcementStorage.js";
import shakshakBrandImage from "../assets/images/Gemini_Generated_Image_gtewtogtewtogtew.jpg";

const mockOrder = {
  _id: "671a2b3c4d5e6f7890123456",
  restaurant: {
    name: "شكشك",
    key: "shakshak",
    address: "6th of October City, Giza, Egypt",
    deliveryFees: 5,
  },
  collector: {
    id: "671a2b3c4d5e6f7890123457",
    name: "Ahmed Mohamed",
    roomNumber: 204,
    phone: "01012345678",
    note: "Please call me when the order arrives.",
  },
  settings: {
    closingPolicy: "manual",
    deadline: null,
    targetDeliveryAmount: null,
  },
  status: "open",
  createdAt: "2026-10-27T10:00:00.000Z",
  updatedAt: "2026-10-27T10:00:00.000Z",
};

export default function RestaurantOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [customOrderText, setCustomOrderText] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const order = location.state?.announcement || mockOrder;

  const restaurantKey = order.restaurant?.key;
  const restaurantConfig = FOUR_RESTAURANTS_CONFIG[restaurantKey];

  const hasInteractiveMenu = Boolean(restaurantConfig?.categories?.length);

  const menuImage =
    restaurantConfig?.defaultMenuImage ||
    order.restaurant?.menuImage ||
    order.restaurant?.menuImageUrl ||
    "";

  const deliveryFees = Math.max(
    0,
    Number(
      order.restaurant?.deliveryFees ?? restaurantConfig?.deliveryFees ?? 5,
    ) || 0,
  );

  const addToCart = (selectedItems) => {
    setCart((currentCart) => {
      const updatedCart = [...currentCart];

      selectedItems.forEach((selectedItem) => {
        const cartItemId = `${selectedItem.id}-${selectedItem.sizeCode || "default"}`;

        const existingIndex = updatedCart.findIndex(
          (item) => item.cartItemId === cartItemId,
        );

        if (existingIndex !== -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity:
              updatedCart[existingIndex].quantity + selectedItem.quantity,
          };
        } else {
          updatedCart.push({
            id: selectedItem.id,
            name: selectedItem.name,
            cartItemId,
            sizeCode: selectedItem.sizeCode || null,
            sizeName: selectedItem.sizeName || null,
            price: selectedItem.price,
            quantity: selectedItem.quantity,
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
            ? {
                ...item,
                quantity: item.quantity + change,
              }
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

  const total = itemsTotal + deliveryFees;

  const handleSubmitOrder = () => {
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const currentGuestOrders = getGuestOrders();
      const savedAnnouncements = getStoredAnnouncements();
      const orderId = order._id || order.id;
      const savedAnnouncement = savedAnnouncements.find(
        (announcement) =>
          (announcement._id || announcement.id) === orderId,
      );
      const currentAnnouncement = savedAnnouncement || order;
      const conditionMet = isAnnouncementConditionMet(
        currentAnnouncement,
        currentGuestOrders,
      );

      if (currentAnnouncement.status !== "open" || conditionMet) {
        if (conditionMet && savedAnnouncement) {
          saveAnnouncements(
            savedAnnouncements.map((announcement) =>
              (announcement._id || announcement.id) === orderId
                ? {
                    ...announcement,
                    status: "closed",
                    closedAt: new Date().toISOString(),
                  }
                : announcement,
            ),
          );
        }
        setSubmitError("الإعلان اتقفل أو انتهى شرطه، ومبقاش يستقبل طلبات.");
        return;
      }
    } catch (error) {
      console.error("Could not verify announcement status:", error);
      setSubmitError("تعذر التأكد من حالة الإعلان. حاول تحديث الصفحة.");
      return;
    }

    const normalizedWhatsApp = whatsapp.replace(/\D/g, "");
    if (!customerName.trim() || !normalizedWhatsApp) {
      setSubmitError("اكتب اسمك ورقم WhatsApp لإرسال الطلب.");
      return;
    }

    if (cart.length === 0 && !customOrderText.trim()) {
      setSubmitError("اكتب طلبك أو اختار صنفًا من المنيو.");
      return;
    }

    if (normalizedWhatsApp.length < 8 || normalizedWhatsApp.length > 15) {
      setSubmitError("رقم WhatsApp لازم يكون من 8 إلى 15 رقمًا.");
      return;
    }

    const guestOrder = {
      id: `guest_${Date.now()}`,
      announcementId: order._id || order.id,
      restaurantKey,
      restaurantName: order.restaurant?.name || "المطعم",
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      items: cart,
      itemsTotal,
      deliveryFees,
      total,
      customRequest: customOrderText.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      saveGuestOrder(guestOrder);
      setSubmitSuccess("تم تسجيل طلبك بنجاح.");
      setCart([]);
      setCustomOrderText("");
    } catch (error) {
      console.error("Could not save guest order:", error);
      setSubmitError("تعذر حفظ الطلب في هذا الجهاز. حاول مرة أخرى.");
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F4A261] px-3 py-5 text-[#1a1a1a] sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl space-y-6 rounded-[30px] border-2 border-[#b8926a] bg-[#FFF4E6] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:p-7">
        {restaurantKey === "shakshak" && (
          <div className="overflow-hidden rounded-2xl border-2 border-[#737373]/30 bg-[#080d26]">
            <img
              src={shakshakBrandImage}
              alt="شكشك - بيتزا وفطائر وحواوشي"
              className="aspect-[2.4/1] w-full object-cover object-center"
            />
          </div>
        )}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#737373]/25 pb-5">
          <div>
            <p className="font-oswald text-xs font-bold tracking-widest text-[#737373]">
              DELIVERY ORDER
            </p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">
              {order.restaurant?.name
                ? `أوردر ${order.restaurant.name}`
                : "تفاصيل الأوردر"}
            </h1>
            <p className="mt-2 text-sm font-bold text-[#737373]">
              {order.collector?.name || "كوليكتور"}
              {order.collector?.roomNumber
                ? ` · أوضة ${order.collector.roomNumber}`
                : ""}
              {order.collector?.phone ? ` · ${order.collector.phone}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#4a4a4a] bg-[#737373] px-4 py-2 font-bold text-white transition hover:bg-[#5e5e5e]"
          >
            <ArrowLeft size={17} />
            الرجوع للإعلانات
          </button>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            {hasInteractiveMenu ? (
              <>
                <RestaurantMenu
                  categories={restaurantConfig.categories}
                  sizeLabels={restaurantConfig.sizeLabels}
                  onAddToCart={addToCart}
                  stickyAction={
                    <div className="space-y-2 border-t border-[#737373]/15 pt-2">
                      <label className="block text-sm font-bold text-[#1a1a1a]">
                        اسمك
                        <input
                          type="text"
                          autoComplete="name"
                          value={customerName}
                          onChange={(event) =>
                            setCustomerName(event.target.value)
                          }
                          placeholder="اكتب اسمك"
                          className="mt-1 w-full rounded-xl border border-[#737373]/40 bg-white px-3 py-2 outline-none focus:border-[#F4A261]"
                        />
                      </label>
                      <label className="block text-sm font-bold text-[#1a1a1a]">
                        رقم WhatsApp
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={whatsapp}
                          onChange={(event) => setWhatsapp(event.target.value)}
                          placeholder="مثال: 01012345678"
                          className="mt-1 w-full rounded-xl border border-[#737373]/40 bg-white px-3 py-2 outline-none focus:border-[#F4A261]"
                        />
                      </label>
                      {submitError && (
                        <p role="alert" className="text-sm font-bold text-red-700">
                          {submitError}
                        </p>
                      )}
                      {submitSuccess && (
                        <p role="status" className="text-sm font-bold text-green-700">
                          {submitSuccess}
                        </p>
                      )}
                      <button
                        type="button"
                        disabled={cart.length === 0}
                        onClick={handleSubmitOrder}
                        className="w-full rounded-xl bg-[#737373] px-4 py-3 font-bold text-white transition hover:bg-[#5e5e5e] disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        تأكيد الطلب
                      </button>
                    </div>
                  }
                />
                {restaurantKey === "shakshak" && <ReferenceMenuImages />}
              </>
            ) : menuImage ? (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    منيو {order.restaurant?.name || "المطعم"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    اكتب طلبك كما هو ظاهر في صورة المنيو، وسيحدد الكوليكتور السعر.
                  </p>
                </div>

                <a
                  href={menuImage}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-gray-100"
                  aria-label="فتح صورة المنيو بالحجم الكامل"
                >
                  <img
                    src={menuImage}
                    alt={`منيو ${order.restaurant?.name || "المطعم"}`}
                    className="mx-auto h-auto max-h-[1000px] w-full object-contain"
                    loading="lazy"
                  />
                </a>
                <div className="space-y-4 p-5">
                  <label className="block text-sm font-bold text-[#1a1a1a]">
                    اكتب طلبك
                    <textarea
                      rows={4}
                      value={customOrderText}
                      onChange={(event) =>
                        setCustomOrderText(event.target.value)
                      }
                      placeholder="اكتب الأصناف والكميات وأي تفاصيل أو إضافات تريدها..."
                      className="mt-2 w-full resize-y rounded-xl border border-[#737373]/40 bg-white px-3 py-2 outline-none focus:border-[#F4A261]"
                    />
                  </label>
                  <label className="block text-sm font-bold text-[#1a1a1a]">
                    اسمك
                    <input
                      type="text"
                      autoComplete="name"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="اكتب اسمك"
                      className="mt-1 w-full rounded-xl border border-[#737373]/40 bg-white px-3 py-2 outline-none focus:border-[#F4A261]"
                    />
                  </label>
                  <label className="block text-sm font-bold text-[#1a1a1a]">
                    رقم WhatsApp
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={whatsapp}
                      onChange={(event) => setWhatsapp(event.target.value)}
                      placeholder="مثال: 01012345678"
                      className="mt-1 w-full rounded-xl border border-[#737373]/40 bg-white px-3 py-2 outline-none focus:border-[#F4A261]"
                    />
                  </label>
                  <p className="text-sm font-bold text-[#737373]">
                    سعر الأصناف المكتوبة يحدده الكوليكتور بعد مراجعة الطلب.
                  </p>
                  {submitError && (
                    <p role="alert" className="text-sm font-bold text-red-700">
                      {submitError}
                    </p>
                  )}
                  {submitSuccess && (
                    <p role="status" className="text-sm font-bold text-green-700">
                      {submitSuccess}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={!customOrderText.trim()}
                    className="w-full rounded-xl bg-[#737373] px-4 py-3 font-bold text-white transition hover:bg-[#5e5e5e] disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    تأكيد الطلب
                  </button>
                </div>
              </section>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  لا توجد صورة للمنيو
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  لم يتم توفير منيو تفاعلية أو صورة لهذا المطعم.
                </p>
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-6">
            <OrderSummary
              cart={cart}
              itemsTotal={itemsTotal}
              deliveryFees={deliveryFees}
              total={total}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              showSubmit={false}
            />
          </aside>
        </div>

      </div>
    </main>
  );
}
