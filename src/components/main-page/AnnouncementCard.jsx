import {
  User,
  DoorOpen,
  Phone,
  ZoomIn,
  MessageSquare,
  MapPin,
  ClipboardList,
  Clock3,
  ShoppingCart,
  CircleX,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import shakshakBrandImage from "../../assets/images/Gemini_Generated_Image_gtewtogtewtogtew.jpg";

export default function AnnouncementCard({
  announcement,
  onZoomImage,
  isAdmin = false,
  onClose,
  orderCount = 0,
  deliveryCollected = 0,
}) {
  const navigate = useNavigate();
  
  const restaurant = announcement?.restaurant;
  const collector = announcement?.collector;
  const settings = announcement?.settings;

  const menuImage = announcement?.menuImage;

  const statusLabels = {
    open: "مفتوح",
    closed: "مغلق",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  const policyLabels = {
    deadline: "موعد نهائي",
    delivery_target: "هدف رسوم التوصيل",
    manual: "إغلاق يدوي",
  };

  const formatDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsedDate);
  };

  const deadline = formatDate(settings?.deadline);
  const createdAt = formatDate(announcement?.createdAt);
  const isShakshak = restaurant?.key === "shakshak";
  const deliveryTarget = Number(settings?.targetDeliveryAmount || 0);
  const deliveryProgress =
    deliveryTarget > 0
      ? Math.min((deliveryCollected / deliveryTarget) * 100, 100)
      : 0;

  const handleOrderNow = () => {
    const orderId = announcement?._id || announcement?.id;

    if (!orderId) {
      console.error("Order ID is missing from the announcement.");
      return;
    }

    navigate(`/orders/${orderId}`, { state: { announcement } });
  };

  return (
    <article
      dir="rtl"
      className="overflow-hidden rounded-3xl border-2 border-[#737373]/50 bg-white/90 shadow-md transition hover:shadow-lg"
    >
      {isShakshak && (
        <div className="relative overflow-hidden bg-[#080d26]">
          <img
            src={shakshakBrandImage}
            alt="شكشك - بيتزا وفطائر وحواوشي"
            className="aspect-[2.4/1] w-full object-cover object-center"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#737373] px-5 py-4 text-[#FFF4E6]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4A261] text-[#1a1a1a]">
            <User className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="break-words font-black text-white">
              {collector?.name || "كوليكتور"}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold">
              {collector?.roomNumber != null && (
                <span className="inline-flex items-center gap-1">
                  <DoorOpen className="h-3.5 w-3.5 text-[#F4A261]" />
                  أوضة {collector.roomNumber}
                </span>
              )}

              {collector?.phone && (
                <a
                  href={`tel:${collector.phone}`}
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 text-[#F4A261]" />
                  <span dir="ltr">{collector.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {restaurant?.name && (
            <span className="rounded-full bg-[#F4A261] px-3 py-1.5 text-xs font-black text-[#1a1a1a]">
              {restaurant.name}
            </span>
          )}

          {announcement?.status && (
            <span className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold">
              {statusLabels[announcement.status] || announcement.status}
            </span>
          )}
          {isAdmin && announcement?.status === "open" && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full border border-white/40 px-3 py-1.5 text-xs font-bold transition hover:bg-white/15"
            >
              <CircleX className="h-4 w-4" />
              إغلاق الإعلان
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 items-start gap-4 p-5 md:grid-cols-12">
        {menuImage && (
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onZoomImage?.(menuImage)}
              className="group relative block h-44 w-full overflow-hidden rounded-2xl border-2 border-[#737373] bg-[#FFF4E6]"
              aria-label={`عرض منيو ${restaurant?.name || "المطعم"}`}
            >
              <img
                src={menuImage}
                alt={`منيو ${restaurant?.name || "المطعم"}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                <span className="text-xs font-black text-white">
                  منيو {restaurant?.name || "المطعم"}
                </span>

                <span className="inline-flex items-center gap-1 rounded-lg bg-[#F4A261] px-2.5 py-1 text-[11px] font-black text-[#1a1a1a]">
                  <ZoomIn className="h-3.5 w-3.5" />
                  عرض المنيو
                </span>
              </div>
            </button>
          </div>
        )}

        <div
          className={`flex min-w-0 flex-col gap-3 ${
            menuImage ? "md:col-span-7" : "md:col-span-12"
          }`}
        >
          {/* Restaurant address */}
          {restaurant?.address && (
            <div className="flex items-start gap-2 rounded-2xl border border-[#737373]/30 bg-[#FFF4E6] p-3.5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#F4A261]" />

              <div className="min-w-0">
                <p className="text-xs font-bold text-[#737373]">عنوان المطعم</p>

                <p className="mt-1 break-words text-sm font-bold text-[#1a1a1a]">
                  {restaurant.address}
                </p>
              </div>
            </div>
          )}

          {/* Collector note */}
          {collector?.note?.trim() && (
            <div className="flex items-start gap-2 rounded-2xl border border-[#F4A261]/50 bg-[#FFF4E6] p-3.5">
              <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#F4A261]" />

              <div className="min-w-0">
                <p className="text-xs font-bold text-[#737373]">
                  ملاحظة الكوليكتور
                </p>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm font-bold leading-relaxed text-[#1a1a1a]">
                  {collector.note}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[#737373]/30 bg-white p-3.5">
            <p className="text-sm font-black text-[#1a1a1a]">
              عدد الطلبات المسجلة: {orderCount}
            </p>
            {settings?.closingPolicy === "delivery_target" &&
              deliveryTarget > 0 && (
                <div className="mt-2">
                  <div className="mb-1 flex justify-between gap-2 text-xs font-bold text-[#737373]">
                    <span>رسوم التوصيل المجمعة</span>
                    <span>
                      {deliveryCollected} / {deliveryTarget} ج.م
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-[#737373]/15"
                    role="progressbar"
                    aria-label="التقدم نحو هدف رسوم التوصيل"
                    aria-valuemin={0}
                    aria-valuemax={deliveryTarget}
                    aria-valuenow={Math.min(deliveryCollected, deliveryTarget)}
                  >
                    <div
                      className="h-full rounded-full bg-[#F4A261] transition-[width]"
                      style={{ width: `${deliveryProgress}%` }}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Order settings */}
          {settings?.closingPolicy && (
            <div className="flex items-start gap-2 rounded-2xl border border-[#737373]/30 bg-white p-3.5">
              <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-[#F4A261]" />

              <div className="min-w-0">
                <p className="text-xs font-bold text-[#737373]">
                  نظام إغلاق الأوردر
                </p>

                <p className="mt-1 text-sm font-black text-[#1a1a1a]">
                  {policyLabels[settings.closingPolicy] ||
                    settings.closingPolicy}
                </p>

                {settings.closingPolicy === "deadline" && deadline && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-[#1a1a1a]">
                    <Clock3 className="h-4 w-4 shrink-0 text-[#F4A261]" />
                    آخر موعد: {deadline}
                  </p>
                )}

                {settings.closingPolicy === "delivery_target" &&
                  settings.targetDeliveryAmount != null && (
                    <p className="mt-2 text-sm font-bold text-[#1a1a1a]">
                      هدف رسوم التوصيل: {settings.targetDeliveryAmount}
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Creation date */}
          {createdAt && (
            <p className="text-xs text-[#737373]">
              تاريخ إنشاء الأوردر: {createdAt}
            </p>
          )}
        </div>
      </div>

      {/* Order button */}
      {announcement?.status === "open" && (
        <div className="border-t border-[#737373]/20 px-5 py-4">
          <button
            type="button"
            onClick={handleOrderNow}
            disabled={!(announcement?._id || announcement?.id)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F4A261] px-5 py-3 font-black text-[#1a1a1a] shadow-sm transition hover:bg-[#e9954e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
            اطلب دلوقتي
          </button>
        </div>
      )}
    </article>
  );
}
