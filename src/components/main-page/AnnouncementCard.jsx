import {
  User,
  DoorOpen,
  Phone,
  ZoomIn,
  MessageSquare,
} from "lucide-react";

export default function AnnouncementCard({ announcement, user, onZoomImage }) {
  return (
    <article className="overflow-hidden rounded-3xl border-2 border-[#737373]/50 bg-white/90 shadow-md transition hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#737373] px-5 py-3 text-[#FFF4E6]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4A261] text-[#1a1a1a] font-black">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
            <span className="font-black text-white">
              الكوليكتور: {announcement.collectorName || user.name}
            </span>
            <span className="inline-flex items-center gap-1 text-[#FFF4E6]/90 font-bold">
              <DoorOpen className="h-3.5 w-3.5 text-[#F4A261]" />
              أوضة: {announcement.roomNumber || user.roomNumber}
            </span>
            <span className="inline-flex items-center gap-1 text-[#FFF4E6]/90 font-bold">
              <Phone className="h-3.5 w-3.5 text-[#F4A261]" />
              {announcement.phone || user.phone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#F4A261] px-3 py-0.5 text-xs font-black text-[#1a1a1a]">
            {announcement.restaurantName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center">
        <div className="md:col-span-5">
          <div
            onClick={() => onZoomImage(announcement.menuImage)}
            className="relative h-44 w-full overflow-hidden rounded-2xl border-2 border-[#737373] bg-[#FFF4E6] cursor-pointer group"
          >
            <img
              src={announcement.menuImage}
              alt={announcement.restaurantName}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3">
              <span className="text-xs font-black text-white">
                منيو {announcement.restaurantName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F4A261] px-2.5 py-1 text-[11px] font-black text-[#1a1a1a]">
                <ZoomIn className="h-3.5 w-3.5" />
                عرض المنيو
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between gap-3">
          <div className="flex items-start gap-2 rounded-2xl bg-[#FFF4E6] p-3.5 border border-[#737373]/30">
            <MessageSquare className="h-5 w-5 shrink-0 text-[#F4A261] mt-0.5" />
            <p className="text-sm font-black leading-relaxed text-[#1a1a1a]">
              {announcement.message}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
