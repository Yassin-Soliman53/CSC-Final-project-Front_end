import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelMyOrder, getMyOrders } from "../../API/orders.js";

const getOrderId = (order) => order._id || order.id;
const getUserId = (user) => String(user?._id || user?.id || "");

export default function MyOrdersDashboard({ user, onBack }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const response = await getMyOrders();
        if (isMounted) {
          setOrders(Array.isArray(response.orders) ? response.orders : []);
        }
      } catch (requestError) {
        console.error("Could not load the signed-in user's orders:", requestError);
        if (isMounted) {
          setError(requestError.message || "تعذر تحميل طلباتك.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancelOrder = async (order) => {
    const orderId = getOrderId(order);
    if (!window.confirm("هل تريد إلغاء طلبك نهائيًا من هذا الأوردر؟")) {
      return;
    }

    setBusyOrderId(orderId);
    setError("");
    try {
      await cancelMyOrder(orderId);
      setOrders((currentOrders) =>
        currentOrders.filter((currentOrder) => getOrderId(currentOrder) !== orderId),
      );
    } catch (requestError) {
      console.error("Could not cancel the user's order:", requestError);
      setError(requestError.message || "تعذر إلغاء طلبك.");
    } finally {
      setBusyOrderId("");
    }
  };

  return (
    <section className="relative z-10 space-y-5 font-cairo" dir="rtl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#737373]/25 pb-4">
        <div>
          <p className="font-oswald text-xs font-bold tracking-widest text-[#737373]">
            MY ORDERS
          </p>
          <h1 className="mt-1 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
            طلباتي
          </h1>
          <p className="mt-1 text-sm font-bold text-[#737373]">
            عدّل أو ألغِ مشاركتك طالما الأوردر ما زال مفتوحًا.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border-2 border-[#4a4a4a] bg-[#737373] px-4 py-2 font-bold text-white transition hover:bg-[#5e5e5e]"
        >
          الرجوع للإعلانات
        </button>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}

      {isLoading ? (
        <p role="status" className="rounded-xl bg-white p-5 text-sm font-bold">
          جاري تحميل طلباتك...
        </p>
      ) : orders.length === 0 ? (
        <p className="rounded-xl bg-white p-5 text-sm font-bold text-[#555]">
          ليس لديك طلبات مسجلة حاليًا.
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const orderId = getOrderId(order);
            const isParticipant = order.participants?.some(
              (participant) => getUserId(participant.id) === getUserId(user),
            );
            const myOrder = order.participants?.find(
              (participant) => getUserId(participant.id) === getUserId(user),
            );
            const isOpen = order.status === "open";

            return (
              <article
                key={orderId}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#737373]/30 bg-white p-4"
              >
                <div>
                  <h2 className="font-black">
                    {order.restaurant?.name || "أوردر دليفري"}
                  </h2>
                  <p className="mt-1 text-xs font-bold text-[#555]">
                    {isParticipant ? "طلبك" : "أوردر أنشأته"}
                    {" · "}
                    {isOpen ? "مفتوح" : order.status}
                  </p>
                  {myOrder?.items?.length > 0 && (
                    <p className="mt-2 text-sm text-[#555]">
                      {myOrder.items
                        .map((item) => `${item.name} × ${item.quantity}`)
                        .join("، ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/orders/${orderId}`, {
                        state: { announcement: order },
                      })
                    }
                    className="rounded-xl bg-[#F4A261] px-4 py-2 text-sm font-black text-[#1a1a1a]"
                  >
                    عرض / تعديل
                  </button>
                  {isParticipant && isOpen && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order)}
                      disabled={busyOrderId === orderId}
                      className="rounded-xl bg-red-700 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                    >
                      {busyOrderId === orderId ? "جاري الإلغاء..." : "إلغاء طلبي"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
