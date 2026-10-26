  import React, { useCallback, useEffect, useState } from "react";
  import {
    User,
    Utensils,
    Plus,
    ArrowLeft,
    Phone,
    DoorOpen,
    Clock,
    ShoppingBag,
    X,
    MessageSquare,
    Sparkles,
    ShieldCheck,
    RefreshCw,
    Megaphone,
    ChevronLeft,
    AlertCircle,
    Upload,
    CheckSquare,
    Square,
    Image as ImageIcon,
    ZoomIn,
    Trash2,
    CheckCircle2,
  } from "lucide-react";

  // ============================================================================
  // المسارات والـ Endpoints الخاصة بمشروعك (تقدر تعدلها حسب الـ Router عندك)
  // ============================================================================
  const ROUTES = {
    placeOrder: "/createOrder",
    collectOrders: "/collectOrders",
    requestAdmin: "/requestAdmin",
  };

  const API = {
    announcements: "/api/announcements",
    restaurants: "/api/restaurants",
    requestAdmin: "/api/users/request-admin",
  };

  // ============================================================================
  // بيانات المطاعم الأربعة الثابتة (شكشك، كرم الشام، زيزو، شطة ودقة)
  // كل مطعم له Component خاص به في صفحة الطلبات ومخفي ما عدا الذي يختاره الأدمن
  // ============================================================================
  const FOUR_RESTAURANTS_CONFIG = {
    shakshak: {
      id: "shakshak",
      nameAr: "شكشك",
      nameEn: "SHAK SHAK",
      defaultMessage:
        "يا رجالة أنا نازل أجيب من شكشك، اللي عايز فطير أو عصير يلحق يسجل طلبه دلوقتي!",
      // الصفوف مطابقة للرسمة: الصف الأول (فطيرة رول) والصف الثاني (عصير)
      row1Label: "فطيرة رول",
      row1Items: [
        { id: "sh_r1_1", name: "فطيرة سوسيس رول", price: 45 },
        { id: "sh_r1_2", name: "فطيرة مشكل جبن", price: 40 },
        { id: "sh_r1_3", name: "فطيرة فراخ كرسبي", price: 55 },
        { id: "sh_r1_4", name: "فطيرة لحمة مفرومة", price: 50 },
      ],
      row2Label: "عصير",
      row2Items: [
        { id: "sh_r2_1", name: "عصير قصب فريش", price: 15 },
        { id: "sh_r2_2", name: "عصير مانجو طبيعي", price: 30 },
        { id: "sh_r2_3", name: "عصير فراولة بالحليب", price: 25 },
        { id: "sh_r2_4", name: "سوبيا شكشك مخصوص", price: 20 },
      ],
      defaultMenuImage:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
    },
    karam: {
      id: "karam",
      nameAr: "كرم الشام",
      nameEn: "KARAM ELSHAM",
      defaultMessage:
        "هجمع أوردر شاورما وفتة من كرم الشام، اللي هيدخل معانا يختار طلبه والحجم!",
      row1Label: "شاورما سوري",
      row1Items: [
        { id: "kr_r1_1", name: "شاورما فراخ صاج", price: 65 },
        { id: "kr_r1_2", name: "شاورما لحمة سوري", price: 75 },
        { id: "kr_r1_3", name: "وجبة عربي فراخ دبل", price: 135 },
        { id: "kr_r1_4", name: "سندوتش بطاطس بالجبنة", price: 45 },
      ],
      row2Label: "فتة وإضافات",
      row2Items: [
        { id: "kr_r2_1", name: "فتة شاورما فراخ", price: 110 },
        { id: "kr_r2_2", name: "فتة شاورما ميكس", price: 125 },
        { id: "kr_r2_3", name: "علبة تومية إضافي", price: 15 },
        { id: "kr_r2_4", name: "كول سلو ومخلل", price: 20 },
      ],
      defaultMenuImage:
        "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1200&q=80",
    },
    zizo: {
      id: "zizo",
      nameAr: "زيزو",
      nameEn: "ZIZO",
      defaultMessage:
        "طلعة سريعة لزيزو! الكبدة والسجق والحواوشي سخنين، سجل طلبك بسرعة.",
      row1Label: "سندوتشات",
      row1Items: [
        { id: "zz_r1_1", name: "كبدة إسكندراني حار", price: 35 },
        { id: "zz_r1_2", name: "سجق شرقي بالجبنة", price: 40 },
        { id: "zz_r1_3", name: "كفتة مشوية ع الفحم", price: 45 },
        { id: "zz_r1_4", name: "سندوتش ميكس جريل", price: 55 },
      ],
      row2Label: "حواوشي ومقبلات",
      row2Items: [
        { id: "zz_r2_1", name: "حواوشي زيزو مخصوص", price: 70 },
        { id: "zz_r2_2", name: "حواوشي وش بيتزا", price: 85 },
        { id: "zz_r2_3", name: "باكت بطاطس بهارات", price: 25 },
        { id: "zz_r2_4", name: "طحينة وسلطة بلدي", price: 15 },
      ],
      defaultMenuImage:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    },
    shata: {
      id: "shata",
      nameAr: "شطة و دقة",
      nameEn: "SHATA W DA2A",
      defaultMessage:
        "نازلين نجيب كشري وطواجن من شطة ودقة! حدد العلبة والحجم والإضافات.",
      row1Label: "علب كشري",
      row1Items: [
        { id: "st_r1_1", name: "كشري مصري أصلي", price: 35 },
        { id: "st_r1_2", name: "كشري سوبر إكسترا", price: 45 },
        { id: "st_r1_3", name: "كشري بالكبدة", price: 60 },
        { id: "st_r1_4", name: "فولاسو (عدس وحمص)", price: 30 },
      ],
      row2Label: "طواجن وحلو",
      row2Items: [
        { id: "st_r2_1", name: "طاجن مكرونة فراخ", price: 60 },
        { id: "st_r2_2", name: "طاجن مكرونة لحمة", price: 55 },
        { id: "st_r2_3", name: "إضافة تقلية وحمص", price: 15 },
        { id: "st_r2_4", name: "رز بلبن فرن مكسرات", price: 30 },
      ],
      defaultMenuImage:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    },
  };

  // ============================================================================
  // نقشة خلفية الأكل (Food Doodle Pattern) مطابقة للصورة
  // ============================================================================
  function FoodDoodlePattern({ id = "food-doodles", opacity = 0.16, strokeColor = "#5a381e" }) {
    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id={id} width="140" height="140" patternUnits="userSpaceOnUse">
            <g
              stroke={strokeColor}
              strokeWidth="1.6"
              fill="none"
              opacity={opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* بيتزا */}
              <path d="M18 22 L42 30 L26 48 Z" />
              <path d="M16 20 Q32 16 44 28" />
              <circle cx="27" cy="30" r="2" />
              <circle cx="32" cy="36" r="1.8" />
              {/* برجر */}
              <path d="M75 25 Q90 12 105 25 Z" />
              <line x1="73" y1="29" x2="107" y2="29" />
              <path d="M75 33 L105 33 Q103 40 90 40 Q77 40 75 33 Z" />
              {/* مشروب بشفاطة */}
              <path d="M115 70 L120 102 L132 102 L137 70 Z" />
              <line x1="112" y1="70" x2="140" y2="70" />
              <path d="M126 70 L130 56 L136 56" />
              {/* دبوس فراخ */}
              <path d="M25 85 C15 75 30 60 40 70 C45 75 42 84 36 87 L48 99 L42 105 L30 93 C27 94 28 88 25 85 Z" />
              {/* ساندوتش */}
              <rect x="65" y="78" width="34" height="14" rx="7" transform="rotate(-18 82 85)" />
              <path d="M68 85 Q75 80 82 85 T96 82" />
              {/* دونات */}
              <circle cx="88" cy="120" r="11" />
              <circle cx="88" cy="120" r="4" />
              {/* بطاطس */}
              <path d="M20 118 L24 136 L40 136 L44 118 Z" />
              <line x1="25" y1="118" x2="25" y2="108" />
              <line x1="30" y1="118" x2="30" y2="105" />
              <line x1="35" y1="118" x2="35" y2="107" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }

  // ============================================================================
  // كومبوننت البلوك الخاص بكل مطعم (مطابق لرسمة الورقة بالمللي)
  // يعرض: اسم المطعم، صفين Checkboxes، الحجم (S / M / L)، صورة المنيو الكاملة (مع رفع صورة)، وزرار "إصدار"
  // ============================================================================
  function RestaurantOrderBlock({
    restaurant,
    isVisible,
    menuImage,
    onUploadMenuImage,
    onIssueOrder,
    onPreviewFullImage,
  }) {
    // الأصناف التي اختارها الأدمن لنفسه (Checkboxes)
    const [checkedItems, setCheckedItems] = useState([restaurant.row1Items[0]?.id]);
    // الحجم المختار (S / M / L) كما في الرسمة
    const [selectedSize, setSelectedSize] = useState("S");
    // رسالة الإعلان التي يوجهها الأدمن لباقي المستخدمين
    const [announcementMessage, setAnnouncementMessage] = useState(restaurant.defaultMessage);

    const toggleItem = (itemId) => {
      setCheckedItems((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      );
    };

    // تجهيز أوردر الأدمن وإصدار الإعلان عند الضغط على زرار "إصدار"
    const handleIssueClick = () => {
      const allItems = [...restaurant.row1Items, ...restaurant.row2Items];
      const chosenObjects = allItems
        .filter((item) => checkedItems.includes(item.id))
        .map((item) => ({
          id: item.id,
          name: `${item.name} (حجم ${selectedSize})`,
          size: selectedSize,
          quantity: 1,
          price: item.price,
        }));

      onIssueOrder({
        restaurantId: restaurant.id,
        restaurantNameAr: restaurant.nameAr,
        restaurantNameEn: restaurant.nameEn,
        size: selectedSize,
        items:
          chosenObjects.length > 0
            ? chosenObjects
            : [{ id: "default_1", name: `طلب خاص من ${restaurant.nameAr} (${selectedSize})`, quantity: 1 }],
        message: announcementMessage,
        menuImage: menuImage || restaurant.defaultMenuImage,
      });
    };

    // يتم إخفاء الكومبوننت بـ hidden إلا إذا كان هو المطعم المختار
    return (
      <div className={isVisible ? "block animate-fadeIn" : "hidden"} dir="rtl">
        {/* 1. عنوان المطعم في أعلى اليمين (مثل: شكشك) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#737373]/30 pb-4">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-[#737373] px-5 py-2 font-oswald text-sm font-bold tracking-wider text-[#FFF4E6]">
              {restaurant.nameEn}
            </span>
            <h2 className="text-3xl font-black text-[#1a1a1a] sm:text-4xl">
              {restaurant.nameAr}
            </h2>
          </div>

          <span className="rounded-full bg-[#F4A261]/30 px-4 py-1.5 text-xs font-black text-[#3a3a3a] border border-[#737373]/40">
            اختار طلبك كـ Admin وارفع المنيو ثم اضغط إصدار
          </span>
        </div>

        {/* 2. شبكة الاختيارات (Checkboxes) مطابقة للرسمة */}
        <div className="space-y-5 rounded-3xl bg-white/80 p-5 sm:p-6 border-2 border-[#737373]/40 shadow-sm">
          {/* الصف الأول (مثلاً: فطيرة رول) */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-[#737373]/20 pb-4">
            <div className="w-36 shrink-0">
              <span className="inline-block rounded-xl bg-[#737373] px-4 py-2 text-base font-black text-[#FFF4E6] shadow-sm">
                {restaurant.row1Label} :
              </span>
            </div>

            <div className="grid flex-1 grid-cols-2 sm:grid-cols-4 gap-3">
              {restaurant.row1Items.map((item) => {
                const isChecked = checkedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-right transition-all cursor-pointer ${
                      isChecked
                        ? "border-[#1a1a1a] bg-[#F4A261] text-[#1a1a1a] shadow-md scale-[1.02]"
                        : "border-[#737373]/40 bg-[#FFF4E6] text-[#3a3a3a] hover:border-[#737373]"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="h-5 w-5 shrink-0 text-[#1a1a1a]" />
                    ) : (
                      <Square className="h-5 w-5 shrink-0 text-[#737373]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-black">{item.name}</p>
                      <p className="text-[11px] font-bold opacity-80">{item.price} ج.م</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* الصف الثاني (مثلاً: عصير) */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-[#737373]/20 pb-4">
            <div className="w-36 shrink-0">
              <span className="inline-block rounded-xl bg-[#737373] px-4 py-2 text-base font-black text-[#FFF4E6] shadow-sm">
                {restaurant.row2Label} :
              </span>
            </div>

            <div className="grid flex-1 grid-cols-2 sm:grid-cols-4 gap-3">
              {restaurant.row2Items.map((item) => {
                const isChecked = checkedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-right transition-all cursor-pointer ${
                      isChecked
                        ? "border-[#1a1a1a] bg-[#F4A261] text-[#1a1a1a] shadow-md scale-[1.02]"
                        : "border-[#737373]/40 bg-[#FFF4E6] text-[#3a3a3a] hover:border-[#737373]"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="h-5 w-5 shrink-0 text-[#1a1a1a]" />
                    ) : (
                      <Square className="h-5 w-5 shrink-0 text-[#737373]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-black">{item.name}</p>
                      <p className="text-[11px] font-bold opacity-80">{item.price} ج.م</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* الصف الثالث: الحجم (S / M / L) مطابق للرسمة تماماً */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
            <div className="w-36 shrink-0">
              <span className="inline-block rounded-xl bg-[#737373] px-4 py-2 text-base font-black text-[#FFF4E6] shadow-sm">
                الحجم :
              </span>
            </div>

            <div className="flex items-center gap-6 sm:gap-10">
              {["S", "M", "L"].map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className="group flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <span className="font-oswald text-xl font-bold text-[#1a1a1a]">
                      {size}
                    </span>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all ${
                        active
                          ? "border-[#1a1a1a] bg-[#F4A261] shadow-md scale-110"
                          : "border-[#737373] bg-[#FFF4E6] group-hover:bg-[#F4A261]/30"
                      }`}
                    >
                      {active && <CheckSquare className="h-5 w-5 text-[#1a1a1a]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* حقل سريع لرسالة الأدمن المرفقة بالإعلان */}
            <div className="flex-1 mt-2 sm:mt-0">
              <input
                type="text"
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                placeholder="رسالة الكوليكتور التي ستظهر مع الأوردر..."
                className="w-full rounded-2xl border-2 border-[#737373]/50 bg-[#FFF4E6] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. المستطيل الكبير في المنتصف: "صورة المنيو" (كاملة + زرار رفع صورة خاصة بك) */}
        <div className="mt-6 rounded-3xl border-[3px] border-[#4a4a4a] bg-white/90 p-4 sm:p-6 shadow-md">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[#737373]" />
              <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
                صورة المنيو الكاملة ({restaurant.nameAr})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* زر رفع صورة المنيو الخاصة بك من جهازك */}
              <label className="inline-flex items-center gap-2 rounded-full bg-[#F4A261] hover:bg-[#e58e49] px-4 py-2 text-xs font-black text-[#1a1a1a] border-2 border-[#4a4a4a] shadow-sm cursor-pointer transition">
                <Upload className="h-4 w-4" />
                <span>ارفع صورة المنيو من جهازك</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      onUploadMenuImage(restaurant.id, url);
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => onPreviewFullImage(menuImage || restaurant.defaultMenuImage)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#737373] hover:bg-[#5a5a5a] px-3.5 py-2 text-xs font-bold text-[#FFF4E6] cursor-pointer"
              >
                <ZoomIn className="h-4 w-4 text-[#F4A261]" />
                <span>تكبير</span>
              </button>
            </div>
          </div>

          {/* عرض صورة المنيو الكاملة داخل المستطيل */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#737373] bg-[#FFF4E6] flex items-center justify-center group">
            <img
              src={menuImage || restaurant.defaultMenuImage}
              alt={`منيو ${restaurant.nameAr}`}
              className="h-full w-full object-contain bg-black/5"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-2xl bg-[#FFF4E6]/95 px-5 py-2.5 text-base font-black text-[#1a1a1a] shadow-lg">
                صورة المنيو — اضغط "ارفع صورة المنيو" لتغييرها بصورتك
              </span>
            </div>
          </div>
        </div>

        {/* 4. الزرار السفلي في المنتصف: "إصدار" (مطابق للرسمة) */}
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={handleIssueClick}
            className="w-full max-w-xs rounded-2xl border-[3px] border-[#2b2b2b] bg-[#737373] hover:bg-[#5c5c5c] py-3.5 px-10 text-2xl sm:text-3xl font-black text-[#111111] shadow-[0_6px_0_#2b2b2b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            إصدار
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // كومبوننت الزرار الخامس (ADD RESTAURANT +) لرفع صورة منيو ومطعم مخصوص جديد
  // ============================================================================
  function CustomUploadRestaurantBlock({ isVisible, onIssueOrder }) {
    const [restaurantName, setRestaurantName] = useState("");
    const [customItemName, setCustomItemName] = useState("");
    const [selectedSize, setSelectedSize] = useState("M");
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
              <input
                type="text"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="اكتب الصنف اللي هتطلبه لنفسك..."
                className="w-full rounded-2xl border-2 border-[#737373] bg-[#FFF4E6] px-4 py-2.5 text-sm font-bold"
              />
            </div>

            {/* اختيار الحجم S / M / L */}
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

          {/* منطقة رفع صورة المنيو (Upload Image) */}
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

          {/* زرار إصدار */}
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

  // ============================================================================
  // الكومبوننت الرئيسي (MainPage) مدمج مع شاشة المطاعم الأربعة الموحدة
  // ============================================================================
  export default function MainPage() {
    // محاكاة بيانات المستخدم والأدمن من الـ AuthProvider (مع زر للتبديل للتجربة)
    const [isAdmin, setIsAdmin] = useState(true);
    const user = {
      name: "ياسين سليمان",
      roomNumber: "304",
      phone: "01098765432",
      role: isAdmin ? "ADMIN_COLLECTOR" : "USER",
    };

    // التنقل بين الصفحة الرئيسية (dashboard) وصفحة بلوكات المطاعم الموحدة (orderPage)
    const [activeScreen, setActiveScreen] = useState("dashboard"); // 'dashboard' | 'orderPage'

    // المطعم المختار حالياً داخل صفحة الطلبات ('shakshak' | 'karam' | 'zizo' | 'shata' | 'custom')
    // كل الكومبوننتات موجودة في نفس الصفحة ومعمولها hidden ما عدا المختار
    const [selectedRestaurantKey, setSelectedRestaurantKey] = useState("shakshak");

    // نافذة اختيار سريع عند الضغط على الزر الكبير "اطلب هنا"
    const [isQuickPickerOpen, setIsQuickPickerOpen] = useState(false);

    // حفظ صور المنيو التي يرفعها الأدمن لكل مطعم
    const [customMenuImages, setCustomMenuImages] = useState({});

    // تكبير صورة المنيو
    const [zoomedMenuImage, setZoomedMenuImage] = useState(null);

    // قائمة الإعلانات الحالية
    const [announcements, setAnnouncements] = useState([
      {
        _id: "ann_1",
        restaurantName: "شكشك",
        restaurantNameEn: "SHAK SHAK",
        collectorName: "ياسين سليمان",
        roomNumber: "304",
        phone: "01098765432",
        status: "open",
        createdAt: new Date().toISOString(),
        message:
          "يا رجالة أنا نازل أجيب من شكشك كمان ربع ساعة، اللي عايز فطيرة رول أو عصير يلحق يسجل طلبه!",
        menuImage: FOUR_RESTAURANTS_CONFIG.shakshak.defaultMenuImage,
        items: [
          { id: "1", name: "فطيرة سوسيس رول (حجم M)", quantity: 1 },
          { id: "2", name: "عصير قصب فريش (حجم L)", quantity: 2 },
        ],
      },
    ]);

    const [loading, setLoading] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    // محاكاة الاتصال بالـ API كما في كودك الأصلي مع الحفاظ على الإعلانات المضافة
    const fetchData = useCallback(async () => {
      setLoading(true);
      try {
        const response = await fetch(API.announcements, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : data?.announcements ?? [];
          if (list.length > 0) setAnnouncements(list);
        }
      } catch {
        // في حالة عدم تشغيل السيرفر المحلي نحتفظ بالإعلانات الحالية في الواجهة
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    }, []);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // فتح صفحة المطاعم الموحدة على المطعم الذي ضغط عليه الأدمن
    const handleOpenRestaurantBlock = (restKey) => {
      setSelectedRestaurantKey(restKey);
      setActiveScreen("orderPage");
      setIsQuickPickerOpen(false);
    };

    // رفع صورة منيو خاصة لمطعم معين
    const handleUploadMenuImage = (restKey, imageUrl) => {
      setCustomMenuImages((prev) => ({ ...prev, [restKey]: imageUrl }));
    };

    // عند الضغط على زرار "إصدار" داخل بلوك المطعم
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
      setToastMessage(`تم إصدار أوردر (${orderPayload.restaurantNameAr}) ونشر المنيو بنجاح!`);
      setTimeout(() => setToastMessage(""), 4000);
    };

    // حذف/إلغاء إعلان للأدمن
    const handleDeleteAnnouncement = (id) => {
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    };

    return (
      <div
        className="relative min-h-screen w-full overflow-x-hidden bg-[#F4A261] p-3 sm:p-6 md:p-8 text-[#1a1a1a] select-none"
        dir="rtl"
      >
        {/* الخطوط والأشكال السداسية */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800;900&family=Oswald:wght@500;600;700&display=swap');
          .font-cairo { font-family: 'Cairo', sans-serif; }
          .font-oswald { font-family: 'Oswald', sans-serif; letter-spacing: 0.03em; }
          .hex-order-btn {
            clip-path: polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
        `}</style>

        {/* نقشة الأكل على الخلفية البرتقالية */}
        <FoodDoodlePattern id="main-bg-doodles" opacity={0.18} strokeColor="#6b3e16" />

        {/* شريط علوي صغير للتحكم والتنبيهات */}
        <div className="relative z-10 mx-auto mb-4 flex max-w-[1440px] flex-wrap items-center justify-between gap-3 font-cairo">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#FFF4E6]/95 px-4 py-1.5 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#F4A261]" />
            <span className="text-xs sm:text-sm font-black">
              لوحة إعلانات الدليفري ({isAdmin ? "وضع الأدمن / الكوليكتور" : "وضع المستخدم"})
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
              onClick={() => setIsAdmin(!isAdmin)}
              className="rounded-full border border-[#4a4a4a] bg-[#FFF4E6] hover:bg-white px-3.5 py-1.5 text-xs font-black text-[#1a1a1a] cursor-pointer shadow-sm"
            >
              تبديل الصلاحية: {isAdmin ? "Admin ✓" : "User"}
            </button>

            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#4a4a4a] bg-[#737373] hover:bg-[#5e5e5e] px-3.5 py-1.5 text-xs font-bold text-[#FFF4E6] cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            التخطيط الرئيسي مطابق للصورة (العمود الأيمن RESTAURANTS + الكارت الأيسر الكبير)
          ===================================================================== */}
        <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col lg:flex-row gap-6 items-stretch font-cairo">
          
          {/* ===================================================================
              1. العمود الأيمن: كارت المطاعم الأربعة + زر رفع مطعم جديد (ADD RESTAURANT +)
            =================================================================== */}
          <aside className="w-full lg:w-[340px] xl:w-[370px] shrink-0 rounded-[34px] border-[2.5px] border-[#b8926a] bg-[#FFF4E6] p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between relative overflow-hidden">
            <FoodDoodlePattern id="sidebar-doodles" opacity={0.045} strokeColor="#8c6239" />

            <div className="relative z-10">
              {/* هيدر RESTAURANTS الرمادي */}
              <div className="mb-6 flex items-center justify-center rounded-2xl border-2 border-[#4a4a4a] bg-[#636363] py-3.5 px-4 shadow-inner">
                <h2 className="font-oswald text-2xl sm:text-[28px] font-bold tracking-wider text-white uppercase">
                  RESTAURANTS
                </h2>
              </div>

              {/* بيانات الكوليكتور السريعة */}
              <div className="mb-5 rounded-2xl border border-[#737373]/30 bg-white/80 p-3.5 text-xs">
                <div className="flex items-center gap-2.5 font-black text-[#1a1a1a]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#737373] text-[#FFF4E6]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black">{user.name}</p>
                    <p className="text-[11px] text-[#555]">
                      أوضة {user.roomNumber} • {user.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* الأزرار الأربعة الثابتة (شكشك، كرم الشام، زيزو، شطة ودقة) */}
              {isAdmin ? (
                <div className="flex flex-col gap-3.5">
                  {Object.values(FOUR_RESTAURANTS_CONFIG).map((rest) => {
                    const isActive =
                      activeScreen === "orderPage" && selectedRestaurantKey === rest.id;
                    return (
                      <button
                        key={rest.id}
                        type="button"
                        onClick={() => handleOpenRestaurantBlock(rest.id)}
                        className={`w-full rounded-full py-2.5 px-5 border-2 transition-all duration-200 flex items-center justify-between cursor-pointer shadow-sm ${
                          isActive
                            ? "bg-[#525252] border-[#1a1a1a] ring-4 ring-[#F4A261]/60 scale-[1.02]"
                            : "bg-[#737373] hover:bg-[#616161] border-[#4f4f4f]"
                        }`}
                      >
                        <span className="font-cairo font-black text-lg sm:text-xl text-[#111111]">
                          {rest.nameAr}
                        </span>
                        <span className="font-oswald font-bold text-base sm:text-lg text-[#111111] tracking-wide uppercase">
                          {rest.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* لو المستخدم العادي مش أدمن يقدر يطلب صلاحية الأدمن */
                <div className="rounded-2xl border border-[#737373]/30 bg-white p-4">
                  <div className="flex items-center gap-2 font-black text-[#1a1a1a]">
                    <ShieldCheck className="h-5 w-5 text-[#F4A261]" />
                    <span>صلاحيات الحساب</span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-[#555] font-bold">
                    اختيار المطاعم وإصدار إعلان جديد متاح للأدمن (Collector). يمكنك طلب الصلاحية هنا:
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setRequestMessage("تم إرسال طلب صلاحية الأدمن بنجاح! (أو اضغط تبديل الصلاحية بالأعلى للتجربة)")
                    }
                    className="mt-3 w-full rounded-xl bg-[#737373] hover:bg-[#5a5a5a] py-2.5 text-xs font-black text-[#FFF4E6] cursor-pointer"
                  >
                    طلب صلاحية Admin
                  </button>
                  {requestMessage && (
                    <p className="mt-2 rounded-xl bg-[#F4A261]/25 p-2.5 text-xs font-bold text-[#1a1a1a]">
                      {requestMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* الزر الأخير في أسفل العمود الأيمن: ADD RESTAURANT + لرفع صورة منيو ومطعم مخصوص */}
            <div className="relative z-10 mt-8 pt-3">
              <button
                type="button"
                onClick={() => handleOpenRestaurantBlock("custom")}
                className={`w-full rounded-2xl py-2.5 px-4 border-2 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  activeScreen === "orderPage" && selectedRestaurantKey === "custom"
                    ? "bg-[#525252] text-white border-[#1a1a1a] ring-4 ring-[#F4A261]/60"
                    : "bg-[#737373] hover:bg-[#616161] text-[#111111] border-[#4f4f4f]"
                }`}
              >
                <Upload className="h-4 w-4" />
                <span className="font-oswald font-bold text-base sm:text-lg tracking-wider uppercase">
                  ADD RESTAURANT +
                </span>
              </button>
            </div>
          </aside>

          {/* ===================================================================
              2. الكارت الكبير الأيسر:
                - إما يعرض الإعلانات الحالية + زر "اطلب هنا" السداسي
                - أو يعرض صفحة البلوكات الموحدة (شكشك / كرم / زيزو / شطة ودقة / رفع صورة)
                  بحيث كلهم في نفس الصفحة ومعمولهم hidden ما عدا المختار!
            =================================================================== */}
          <main className="flex-1 rounded-[34px] border-[2.5px] border-[#b8926a] bg-[#FFF4E6] p-5 sm:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between relative overflow-hidden min-h-[600px]">
            <FoodDoodlePattern id="main-card-doodles" opacity={0.045} strokeColor="#8c6239" />

            {activeScreen === "dashboard" ? (
              /* ---------------------------------------------------------------
                الشاشة الأولى: لوحة الإعلانات الحالية + الزر السداسي "اطلب هنا"
                --------------------------------------------------------------- */
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div>
                  {/* هيدر الإعلانات */}
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

                  {/* قائمة كروت الإعلانات */}
                  {announcements.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#737373]/40 bg-white/60 p-8 text-center">
                      <Megaphone className="mb-3 h-10 w-10 text-[#737373]" />
                      <h3 className="text-lg font-black">مفيش إعلانات متاحة حالياً</h3>
                      <p className="mt-1 text-xs font-bold text-[#666]">
                        اضغط على أحد المطاعم الأربعة على اليمين أو زر "اطلب هنا" لإصدار أوردر جديد.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5">
                      {announcements.map((ann) => (
                        <article
                          key={ann._id}
                          className="overflow-hidden rounded-3xl border-2 border-[#737373]/50 bg-white/90 shadow-md transition hover:shadow-lg"
                        >
                          {/* شريط بيانات الكوليكتور أعلى الإعلان */}
                          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#737373] px-5 py-3 text-[#FFF4E6]">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4A261] text-[#1a1a1a] font-black">
                                <User className="h-4 w-4" />
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                                <span className="font-black text-white">
                                  الكوليكتور: {ann.collectorName || user.name}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[#FFF4E6]/90 font-bold">
                                  <DoorOpen className="h-3.5 w-3.5 text-[#F4A261]" />
                                  أوضة: {ann.roomNumber || user.roomNumber}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[#FFF4E6]/90 font-bold">
                                  <Phone className="h-3.5 w-3.5 text-[#F4A261]" />
                                  {ann.phone || user.phone}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-[#F4A261] px-3 py-0.5 text-xs font-black text-[#1a1a1a]">
                                {ann.restaurantName}
                              </span>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAnnouncement(ann._id)}
                                  className="rounded-lg bg-red-500/20 hover:bg-red-500 p-1.5 text-white transition cursor-pointer"
                                  title="إلغاء الإعلان"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* محتوى الإعلان: صورة المنيو + الرسالة + طلبات الأدمن */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center">
                            {/* صورة المنيو المرفوعة مع الإعلان */}
                            <div className="md:col-span-5">
                              <div
                                onClick={() => setZoomedMenuImage(ann.menuImage)}
                                className="relative h-44 w-full overflow-hidden rounded-2xl border-2 border-[#737373] bg-[#FFF4E6] cursor-pointer group"
                              >
                                <img
                                  src={ann.menuImage}
                                  alt={ann.restaurantName}
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3">
                                  <span className="text-xs font-black text-white">
                                    منيو {ann.restaurantName}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#F4A261] px-2.5 py-1 text-[11px] font-black text-[#1a1a1a]">
                                    <ZoomIn className="h-3.5 w-3.5" />
                                    عرض المنيو
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* الرسالة والأصناف */}
                            <div className="md:col-span-7 flex flex-col justify-between gap-3">
                              <div className="flex items-start gap-2 rounded-2xl bg-[#FFF4E6] p-3.5 border border-[#737373]/30">
                                <MessageSquare className="h-5 w-5 shrink-0 text-[#F4A261] mt-0.5" />
                                <p className="text-sm font-black leading-relaxed text-[#1a1a1a]">
                                  {ann.message}
                                </p>
                              </div>

                              {ann.items && ann.items.length > 0 && (
                                <div className="rounded-2xl bg-gray-50 p-3 border border-gray-200">
                                  <span className="block text-xs font-black text-[#555] mb-2">
                                    طلب الأدمن المبدئي في هذا الأوردر:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ann.items.map((item, i) => (
                                      <span
                                        key={item.id || i}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#737373] px-3 py-1 text-xs font-bold text-[#FFF4E6]"
                                      >
                                        <span>{item.name}</span>
                                        <span className="rounded-full bg-[#F4A261] px-1.5 text-[10px] font-black text-[#1a1a1a]">
                                          ×{item.quantity || 1}
                                        </span>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                {/* الزر السداسي الكبير في الأسفل: "اطلب هنا" */}
                <div className="pt-4 flex flex-col items-center">
                  <div className="w-full max-w-[680px] p-[2.5px] bg-[#4a4a4a] hex-order-btn shadow-md">
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
              /* ---------------------------------------------------------------
                الشاشة الثانية (صفحة واحدة تجمع الـ 4 مطاعم + مطعم الـ Upload وكلهم hidden ما عدا المختار)
                --------------------------------------------------------------- */
              <div className="relative z-10 flex h-full flex-col justify-between">
                {/* شريط علوي للتبديل السريع بين البلوكات أو الرجوع للوحة الإعلانات */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#737373]/15 p-2.5 border border-[#737373]/30">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Object.values(FOUR_RESTAURANTS_CONFIG).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRestaurantKey(r.id)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer ${
                          selectedRestaurantKey === r.id
                            ? "bg-[#737373] text-[#FFF4E6] shadow"
                            : "bg-white/70 text-[#3a3a3a] hover:bg-white"
                        }`}
                      >
                        {r.nameAr}
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

                {/* ===============================================================
                    الـ 4 كومبوننتات موجودين في نفس الصفحة ومعمولهم hidden ما عدا المختار
                  =============================================================== */}
                <div className="my-auto">
                  {/* 1. بلوك شكشك */}
                  <RestaurantOrderBlock
                    restaurant={FOUR_RESTAURANTS_CONFIG.shakshak}
                    isVisible={selectedRestaurantKey === "shakshak"}
                    menuImage={customMenuImages.shakshak}
                    onUploadMenuImage={handleUploadMenuImage}
                    onIssueOrder={handleIssueNewOrder}
                    onPreviewFullImage={(img) => setZoomedMenuImage(img)}
                  />

                  {/* 2. بلوك كرم الشام */}
                  <RestaurantOrderBlock
                    restaurant={FOUR_RESTAURANTS_CONFIG.karam}
                    isVisible={selectedRestaurantKey === "karam"}
                    menuImage={customMenuImages.karam}
                    onUploadMenuImage={handleUploadMenuImage}
                    onIssueOrder={handleIssueNewOrder}
                    onPreviewFullImage={(img) => setZoomedMenuImage(img)}
                  />

                  {/* 3. بلوك زيزو */}
                  <RestaurantOrderBlock
                    restaurant={FOUR_RESTAURANTS_CONFIG.zizo}
                    isVisible={selectedRestaurantKey === "zizo"}
                    menuImage={customMenuImages.zizo}
                    onUploadMenuImage={handleUploadMenuImage}
                    onIssueOrder={handleIssueNewOrder}
                    onPreviewFullImage={(img) => setZoomedMenuImage(img)}
                  />

                  {/* 4. بلوك شطة ودقة */}
                  <RestaurantOrderBlock
                    restaurant={FOUR_RESTAURANTS_CONFIG.shata}
                    isVisible={selectedRestaurantKey === "shata"}
                    menuImage={customMenuImages.shata}
                    onUploadMenuImage={handleUploadMenuImage}
                    onIssueOrder={handleIssueNewOrder}
                    onPreviewFullImage={(img) => setZoomedMenuImage(img)}
                  />

                  {/* 5. بلوك رفع صورة منيو ومطعم مخصوص (الزرار الخامس في الآخر) */}
                  <CustomUploadRestaurantBlock
                    isVisible={selectedRestaurantKey === "custom"}
                    onIssueOrder={handleIssueNewOrder}
                  />
                </div>
              </div>
            )}
          </main>
        </div>

        {/* =====================================================================
            نافذة منبثقة عند الضغط على "اطلب هنا" لاختيار واحد من الـ 4 مطاعم أو الزرار الخامس لرفع صورة
          ===================================================================== */}
        {isQuickPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm font-cairo">
            <div className="relative w-full max-w-lg rounded-[32px] border-[3px] border-[#4a4a4a] bg-[#FFF4E6] p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-[#737373]/30 pb-3">
                <h3 className="text-xl font-black text-[#1a1a1a]">
                  اختار المطعم لفتح المنيو وإصدار الأوردر
                </h3>
                <button
                  type="button"
                  onClick={() => setIsQuickPickerOpen(false)}
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
                    onClick={() => handleOpenRestaurantBlock(rest.id)}
                    className="flex w-full items-center justify-between rounded-full border-2 border-[#4a4a4a] bg-[#737373] hover:bg-[#5e5e5e] px-6 py-3 text-[#111111] transition cursor-pointer shadow-sm"
                  >
                    <span className="text-xl font-black">{rest.nameAr}</span>
                    <span className="font-oswald text-lg font-bold uppercase">
                      {rest.nameEn}
                    </span>
                  </button>
                ))}

                {/* الزرار الخامس في الآخر: Upload Image لمطعم جديد */}
                <div className="pt-3 border-t border-[#737373]/30">
                  <button
                    type="button"
                    onClick={() => handleOpenRestaurantBlock("custom")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1a1a1a] bg-[#F4A261] hover:bg-[#e58e49] px-5 py-3.5 text-base font-black text-[#1a1a1a] shadow cursor-pointer"
                  >
                    <Upload className="h-5 w-5" />
                    <span>مطعم آخر + ارفع صورة المنيو (Upload Image)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            نافذة تكبير صورة المنيو الكاملة
          ===================================================================== */}
        {zoomedMenuImage && (
          <div
            onClick={() => setZoomedMenuImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border-4 border-[#FFF4E6] bg-black shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setZoomedMenuImage(null)}
                className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4A261] text-[#1a1a1a] border-2 border-black font-black cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={zoomedMenuImage}
                alt="Full Menu"
                className="max-h-[85vh] w-auto object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    );
  }