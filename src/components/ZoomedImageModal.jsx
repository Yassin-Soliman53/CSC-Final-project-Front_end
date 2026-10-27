import React from "react";
import { X, Upload } from "lucide-react";
import { FOUR_RESTAURANTS_CONFIG } from "../constants/restaurantsConfig";

export default function QuickPickerModal({ isOpen, onClose, onSelectRestaurant }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm font-cairo">
      <div className="relative w-full max-w-lg rounded-[32px] border-[3px] border-[#4a4a4a] bg-[#FFF4E6] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-[#737373]/30 pb-3">
          <h3 className="text-xl font-black text-[#1a1a1a]">
            اختار المطعم لفتح المنيو وإصدار الأوردر
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#737373] text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {Object.values(FOUR_RESTAURANTS_CONFIG).map((rest) => (
            <button
              key={rest.id}
              type="button"
              onClick={() => onSelectRestaurant(rest.id)}
              className="flex w-full items-center justify-between rounded-full border-2 border-[#4a4a4a] bg-[#737373] hover:bg-[#5e5e5e] px-6 py-3 text-[#111111] transition cursor-pointer shadow-sm"
            >
              <span className="text-xl font-black">{rest.nameAr}</span>
              <span className="font-oswald text-lg font-bold uppercase">
                {rest.nameEn}
              </span>
            </button>
          ))}

          <div className="pt-3 border-t border-[#737373]/30">
            <button
              type="button"
              onClick={() => onSelectRestaurant("custom")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1a1a1a] bg-[#F4A261] hover:bg-[#e58e49] px-5 py-3.5 text-base font-black text-[#1a1a1a] shadow cursor-pointer"
            >
              <Upload className="h-5 w-5" />
              <span>مطعم آخر + ارفع صورة المنيو (Upload Image)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}