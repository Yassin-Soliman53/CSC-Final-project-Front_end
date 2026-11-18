import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantMenu from "../components/RestaurantOrderPage/RestaurantMenu.jsx";
import OrderSummary from "../components/RestaurantOrderPage/OrderSummary.jsx";
import ReferenceMenuImages from "../components/RestaurantOrderPage/ReferenceMenuImages.jsx";
import { FOUR_RESTAURANTS_CONFIG } from "../components/main-page/constants/restaurantsConfig.js";
import {
  cancelMyOrder,
  getOrder,
  joinOrder,
  updateMyOrder,
} from "../API/orders.js";
import useAuth from "../providers/useAuth.js";

const getUserId = (user) => String(user?._id || user?.id || "");

function toCartItems(items = []) {
  return items.map((item, index) => ({
    id: item.name,
    cartItemId: `${item.name}-${index}`,
    name: item.name,
    price: Number(item.price || 0),
    quantity: Number(item.quantity),
  }));
}

export default function RestaurantOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [cart, setCart] = useState([]);
  const [customOrderText, setCustomOrderText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await getOrder(id);
        if (!isMounted) {
          return;
        }

        const currentOrder = response.order;
        const currentParticipant = currentOrder.participants?.find(
          (entry) => String(entry.id?._id || entry.id) === getUserId(user),
        );
        setOrder(currentOrder);
        setParticipant(currentParticipant || null);
        setCart(toCartItems(currentParticipant?.items));
      } catch (error) {
        console.error("Could not load group order:", error);
        if (isMounted) {
          setOrder(null);
          setErrorMessage(error.message || "تعذر تحميل بيانات الأوردر.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const restaurantKey = order?.restaurant?.key;
  const restaurantConfig = FOUR_RESTAURANTS_CONFIG[restaurantKey];
  const hasInteractiveMenu = Boolean(restaurantConfig?.categories?.length);
  const menuImage =
    order?.menuImage ||
    order?.restaurant?.menuImage ||
    restaurantConfig?.defaultMenuImage ||
    "";
  const deliveryFees = Math.max(0, Number(order?.deliveryFees || 0));

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
            price: Number(selectedItem.price || 0),
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
    () => cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [cart],
  );
  const total = itemsTotal + deliveryFees;

  const handleSubmitOrder = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (cart.length === 0 && !customOrderText.trim()) {
      setErrorMessage("اختار صنفًا أو اكتب طلبك قبل التأكيد.");
      return;
    }

    const items = cart.map((item) => ({
      name: [
        item.name,
        item.sizeName || item.sizeCode || "",
      ]
        .filter(Boolean)
        .join(" - "),
      quantity: item.quantity,
      price: Number(item.price || 0),
    }));
    if (customOrderText.trim()) {
      items.push({ name: customOrderText.trim(), quantity: 1 });
    }

    setIsSubmitting(true);
    try {
      const response = participant
        ? await updateMyOrder(id, { items })
        : await joinOrder(id, { items });
      const savedParticipant =
        response.participant ||
        response.order.participants?.find(
          (entry) =>
            String(entry.id?._id || entry.id) === getUserId(user),
        );
      setOrder(response.order);
      setParticipant(savedParticipant || participant);
      setCart(toCartItems(savedParticipant?.items || items));
      setCustomOrderText("");
      setSuccessMessage(
        participant ? "تم تحديث طلبك." : "تم تسجيل طلبك بنجاح.",
      );
    } catch (error) {
      console.error("Could not save the user's group order:", error);
      setErrorMessage(error.message || "تعذر حفظ الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("هل تريد إلغاء طلبك نهائيًا من هذا الأوردر؟")) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await cancelMyOrder(id);
      navigate("/homepage", { replace: true });
    } catch (error) {
      console.error("Could not cancel the user's group order:", error);
      setErrorMessage(error.message || "تعذر إلغاء طلبك.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F4A261] p-6" dir="rtl">
        <p role="status" className="mx-auto max-w-3xl rounded-2xl bg-[#FFF4E6] p-6 font-bold">
          جاري تحميل الأوردر...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#F4A261] p-6" dir="rtl">
        <div className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-[#FFF4E6] p-6">
          <p role="alert" className="font-bold text-red-700">
            {errorMessage || "الأوردر غير موجود."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/homepage", { replace: true })}
            className="rounded-xl bg-[#737373] px-4 py-2 font-bold text-white"
          >
            الرجوع للإعلانات
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F4A261] px-3 py-5 text-[#1a1a1a] sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl space-y-6 rounded-[30px] border-2 border-[#b8926a] bg-[#FFF4E6] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:p-7">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#737373]/25 pb-5">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#737373]">
              DELIVERY ORDER
            </p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">
              أوردر {order.restaurant?.name || "دليفري"}
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
            onClick={() => navigate("/homepage")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#4a4a4a] bg-[#737373] px-4 py-2 font-bold text-white transition hover:bg-[#5e5e5e]"
          >
            <ArrowLeft size={17} />
            الرجوع للإعلانات
          </button>
        </header>

        {menuImage && !hasInteractiveMenu && (
          <a
            href={menuImage}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            <img
              src={menuImage}
              alt={`منيو ${order.restaurant?.name || "المطعم"}`}
              className="mx-auto max-h-[700px] w-full object-contain"
            />
          </a>
        )}

        {errorMessage && (
          <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-800">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p role="status" className="rounded-xl border border-green-300 bg-green-50 p-3 text-sm font-bold text-green-800">
            {successMessage}
          </p>
        )}

        {order.status !== "open" && (
          <p className="rounded-xl bg-white p-3 text-sm font-bold text-[#555]">
            الأوردر مغلق، لا يمكن إرسال طلب جديد أو تعديل طلبك.
          </p>
        )}

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
                      <p className="text-xs font-bold text-[#555]">
                        الطلب باسم {user?.name || "حسابك"} · {user?.phone || ""}
                      </p>
                      <button
                        type="button"
                        disabled={
                          isSubmitting ||
                          order.status !== "open" ||
                          (cart.length === 0 && !customOrderText.trim())
                        }
                        onClick={handleSubmitOrder}
                        className="w-full rounded-xl bg-[#737373] px-4 py-3 font-bold text-white transition hover:bg-[#5e5e5e] disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {isSubmitting
                          ? "جاري الحفظ..."
                          : participant
                            ? "تحديث طلبي"
                            : "تأكيد الطلب"}
                      </button>
                    </div>
                  }
                />
                {restaurantKey === "shakshak" && <ReferenceMenuImages />}
              </>
            ) : menuImage ? (
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-bold">
                  اكتب الطلب كما يظهر في المنيو
                </h2>
                <textarea
                  rows={4}
                  value={customOrderText}
                  onChange={(event) => setCustomOrderText(event.target.value)}
                  disabled={order.status !== "open"}
                  placeholder="الأصناف والكميات والتفاصيل..."
                  className="w-full rounded-xl border border-[#737373]/40 bg-white px-3 py-2 outline-none focus:border-[#F4A261] disabled:bg-gray-100"
                />
                <p className="text-xs font-bold text-[#555]">
                  الطلب باسم {user?.name || "حسابك"} · {user?.phone || ""}
                </p>
                <button
                  type="button"
                  disabled={
                    isSubmitting ||
                    order.status !== "open" ||
                    (cart.length === 0 && !customOrderText.trim())
                  }
                  onClick={handleSubmitOrder}
                  className="w-full rounded-xl bg-[#737373] px-4 py-3 font-bold text-white transition hover:bg-[#5e5e5e] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isSubmitting
                    ? "جاري الحفظ..."
                    : participant
                      ? "تحديث طلبي"
                      : "تأكيد الطلب"}
                </button>
              </div>
            ) : (
              <p className="rounded-2xl bg-white p-6 text-center font-bold">
                لا توجد منيو متاحة لهذا الأوردر.
              </p>
            )}
          </section>

          <aside className="space-y-3 lg:sticky lg:top-6">
            <OrderSummary
              cart={cart}
              itemsTotal={itemsTotal}
              deliveryFees={deliveryFees}
              total={total}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              showSubmit={false}
            />
            {participant && order.status === "open" && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-red-700 px-4 py-3 font-bold text-white transition hover:bg-red-800 disabled:opacity-60"
              >
                إلغاء طلبي نهائيًا
              </button>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
