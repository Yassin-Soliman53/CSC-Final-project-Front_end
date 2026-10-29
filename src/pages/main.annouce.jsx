import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Megaphone,
  Upload,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

import FoodDoodlePattern from "../components/main-page/FoodDoodlePattern.jsx";
import AdminOrderBuilder from "../components/main-page/AdminOrderBuilder.jsx";
import CustomUploadRestaurantBlock from "../components/main-page/CustomUploadRestaurantBlock.jsx";
import AnnouncementCard from "../components/main-page/AnnouncementCard.jsx";
import QuickPickerModal from "../components/main-page/QuickPickerModal.jsx";
import ZoomedImageModal from "../components/main-page/ZoomedImageModal.jsx";
import RestaurantSidebar from "../components/main-page/RestaurantSidebar.jsx";
import EmptyState from "../components/main-page/EmptyState.jsx";
import LoadingState from "../components/main-page/LoadingState.jsx";
import GuestOrdersDashboard from "../components/main-page/GuestOrdersDashboard.jsx";

import { FOUR_RESTAURANTS_CONFIG } from "../components/main-page/constants/restaurantsConfig.js";
import useAuth from "../providers/useAuth.js";
import socket from "../API/socketRequest.js";
import {
  getGuestOrders,
  GUEST_ORDERS_STORAGE_KEY,
} from "../utils/guestOrderStorage.js";
import {
  ANNOUNCEMENTS_STORAGE_KEY,
  ANNOUNCEMENTS_UPDATED_EVENT,
  getAnnouncementOrderTotals,
  getStoredAnnouncements,
  isAnnouncementConditionMet,
  saveAnnouncements,
} from "../utils/announcementStorage.js";

function loadGuestOrdersState() {
  try {
    return { orders: getGuestOrders(), error: "" };
  } catch (error) {
    console.error("Could not load guest orders:", error);
    return {
      orders: [],
      error: "تعذر قراءة طلبات الضيوف المحفوظة.",
    };
  }
}

function loadAnnouncementsState() {
  try {
    return getStoredAnnouncements();
  } catch (error) {
    console.error("Could not load saved announcements:", error);
    return [];
  }
}

function mergeAnnouncements(remoteAnnouncements, savedAnnouncements) {
  const savedById = new Map(
    savedAnnouncements.map((announcement) => [
      announcement._id || announcement.id,
      announcement,
    ]),
  );
  const merged = remoteAnnouncements.map((announcement) => {
    const id = announcement._id || announcement.id;
    const savedAnnouncement = savedById.get(id);

    return savedAnnouncement
      ? { ...announcement, ...savedAnnouncement }
      : announcement;
  });
  const remoteIds = new Set(
    remoteAnnouncements.map(
      (announcement) => announcement._id || announcement.id,
    ),
  );

  return [
    ...merged,
    ...savedAnnouncements.filter(
      (announcement) =>
        !remoteIds.has(announcement._id || announcement.id),
    ),
  ];
}

export default function MainPage() {
  const [isAdmin, setIsAdmin] = useState(true);

  const { user } = useAuth();

  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [selectedRestaurantKey, setSelectedRestaurantKey] =
    useState("shakshak");

  const [isQuickPickerOpen, setIsQuickPickerOpen] = useState(false);
  const [zoomedMenuImage, setZoomedMenuImage] = useState(null);

  const [announcements, setAnnouncements] = useState(loadAnnouncementsState);
  const [guestOrdersState, setGuestOrdersState] = useState(
    loadGuestOrdersState,
  );
  const { orders: guestOrders, error: guestOrdersError } = guestOrdersState;
  const [isLoading, setIsLoading] = useState(true);
  const [clockNow, setClockNow] = useState(0);

  const [requestMessage, setRequestMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const refreshGuestOrders = useCallback(() => {
    setGuestOrdersState(loadGuestOrdersState());
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === GUEST_ORDERS_STORAGE_KEY || event.key === null) {
        refreshGuestOrders();
      }

      if (event.key === ANNOUNCEMENTS_STORAGE_KEY || event.key === null) {
        setAnnouncements(loadAnnouncementsState());
      }
    };
    const handleAnnouncementsUpdated = () => {
      setAnnouncements(loadAnnouncementsState());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("guest-orders-updated", refreshGuestOrders);
    window.addEventListener(
      ANNOUNCEMENTS_UPDATED_EVENT,
      handleAnnouncementsUpdated,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("guest-orders-updated", refreshGuestOrders);
      window.removeEventListener(
        ANNOUNCEMENTS_UPDATED_EVENT,
        handleAnnouncementsUpdated,
      );
    };
  }, [refreshGuestOrders]);

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(Date.now()), 15000);

    return () => window.clearInterval(timer);
  }, []);

  // Fetch active orders through Socket.IO
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
        const mergedAnnouncements = mergeAnnouncements(
          orders,
          loadAnnouncementsState(),
        );
        setAnnouncements(mergedAnnouncements);
        try {
          saveAnnouncements(mergedAnnouncements);
        } catch (error) {
          console.error("Could not persist active announcements:", error);
        }
        setIsLoading(false);
      }
      console.log("Active orders:", orders);
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
    socket.on("activeOrders", handleActiveOrders);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.emit("getActiveOrders");
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      isMounted = false;

      socket.off("activeOrders", handleActiveOrders);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const now = Date.now();
      const updatedAnnouncements = announcements.map((announcement) =>
        announcement.status === "open" &&
        isAnnouncementConditionMet(announcement, guestOrders, now)
          ? {
              ...announcement,
              status: "closed",
              closedAt: new Date(now).toISOString(),
            }
          : announcement,
      );
      const hasClosedAnnouncement = updatedAnnouncements.some(
        (announcement, index) =>
          announcement.status !== announcements[index]?.status,
      );

      if (!hasClosedAnnouncement) {
        return;
      }

      setAnnouncements(updatedAnnouncements);
      try {
        saveAnnouncements(updatedAnnouncements);
      } catch (error) {
        console.error(
          "Could not save automatically closed announcements:",
          error,
        );
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [announcements, guestOrders, clockNow]);

  const activeAnnouncements = announcements.filter(
    (announcement) =>
      announcement.status === "open" &&
      !isAnnouncementConditionMet(announcement, guestOrders, clockNow),
  );

  // Open the selected restaurant
  const handleOpenRestaurantBlock = (restKey) => {
    setSelectedRestaurantKey(restKey);
    setActiveScreen("orderPage");
    setIsQuickPickerOpen(false);
  };

  // Handle issuing a new order
  const handleIssueNewOrder = (orderPayload) => {
    const newAnnouncement = orderPayload.restaurant
      ? orderPayload
      : {
          _id: `order_${Date.now()}`,
          restaurant: {
            name: orderPayload.restaurantNameAr,
            key: orderPayload.restaurantId,
            menuImage: orderPayload.menuImage,
            deliveryFees: orderPayload.deliveryFees ?? 5,
          },
          collector: {
            name: user?.name || "كوليكتور",
            roomNumber: user?.roomNumber ?? "",
            phone: user?.phone ?? "",
            note: orderPayload.message || "",
          },
          settings: {
            closingPolicy: "manual",
            deadline: null,
            targetDeliveryAmount: null,
          },
          status: "open",
          createdAt: new Date().toISOString(),
          items: orderPayload.items || [],
          menuImage: orderPayload.menuImage,
        };

    const updatedAnnouncements = [newAnnouncement, ...announcements];
    setAnnouncements(updatedAnnouncements);
    try {
      saveAnnouncements(updatedAnnouncements);
    } catch (error) {
      console.error("Could not save new announcement:", error);
      setToastMessage("تم إنشاء الإعلان لكنه لم يُحفظ محليًا.");
      return;
    }
    setActiveScreen("dashboard");

    setToastMessage(
      `تم إصدار أوردر (${newAnnouncement.restaurant.name}) ونشر المنيو بنجاح!`,
    );

    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  const handleCloseAnnouncement = (announcementId) => {
    const updatedAnnouncements = announcements.map((announcement) =>
      (announcement._id || announcement.id) === announcementId
        ? {
            ...announcement,
            status: "closed",
            closedAt: new Date().toISOString(),
          }
        : announcement,
    );

    setAnnouncements(updatedAnnouncements);
    try {
      saveAnnouncements(updatedAnnouncements);
    } catch (error) {
      console.error("Could not close announcement:", error);
      setToastMessage("تعذر حفظ إغلاق الإعلان.");
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
            {isAdmin ? "وضع الأدمن / الكوليكتور" : "وضع المستخدم"})
          </span>
        </div>

        {toastMessage && (
          <div className="flex items-center gap-2 rounded-full border-2 border-[#1a1a1a] bg-[#737373] px-5 py-1.5 text-xs font-black text-[#FFF4E6] shadow-lg sm:text-sm">
            <CheckCircle2 className="h-4 w-4 text-[#F4A261]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isAdmin) {
                setActiveScreen("dashboard");
              }
              setIsAdmin((prev) => !prev);
            }}
            className="cursor-pointer rounded-full border border-[#4a4a4a] bg-[#FFF4E6] px-3.5 py-1.5 text-xs font-black text-[#1a1a1a] shadow-sm hover:bg-white"
          >
            تبديل الصلاحية: {isAdmin ? "Admin ✓" : "User"}
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveScreen("guestOrders")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#737373] px-3.5 py-1.5 text-xs font-black text-white shadow-sm hover:bg-[#5e5e5e]"
            >
              <ClipboardList className="h-4 w-4" />
              طلبات الضيوف ({guestOrders.length})
            </button>
          )}
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
          onRequestAdmin={() =>
            setRequestMessage(
              "تم إرسال طلب صلاحية الأدمن بنجاح! (تجربة محلية فقط)",
            )
          }
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
                    onPlaceOrder={() => setIsQuickPickerOpen(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {activeAnnouncements.map((announcement) => {
                      const { orderCount, deliveryCollected } =
                        getAnnouncementOrderTotals(announcement, guestOrders);

                      return (
                        <AnnouncementCard
                          key={announcement._id || announcement.id}
                          announcement={announcement}
                          onZoomImage={setZoomedMenuImage}
                          isAdmin={isAdmin}
                          onClose={() =>
                            handleCloseAnnouncement(
                              announcement._id || announcement.id,
                            )
                          }
                          orderCount={orderCount}
                          deliveryCollected={deliveryCollected}
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
          ) : activeScreen === "guestOrders" ? (
            <GuestOrdersDashboard
              orders={guestOrders}
              error={guestOrdersError}
              onRetry={refreshGuestOrders}
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
