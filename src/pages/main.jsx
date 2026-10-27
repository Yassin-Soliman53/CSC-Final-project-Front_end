import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Megaphone,
  Upload,
  CheckCircle2,
} from "lucide-react";

import FoodDoodlePattern from "../components/main-page/FoodDoodlePattern.jsx";
import RestaurantOrderBlock from "../components/main-page/RestaurantOrderBlock.jsx";
import CustomUploadRestaurantBlock from "../components/main-page/CustomUploadRestaurantBlock.jsx";
import AnnouncementCard from "../components/main-page/AnnouncementCard.jsx";
import QuickPickerModal from "../components/main-page/QuickPickerModal.jsx";
import ZoomedImageModal from "../components/main-page/ZoomedImageModal.jsx";
import RestaurantSidebar from "../components/main-page/RestaurantSidebar.jsx";
import EmptyState from "../components/main-page/EmptyState.jsx";
// import LoadingState from "../../components/main-page/LoadingState";
import { FOUR_RESTAURANTS_CONFIG } from "../components/main-page/constants/restaurantsConfig.js";
import { useAuth } from "../providers/AuthProvider.jsx";
import socket from "../API/socketRequest.js";

export default function MainPage() {
  const [isAdmin, setIsAdmin] = useState(true);

  const { user } = useAuth();
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [selectedRestaurantKey, setSelectedRestaurantKey] =
    useState("shakshak");

  const [isQuickPickerOpen, setIsQuickPickerOpen] = useState(false);
  const [customMenuImages, setCustomMenuImages] = useState({});
  const [zoomedMenuImage, setZoomedMenuImage] = useState(null);

  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    socket.connect();
    socket.on("activeOrders", (respons) => {
      console.log(respons);
    });
  }, []);
  const [requestMessage, setRequestMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // تحديث الإعلانات محليًا فقط
  const handleRefresh = () => {
    setToastMessage("الإعلانات المعروضة محدثة بالفعل.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // فتح بلوك المطعم المحدد
  const handleOpenRestaurantBlock = (restKey) => {
    setSelectedRestaurantKey(restKey);
    setActiveScreen("orderPage");
    setIsQuickPickerOpen(false);
  };

  // رفع صورة منيو محليًا
  const handleUploadMenuImage = (restKey, imageUrl) => {
    setCustomMenuImages((prev) => ({
      ...prev,
      [restKey]: imageUrl,
    }));
  };

  // إصدار أوردر وإضافته للإعلانات محليًا
  const handleIssueNewOrder = (orderPayload) => {
    const newAnnouncement = {
      _id: `ann_${Date.now()}`,
      restaurantName: orderPayload.restaurantNameAr,
      restaurantNameEn: orderPayload.restaurantNameEn,
      collectorName: user.name,
      roomNumber: user.roomNumber,
      phone: user.phone,
      status: "open",
      createdAt: new Date().toISOString(),
      message: orderPayload.message,
      menuImage: orderPayload.menuImage,
      items: orderPayload.items,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setActiveScreen("dashboard");

    setToastMessage(
      `تم إصدار أوردر (${orderPayload.restaurantNameAr}) ونشر المنيو بنجاح!`,
    );

    setTimeout(() => setToastMessage(""), 4000);
  };

  // حذف إعلان محليًا
  const handleDeleteAnnouncement = (id) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement._id !== id),
    );
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-[#F4A261] p-3 sm:p-6 md:p-8 text-[#1a1a1a] select-none"
      dir="rtl"
    >
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

      {/* الشريط العلوي */}
      <div className="relative z-10 mx-auto mb-4 flex max-w-360 flex-wrap items-center justify-between gap-3 font-cairo">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#FFF4E6]/95 px-4 py-1.5 shadow-sm">
          <Sparkles className="h-4 w-4 text-[#F4A261]" />
          <span className="text-xs sm:text-sm font-black">
            لوحة إعلانات الدليفري (
            {isAdmin ? "وضع الأدمن / الكوليكتور" : "وضع المستخدم"})
          </span>
        </div>

        {toastMessage && (
          <div className="flex items-center gap-2 rounded-full border-2 border-[#1a1a1a] bg-[#737373] px-5 py-1.5 text-xs sm:text-sm font-black text-[#FFF4E6] shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-[#F4A261]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdmin((prev) => !prev)}
            className="rounded-full border border-[#4a4a4a] bg-[#FFF4E6] hover:bg-white px-3.5 py-1.5 text-xs font-black text-[#1a1a1a] cursor-pointer shadow-sm"
          >
            تبديل الصلاحية: {isAdmin ? "Admin ✓" : "User"}
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#4a4a4a] bg-[#737373] hover:bg-[#5e5e5e] px-3.5 py-1.5 text-xs font-bold text-[#FFF4E6] cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* التخطيط الرئيسي */}
      <div className="relative z-10 mx-auto flex max-w-360 flex-col lg:flex-row gap-6 items-stretch font-cairo">
        <RestaurantSidebar
          isAdmin={isAdmin}
          user={user}
          activeScreen={activeScreen}
          selectedRestaurantKey={selectedRestaurantKey}
          onOpenRestaurant={handleOpenRestaurantBlock}
          requestMessage={requestMessage}
          onRequestAdmin={() =>
            setRequestMessage(
              "تم إرسال طلب صلاحية الأدمن بنجاح! (تجربة محلية فقط)",
            )
          }
        />

        <main className="flex-1 rounded-[34px] border-[2.5px] border-[#b8926a] bg-[#FFF4E6] p-5 sm:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between relative overflow-hidden min-h-160">
          <FoodDoodlePattern
            id="main-card-doodles"
            opacity={0.045}
            strokeColor="#8c6239"
          />

          {activeScreen === "dashboard" ? (
            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#737373]/25 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#737373]">
                      <Megaphone className="h-5 w-5 text-[#F4A261]" />
                      <span className="font-oswald text-xs font-bold tracking-widest uppercase">
                        ANNOUNCEMENTS FEED
                      </span>
                    </div>

                    <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[#1a1a1a]">
                      الإعلانات الحالية والدليفري المتاح
                    </h1>
                  </div>

                  <span className="rounded-full bg-[#737373] px-4 py-1.5 text-xs font-black text-[#FFF4E6]">
                    {announcements.length} إعلانات نشطة
                  </span>
                </div>

                {announcements.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {announcements.map((announcement) => (
                      <AnnouncementCard
                        key={announcement._id}
                        announcement={announcement}
                        user={user}
                        isAdmin={isAdmin}
                        onDelete={handleDeleteAnnouncement}
                        onPreviewImage={setZoomedMenuImage}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-col items-center">
                <div className="w-full max-w-170 p-[2.5px] bg-[#4a4a4a] hex-order-btn shadow-md">
                  <button
                    type="button"
                    onClick={() => setIsQuickPickerOpen(true)}
                    className="w-full py-4 sm:py-5 bg-[#737373] hover:bg-[#616161] text-[#111111] font-cairo font-black text-2xl sm:text-4xl tracking-wide hex-order-btn transition-colors cursor-pointer flex items-center justify-center gap-3"
                  >
                    <span>اطلب هنا</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#737373]/15 p-2.5 border border-[#737373]/30">
                <div className="flex flex-wrap items-center gap-1.5">
                  {Object.values(FOUR_RESTAURANTS_CONFIG).map((restaurant) => (
                    <button
                      key={restaurant.id}
                      type="button"
                      onClick={() => setSelectedRestaurantKey(restaurant.id)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer ${
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
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                      selectedRestaurantKey === "custom"
                        ? "bg-[#F4A261] text-[#1a1a1a] border border-[#1a1a1a]"
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#737373] hover:bg-[#555] px-4 py-1.5 text-xs font-black text-[#FFF4E6] cursor-pointer"
                >
                  <span>الرجوع للإعلانات</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="my-auto">
                {Object.values(FOUR_RESTAURANTS_CONFIG).map((restaurant) => (
                  <RestaurantOrderBlock
                    key={restaurant.id}
                    restaurant={restaurant}
                    isVisible={selectedRestaurantKey === restaurant.id}
                    menuImage={customMenuImages[restaurant.id]}
                    onUploadMenuImage={handleUploadMenuImage}
                    onIssueOrder={handleIssueNewOrder}
                    onPreviewFullImage={setZoomedMenuImage}
                  />
                ))}

                <CustomUploadRestaurantBlock
                  isVisible={selectedRestaurantKey === "custom"}
                  onIssueOrder={handleIssueNewOrder}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* نافذة اختيار المطعم */}
      {isQuickPickerOpen && (
        <QuickPickerModal
          restaurants={FOUR_RESTAURANTS_CONFIG}
          onSelectRestaurant={handleOpenRestaurantBlock}
          onClose={() => setIsQuickPickerOpen(false)}
        />
      )}

      {/* نافذة تكبير الصورة */}
      {zoomedMenuImage && (
        <ZoomedImageModal
          image={zoomedMenuImage}
          onClose={() => setZoomedMenuImage(null)}
        />
      )}
    </div>
  );
}
