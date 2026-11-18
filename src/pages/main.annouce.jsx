import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Megaphone,
  Upload,
  CheckCircle2,
  ClipboardList,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import FoodDoodlePattern from "../components/main-page/FoodDoodlePattern.jsx";
import AdminOrderBuilder from "../components/main-page/AdminOrderBuilder.jsx";
import CustomUploadRestaurantBlock from "../components/main-page/CustomUploadRestaurantBlock.jsx";
import AnnouncementCard from "../components/main-page/AnnouncementCard.jsx";
import QuickPickerModal from "../components/main-page/QuickPickerModal.jsx";
import ZoomedImageModal from "../components/main-page/ZoomedImageModal.jsx";
import RestaurantSidebar from "../components/main-page/RestaurantSidebar.jsx";
import EmptyState from "../components/main-page/EmptyState.jsx";
import LoadingState from "../components/main-page/LoadingState.jsx";
import MyOrdersDashboard from "../components/main-page/MyOrdersDashboard.jsx";
import AdminRequestsDashboard from "../components/main-page/AdminRequestsDashboard.jsx";
import OwnerUsersDashboard from "../components/main-page/OwnerUsersDashboard.jsx";

import { FOUR_RESTAURANTS_CONFIG } from "../components/main-page/constants/restaurantsConfig.js";
import useAuth from "../providers/useAuth.js";
import socket from "../API/socketRequest.js";
import signOut from "../API/signOut.js";
import { requestAdminRole } from "../API/adminRequests.js";

function emitSocketRequest(eventName, payload) {
  if (!socket.connected) {
    socket.connect();
  }

  return new Promise((resolve, reject) => {
    socket.timeout(10000).emit(eventName, payload, (timeoutError, response) => {
      if (timeoutError) {
        reject(new Error("انتهت مهلة الاتصال بالخادم. حاول مرة أخرى."));
        return;
      }

      if (!response?.success) {
        reject(new Error(response?.message || "تعذر تنفيذ الطلب."));
        return;
      }

      resolve(response);
    });
  });
}

function isAnnouncementExpired(announcement, now) {
  const { settings } = announcement;
  if (settings?.closingPolicy === "deadline") {
    const deadline = new Date(settings.deadline).getTime();
    return Number.isFinite(deadline) && deadline <= now;
  }

  if (settings?.closingPolicy === "delivery_target") {
    const target = Number(settings.targetDeliveryAmount);
    return target > 0 && Number(announcement.deliveryCollected || 0) >= target;
  }

  return false;
}

export default function MainPage() {
  const { user, setUser } = useAuth();
  const isOwner = user?.role === "owner";
  const isAdmin = isOwner || user?.role === "admin";
  const navigate = useNavigate();

  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [selectedRestaurantKey, setSelectedRestaurantKey] =
    useState("shakshak");

  const [isQuickPickerOpen, setIsQuickPickerOpen] = useState(false);
  const [zoomedMenuImage, setZoomedMenuImage] = useState(null);

  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clockNow, setClockNow] = useState(0);

  const [requestMessage, setRequestMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Active orders and changes are sourced from the authenticated backend.
  useEffect(() => {
    let isMounted = true;

    const handleActiveOrders = (response) => {
      const orders = Array.isArray(response) ? response : response?.orders;

      if (!Array.isArray(orders)) {
        console.error("Invalid activeOrders response:", response);

        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      if (isMounted) {
        setAnnouncements(orders);
        setIsLoading(false);
      }
    };
    const handleNewOrder = (order) => {
      setAnnouncements((currentOrders) => [
        order,
        ...currentOrders.filter(
          (currentOrder) =>
            (currentOrder._id || currentOrder.id) !==
            (order._id || order.id),
        ),
      ]);
    };
    const handleOrderUpdate = (updatedOrder) => {
      if (!updatedOrder?._id && !updatedOrder?.id) {
        return;
      }
      setAnnouncements((currentOrders) =>
        updatedOrder.status === "open"
          ? currentOrders.map((currentOrder) =>
              (currentOrder._id || currentOrder.id) ===
              (updatedOrder._id || updatedOrder.id)
                ? { ...currentOrder, ...updatedOrder }
                : currentOrder,
            )
          : currentOrders.filter(
              (currentOrder) =>
                (currentOrder._id || currentOrder.id) !==
                (updatedOrder._id || updatedOrder.id),
            ),
      );
    };
    const handleRemovedOrder = (event) => {
      const orderId = event?.orderId || event?._id || event?.id;
      if (!orderId) {
        return;
      }
      setAnnouncements((currentOrders) =>
        currentOrders.filter(
          (currentOrder) =>
            (currentOrder._id || currentOrder.id) !== orderId,
        ),
      );
    };
    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);

      if (isMounted) {
        setIsLoading(false);
      }
    };
    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
    };
    const handleConnect = () => socket.emit("getActiveOrders");

    socket.on("activeOrders", handleActiveOrders);
    socket.on("newActiveOrder", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdate);
    socket.on("orderClosed", handleRemovedOrder);
    socket.on("orderCancelled", handleRemovedOrder);
    socket.on("activeOrderRemoved", handleRemovedOrder);
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      isMounted = false;

      socket.off("activeOrders", handleActiveOrders);
      socket.off("newActiveOrder", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdate);
      socket.off("orderClosed", handleRemovedOrder);
      socket.off("orderCancelled", handleRemovedOrder);
      socket.off("activeOrderRemoved", handleRemovedOrder);
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(
      () => setClockNow(Date.now()),
      0,
    );
    const timer = window.setInterval(() => setClockNow(Date.now()), 15000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  const activeAnnouncements = announcements.filter(
    (announcement) =>
      announcement.status === "open" &&
      !isAnnouncementExpired(announcement, clockNow),
  );

  // Open the selected restaurant
  const handleOpenRestaurantBlock = (restKey) => {
    setSelectedRestaurantKey(restKey);
    setActiveScreen("orderPage");
    setIsQuickPickerOpen(false);
  };

  // Handle issuing a new order
  const handleIssueNewOrder = async (orderPayload) => {
    const restaurant = orderPayload.restaurant || {
      name: orderPayload.restaurantNameAr,
      key: orderPayload.restaurantId,
      address: "",
    };

    try {
      const response = await emitSocketRequest("collectOrder", {
        restaurant: {
          name: restaurant.name,
          key: restaurant.key || restaurant.id,
          address: restaurant.address || "",
        },
        settings: orderPayload.settings,
        menuImage: orderPayload.menuImage || restaurant.menuImage || "",
        deliveryFees: Number(
          orderPayload.deliveryFees ?? restaurant.deliveryFees ?? 0,
        ),
        collector: {
          note: orderPayload.collector?.note || orderPayload.message || "",
        },
      });
      const newAnnouncement = response.order;
      setAnnouncements((currentOrders) => [newAnnouncement, ...currentOrders]);
      setActiveScreen("dashboard");
      setToastMessage(
        `تم إصدار أوردر (${newAnnouncement.restaurant.name}) ونشره بنجاح!`,
      );
      window.setTimeout(() => setToastMessage(""), 4000);
    } catch (error) {
      console.error("Could not create group order:", error);
      setToastMessage(error.message || "تعذر إصدار الأوردر.");
    }
  };

  const handleCloseAnnouncement = async (announcementId) => {
    try {
      const response = await emitSocketRequest("closeOrder", { orderId: announcementId });
      setAnnouncements((currentOrders) =>
        currentOrders.filter(
          (announcement) =>
            (announcement._id || announcement.id) !== announcementId,
        ),
      );
      setToastMessage(
        `تم إغلاق أوردر ${response.order?.restaurant?.name || ""}.`,
      );
    } catch (error) {
      console.error("Could not close announcement:", error);
      setToastMessage(error.message || "تعذر إغلاق الإعلان.");
    }
  };

  const handleRequestAdmin = async () => {
    setRequestMessage("");
    try {
      await requestAdminRole();
      setRequestMessage("تم إرسال طلبك إلى الأدمن للمراجعة.");
    } catch (error) {
      console.error("Could not submit admin access request:", error);
      setRequestMessage(
        error.message || "تعذر إرسال الطلب. حاول مرة أخرى.",
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      socket.disconnect();
      setUser(null);
      navigate("/signIn", { replace: true });
    } catch (error) {
      console.error("Could not sign out:", error);
      setToastMessage(error.message || "تعذر تسجيل الخروج.");
    }
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full overflow-x-hidden bg-[#F4A261] p-3 text-[#1a1a1a] select-none sm:p-6 md:p-8"
    >
      <FoodDoodlePattern
        opacity={0.14}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800;900&family=Oswald:wght@500;600;700&display=swap');

        .font-cairo {
          font-family: 'Cairo', sans-serif;
        }

        .font-oswald {
          font-family: 'Oswald', sans-serif;
          letter-spacing: 0.03em;
        }

        .hex-order-btn {
          clip-path: polygon(
            5% 0%,
            95% 0%,
            100% 50%,
            95% 100%,
            5% 100%,
            0% 50%
          );
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

      {/* Top bar */}
      <div className="relative z-10 mx-auto mb-4 flex max-w-360 flex-wrap items-center justify-between gap-3 font-cairo">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#FFF4E6]/95 px-4 py-1.5 shadow-sm">
          <Sparkles className="h-4 w-4 text-[#F4A261]" />

          <span className="text-xs font-black sm:text-sm">
            لوحة إعلانات الدليفري (
            {isOwner
              ? "مالك النظام"
              : isAdmin
                ? "الأدمن / الكوليكتور"
                : "المستخدم"}
            )
          </span>
        </div>

        {toastMessage && (
          <div className="flex items-center gap-2 rounded-full border-2 border-[#1a1a1a] bg-[#737373] px-5 py-1.5 text-xs font-black text-[#FFF4E6] shadow-lg sm:text-sm">
            <CheckCircle2 className="h-4 w-4 text-[#F4A261]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveScreen("myOrders")}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#FFF4E6] px-3.5 py-1.5 text-xs font-black text-[#1a1a1a] shadow-sm hover:bg-white"
          >
            <ClipboardList className="h-4 w-4" />
            طلباتي
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveScreen("adminRequests")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#737373] px-3.5 py-1.5 text-xs font-black text-white shadow-sm hover:bg-[#5e5e5e]"
            >
              <ShieldCheck className="h-4 w-4" />
              طلبات الأدمن
            </button>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={() => setActiveScreen("ownerUsers")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#153443] px-3.5 py-1.5 text-xs font-black text-white shadow-sm hover:bg-[#0c222c]"
            >
              <Users className="h-4 w-4" />
              إدارة المستخدمين
            </button>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#FFF4E6] px-3.5 py-1.5 text-xs font-black text-[#1a1a1a] shadow-sm hover:bg-white"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 mx-auto flex max-w-360 flex-col items-stretch gap-6 font-cairo lg:flex-row">
        <RestaurantSidebar
          isAdmin={isAdmin}
          user={user}
          activeScreen={activeScreen}
          selectedRestaurantKey={selectedRestaurantKey}
          onSelectRestaurant={handleOpenRestaurantBlock}
          requestMessage={requestMessage}
          onRequestAdmin={handleRequestAdmin}
        />

        <main className="relative flex min-h-160 flex-1 flex-col justify-between overflow-x-clip rounded-[34px] border-[2.5px] border-[#b8926a] bg-[#FFF4E6] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:p-8">
          <FoodDoodlePattern
            opacity={0.045}
          />

          {activeScreen === "dashboard" ? (
            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#737373]/25 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#737373]">
                      <Megaphone className="h-5 w-5 text-[#F4A261]" />

                      <span className="font-oswald text-xs font-bold uppercase tracking-widest">
                        ANNOUNCEMENTS FEED
                      </span>
                    </div>

                    <h1 className="mt-1 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
                      الإعلانات الحالية والدليفري المتاح
                    </h1>
                  </div>

                  <span className="rounded-full bg-[#737373] px-4 py-1.5 text-xs font-black text-[#FFF4E6]">
                    {isLoading
                      ? "جاري التحميل..."
                      : `${activeAnnouncements.length} إعلانات نشطة`}
                  </span>
                </div>

                {isLoading ? (
                  <LoadingState />
                ) : activeAnnouncements.length === 0 ? (
                  <EmptyState
                    onPlaceOrder={
                      isAdmin ? () => setIsQuickPickerOpen(true) : undefined
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {activeAnnouncements.map((announcement) => {
                      return (
                        <AnnouncementCard
                          key={announcement._id || announcement.id}
                          announcement={announcement}
                          onZoomImage={setZoomedMenuImage}
                          canClose={
                            isOwner ||
                            (isAdmin &&
                              String(
                                announcement.collector?.id?._id ||
                                  announcement.collector?.id ||
                                  "",
                              ) === String(user?._id || user?.id || ""))
                          }
                          onClose={() =>
                            handleCloseAnnouncement(
                              announcement._id || announcement.id,
                            )
                          }
                          orderCount={announcement.participantCount || 0}
                          deliveryCollected={announcement.deliveryCollected || 0}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="flex flex-col items-center pt-4">
                  <div className="hex-order-btn w-full max-w-170 bg-[#4a4a4a] p-[2.5px] shadow-md">
                    <button
                      type="button"
                      onClick={() => setIsQuickPickerOpen(true)}
                      className="hex-order-btn flex w-full cursor-pointer items-center justify-center gap-3 bg-[#737373] py-4 font-cairo text-2xl font-black tracking-wide text-[#111111] transition-colors hover:bg-[#616161] sm:py-5 sm:text-4xl"
                    >
                      <span> هرب الأن</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeScreen === "myOrders" ? (
            <MyOrdersDashboard
              user={user}
              onBack={() => setActiveScreen("dashboard")}
            />
          ) : activeScreen === "adminRequests" && isAdmin ? (
            <AdminRequestsDashboard
              onBack={() => setActiveScreen("dashboard")}
            />
          ) : activeScreen === "ownerUsers" && isOwner ? (
            <OwnerUsersDashboard
              onBack={() => setActiveScreen("dashboard")}
            />
          ) : (
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#737373]/30 bg-[#737373]/15 p-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {Object.values(FOUR_RESTAURANTS_CONFIG).map((restaurant) => (
                    <button
                      key={restaurant.id}
                      type="button"
                      onClick={() => setSelectedRestaurantKey(restaurant.id)}
                      className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-black transition ${
                        selectedRestaurantKey === restaurant.id
                          ? "bg-[#737373] text-[#FFF4E6] shadow"
                          : "bg-white/70 text-[#3a3a3a] hover:bg-white"
                      }`}
                    >
                      {restaurant.nameAr}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSelectedRestaurantKey("custom")}
                    className={`flex cursor-pointer items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-black transition ${
                      selectedRestaurantKey === "custom"
                        ? "border border-[#1a1a1a] bg-[#F4A261] text-[#1a1a1a]"
                        : "bg-white/70 text-[#3a3a3a] hover:bg-white"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>رفع منيو خاص</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveScreen("dashboard")}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#737373] px-4 py-1.5 text-xs font-black text-[#FFF4E6] hover:bg-[#555]"
                >
                  <span>الرجوع للإعلانات</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="my-auto">
                {selectedRestaurantKey === "custom" ? (
                  <CustomUploadRestaurantBlock
                    isVisible
                    onIssueOrder={handleIssueNewOrder}
                  />
                ) : (
                  <AdminOrderBuilder
                    key={selectedRestaurantKey}
                    restaurant={FOUR_RESTAURANTS_CONFIG[selectedRestaurantKey]}
                    user={user}
                    onCancel={() => setActiveScreen("dashboard")}
                    onPublish={handleIssueNewOrder}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Restaurant picker modal */}
      {isQuickPickerOpen && (
        <QuickPickerModal
          restaurants={FOUR_RESTAURANTS_CONFIG}
          onSelectRestaurant={handleOpenRestaurantBlock}
          onClose={() => setIsQuickPickerOpen(false)}
        />
      )}

      {/* Image zoom modal */}
      {zoomedMenuImage && (
        <ZoomedImageModal
          image={zoomedMenuImage}
          onClose={() => setZoomedMenuImage(null)}
        />
      )}
    </div>
  );
}
