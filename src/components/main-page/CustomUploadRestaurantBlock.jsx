import { useState } from "react";
import { Upload } from "lucide-react";

export default function CustomUploadRestaurantBlock({ isVisible, onIssueOrder }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [customItemName, setCustomItemName] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [deliveryFees, setDeliveryFees] = useState(5);
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurantName.trim()) return;

    onIssueOrder({
      restaurantId: `custom_${Date.now()}`,
      restaurantNameAr: restaurantName,
      restaurantNameEn: restaurantName.toUpperCase(),
      deliveryFees,
      size: selectedSize,
      items: [
        {
          id: `cust_${Date.now()}`,
          name: `${customItemName || "طلب خاص"} (حجم ${selectedSize})`,
          size: selectedSize,
          quantity: 1,
        },
      ],
      message:
        message ||
        `يا شباب أنا فاتح أوردر جديد من ${restaurantName}، شوفوا صورة المنيو المرفقة واطلبوا!`,
      menuImage:
        uploadedImage ||
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    });
  };

  return (
    <div className={isVisible ? "block animate-fadeIn" : "hidden"} dir="rtl">
      <div className="mb-6 flex items-center justify-between border-b-2 border-[#737373]/30 pb-4">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-[#F4A261] px-4 py-2 font-oswald text-sm font-bold text-[#1a1a1a] border border-[#4a4a4a]">
            CUSTOM UPLOAD
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a]">
            إضافة مطعم جديد ورفع صورة المنيو
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl bg-white/80 p-5 border-2 border-[#737373]/40">
          <div>
            <label className="block text-sm font-black text-[#1a1a1a] mb-1.5">
              اسم المطعم *
            </label>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="مثال: بازوكا / حلب / دهب..."
              className="w-full rounded-2xl border-2 border-[#737373] bg-[#FFF4E6] px-4 py-2.5 text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-[#1a1a1a] mb-1.5">
              طلب الأدمن الشخصي من المنيو
            </label>
            <textarea
              rows={3}
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              placeholder="اكتب طلبك بالتفصيل..."
              className="w-full resize-y rounded-2xl border-2 border-[#737373] bg-[#FFF4E6] px-4 py-2.5 text-sm font-bold"
            />
          </div>
          <label className="block text-sm font-black text-[#1a1a1a]">
            مصاريف التوصيل للضيف
            <select
              value={deliveryFees}
              onChange={(e) => setDeliveryFees(Number(e.target.value))}
              className="mt-1 w-full rounded-2xl border-2 border-[#737373] bg-[#FFF4E6] px-4 py-2.5 text-sm font-bold"
            >
              <option value={5}>5 جنيه</option>
              <option value={10}>10 جنيه</option>
            </select>
          </label>

          <div className="flex items-center gap-6">
            <span className="rounded-xl bg-[#737373] px-4 py-2 text-sm font-black text-[#FFF4E6]">
              الحجم :
            </span>
            {["S", "M", "L"].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`flex h-10 w-12 items-center justify-center rounded-xl border-2 font-oswald text-lg font-bold cursor-pointer ${
                  selectedSize === sz
                    ? "border-[#1a1a1a] bg-[#F4A261] text-[#1a1a1a]"
                    : "border-[#737373] bg-[#FFF4E6] text-[#555]"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="رسالة الإعلان للناس..."
              className="w-full rounded-2xl border-2 border-[#737373] bg-[#FFF4E6] px-4 py-2.5 text-sm font-bold"
            />
          </div>
        </div>

        <div className="rounded-3xl border-[3px] border-[#4a4a4a] bg-white/90 p-6 text-center">
          <label className="flex flex-col items-center justify-center min-h-64 rounded-2xl border-2 border-dashed border-[#737373] bg-[#FFF4E6] p-6 cursor-pointer hover:bg-[#F4A261]/15 transition">
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Uploaded Menu"
                className="max-h-72 w-full object-contain rounded-xl"
              />
            ) : (
              <>
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4A261] text-[#1a1a1a] border-2 border-[#4a4a4a] shadow">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="text-lg font-black text-[#1a1a1a]">
                  اضغط هنا لرفع صورة المنيو (Upload Image)
                </p>
                <p className="mt-1 text-xs font-bold text-[#666]">
                  يدعم صور PNG, JPG, WEBP لتظهر للمستخدمين في الإعلان
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="w-full max-w-xs rounded-2xl border-[3px] border-[#2b2b2b] bg-[#737373] hover:bg-[#5c5c5c] py-3.5 px-10 text-2xl sm:text-3xl font-black text-[#111111] shadow-[0_6px_0_#2b2b2b] cursor-pointer"
          >
            إصدار
          </button>
        </div>
      </form>
    </div>
  );
}