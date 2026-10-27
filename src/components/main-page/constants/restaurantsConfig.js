export const ROUTES = {
  placeOrder: "/createOrder",
  collectOrders: "/collectOrders",
  requestAdmin: "/requestAdmin",
};

export const API = {
  announcements: "/api/announcements",
  restaurants: "/api/restaurants",
  requestAdmin: "/api/users/request-admin",
};

export const FOUR_RESTAURANTS_CONFIG = {
  shakshak: {
    id: "shakshak",
    nameAr: "شكشك",
    nameEn: "SHAK SHAK",
    defaultMessage:
      "يا رجالة أنا نازل أجيب من شكشك، اللي عايز فطير أو عصير يلحق يسجل طلبه دلوقتي!",
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