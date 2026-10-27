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

const item = (id, name, prices) => ({
  id,
  name,
  prices: {
    S: prices.S ?? null,
    M: prices.M ?? null,
    L: prices.L ?? null,
  },
});

export const FOUR_RESTAURANTS_CONFIG = {
  shakshak: {
    id: "shakshak",
    nameAr: "شكشك",
    nameEn: "SHAK SHAK",

    defaultMessage:
      "يا رجالة أنا نازل أجيب من شكشك، اللي عايز يطلب يلحق يسجل طلبه دلوقتي!",

    sizeLabels: {
      S: "صغير",
      M: "وسط",
      L: "كبير",
    },

    categories: [
      {
        id: "italian-pizza",
        name: "البيتزا الإيطالي",
        items: [
          item("sh_ip_01", "بيتزا مارغريتا", { S: 90, M: 130, L: 180 }),
          item("sh_ip_02", "بيتزا خضار", { S: 100, M: 140, L: 190 }),
          item("sh_ip_03", "بيتزا كيري", { S: 110, M: 160, L: 210 }),
          item("sh_ip_04", "بيتزا مشكل جبن", { S: 120, M: 170, L: 230 }),
          item("sh_ip_05", "بيتزا مشروم", { S: 110, M: 155, L: 200 }),
        ],
      },

      {
        id: "oriental-pizza",
        name: "قسم اللحوم - البيتزا",
        items: [
          item("sh_op_01", "بيتزا سجق", { S: 110, M: 155, L: 205 }),
          item("sh_op_02", "بيتزا سجق بلدي", { S: 130, M: 170, L: 230 }),
          item("sh_op_03", "بيتزا لحمة", { S: 110, M: 160, L: 210 }),
          item("sh_op_04", "بيتزا شاورما لحمة", { S: 120, M: 170, L: 220 }),
          item("sh_op_05", "بيتزا سوسيس", { S: 110, M: 155, L: 205 }),
          item("sh_op_06", "بيتزا بسطرمة", { S: 120, M: 170, L: 230 }),
          item("sh_op_07", "بيتزا سموك تركي", { S: 120, M: 170, L: 230 }),
          item("sh_op_08", "بيتزا سلامي", { S: 120, M: 170, L: 230 }),
          item("sh_op_09", "بيتزا ميكس لحوم", { S: 130, M: 180, L: 240 }),
          item("sh_op_10", "بيتزا لحوم مدخنة", { S: 130, M: 180, L: 240 }),
          item("sh_op_11", "بيتزا سجق كيري", { S: 130, M: 180, L: 240 }),
          item("sh_op_12", "بيتزا سوبر سوبريم", { S: 130, M: 180, L: 240 }),
          item("sh_op_13", "بيتزا سجق بلدي كيري", { S: 140, M: 180, L: 250 }),
        ],
      },

      {
        id: "chicken-pizza",
        name: "قسم الفراخ - البيتزا",
        items: [
          item("sh_cp_01", "بيتزا فرجيـنيا فراخ", { S: 120, M: 160, L: 220 }),
          item("sh_cp_02", "بيتزا كرانشي", { S: 120, M: 160, L: 220 }),
          item("sh_cp_03", "بيتزا استربس", { S: 130, M: 170, L: 240 }),
          item("sh_cp_04", "بيتزا تشيكن رانش", { S: 130, M: 180, L: 235 }),
          item("sh_cp_05", "بيتزا تشيكن باربكيو", { S: 130, M: 180, L: 235 }),
          item("sh_cp_06", "بيتزا ميكس فراخ", { S: 135, M: 175, L: 245 }),
          item("sh_cp_07", "بيتزا فراخ كيري", { S: 130, M: 180, L: 250 }),
          item("sh_cp_08", "بيتزا فراخ مشروم", { S: 150, M: 200, L: 270 }),
          item("sh_cp_09", "بيتزا تونة", { S: 130, M: 175, L: 240 }),
          item("sh_cp_10", "بيتزا جمبري", { S: 150, M: 200, L: 270 }),
          item("sh_cp_11", "بيتزا سي فود", { S: 160, M: 210, L: 280 }),
          item("sh_cp_12", "بيتزا عم شكشك", { S: 160, M: 210, L: 270 }),
        ],
      },

      {
        id: "meat-pizza",
        name: "قسم اللحوم",
        items: [
          item("sh_mp_01", "بيتزا سجق", { S: 100, M: 145, L: 185 }),
          item("sh_mp_02", "بيتزا سجق بلدي", { S: 120, M: 160, L: 210 }),
          item("sh_mp_03", "بيتزا سجق كيري", { S: 115, M: 160, L: 220 }),
          item("sh_mp_04", "بيتزا سجق مشروم", { S: 120, M: 160, L: 220 }),
          item("sh_mp_05", "بيتزا سجق بلدي كيري", { S: 130, M: 180, L: 250 }),
          item("sh_mp_06", "بيتزا سجق جبن", { S: 115, M: 160, L: 220 }),
          item("sh_mp_07", "بيتزا لحمة", { S: 110, M: 155, L: 200 }),
          item("sh_mp_08", "بيتزا شاورما لحمة", { S: 120, M: 160, L: 210 }),
          item("sh_mp_09", "بيتزا سوسيس", { S: 110, M: 145, L: 185 }),
          item("sh_mp_10", "بيتزا بسطرمة", { S: 120, M: 160, L: 210 }),
          item("sh_mp_11", "بيتزا سموك تركي", { S: 120, M: 160, L: 210 }),
          item("sh_mp_12", "بيتزا سلامي", { S: 120, M: 160, L: 210 }),
          item("sh_mp_13", "بيتزا ميكس لحوم", { S: 130, M: 180, L: 240 }),
          item("sh_mp_14", "بيتزا لحوم مدخنة", { S: 130, M: 170, L: 240 }),
        ],
      },

      {
        id: "chicken-pies",
        name: "قسم الفراخ - الفطائر",
        items: [
          item("sh_fp_01", "فطيرة فراخ", { S: 120, M: 160, L: 220 }),
          item("sh_fp_02", "فطيرة فراخ كيري", { S: 130, M: 175, L: 240 }),
          item("sh_fp_03", "فطيرة كرسبي", { S: 120, M: 160, L: 220 }),
          item("sh_fp_04", "فطيرة فراخ رانش", { S: 130, M: 170, L: 240 }),
          item("sh_fp_05", "فطيرة فراخ باربكيو", { S: 130, M: 170, L: 240 }),
          item("sh_fp_06", "فطيرة ميكس فراخ", { S: 135, M: 175, L: 250 }),
          item("sh_fp_07", "فطيرة فراخ مشروم", { S: 130, M: 170, L: 240 }),
          item("sh_fp_08", "فطيرة تونة", { S: 125, M: 170, L: 240 }),
          item("sh_fp_09", "فطيرة جمبري", { S: 150, M: 200, L: 270 }),
          item("sh_fp_10", "فطيرة سي فود", { S: 160, M: 210, L: 280 }),
          item("sh_fp_11", "فطيرة عم شكشك", { S: 160, M: 210, L: 270 }),
        ],
      },

      {
        id: "meat-pies",
        name: "قسم اللحوم - الفطائر",
        items: [
          item("sh_fm_01", "فطيرة سجق إسكندراني", { S: 100, M: 145, L: 185 }),
          item("sh_fm_02", "فطيرة سجق بلدي", { S: 120, M: 160, L: 210 }),
          item("sh_fm_03", "فطيرة سجق كيري", { S: 115, M: 160, L: 220 }),
          item("sh_fm_04", "فطيرة سجق مشروم", { S: 120, M: 160, L: 220 }),
          item("sh_fm_05", "فطيرة سجق بلدي كيري", { S: 130, M: 180, L: 250 }),
          item("sh_fm_06", "فطيرة سجق جبن", { S: 115, M: 160, L: 220 }),
          item("sh_fm_07", "فطيرة لحمة", { S: 110, M: 155, L: 200 }),
          item("sh_fm_08", "فطيرة شاورما لحمة", { S: 120, M: 160, L: 210 }),
          item("sh_fm_09", "فطيرة سوسيس", { S: 110, M: 145, L: 185 }),
          item("sh_fm_10", "فطيرة بسطرمة", { S: 110, M: 155, L: 200 }),
          item("sh_fm_11", "فطيرة بسطرمة كيري", { S: 130, M: 170, L: 240 }),
          item("sh_fm_12", "فطيرة سلامي", { S: 125, M: 170, L: 220 }),
          item("sh_fm_13", "فطيرة سموك تركي", { S: 125, M: 170, L: 220 }),
        ],
      },

      {
        id: "sweet-pies",
        name: "الفطائر الحلوة",
        items: [
          item("sh_sp_01", "فطيرة سكر", { S: 50, M: 75, L: 120 }),
          item("sh_sp_02", "فطيرة بغاشة", { S: 60, M: 85, L: 140 }),
          item("sh_sp_03", "فطيرة كاستر", { S: 70, M: 100, L: 150 }),
          item("sh_sp_04", "فطيرة ميكس", { S: 95, M: 140, L: 170 }),
          item("sh_sp_05", "فطيرة قشطة وعسل", { S: 95, M: 140, L: 170 }),
          item("sh_sp_06", "فطيرة قشطة ومكسرات", { S: 110, M: 160, L: 190 }),
          item("sh_sp_07", "فطيرة بسوسة", { S: 85, M: 110, L: 150 }),
          item("sh_sp_08", "فطيرة كنافة", { S: 85, M: 110, L: 160 }),
          item("sh_sp_09", "فطيرة بسوسة وكنافة", { S: 100, M: 120, L: 190 }),
          item("sh_sp_10", "فطيرة شوكولاتة", { S: 100, M: 140, L: 200 }),
          item("sh_sp_11", "فطيرة شوكولاتة بيضاء", { S: 100, M: 145, L: 200 }),
          item("sh_sp_12", "فطيرة شوكولاتة لوتس", { S: 110, M: 150, L: 210 }),
          item("sh_sp_13", "فطيرة ميكس شوكولاتة", { S: 125, M: 160, L: 205 }),
          item("sh_sp_14", "فطيرة شوكولاتة وموز", { S: 110, M: 150, L: 200 }),
          item("sh_sp_15", "فطيرة شوكولاتة وهوموز", { S: 110, M: 150, L: 200 }),
          item("sh_sp_16", "فطيرة شوكولاتة أوريو", { S: 110, M: 150, L: 200 }),
          item("sh_sp_17", "فطيرة شوكولاتة بندق", { S: 130, M: 180, L: 220 }),
          item("sh_sp_18", "فطيرة فور سيزون", { S: null, M: 180, L: 250 }),
          item("sh_sp_19", "فطيرة عم شكشك", { S: null, M: 220, L: 270 }),
        ],
      },

      {
        id: "macaroni",
        name: "قسم المكرونات",
        items: [
          item("sh_ma_01", "مكرونة سجق", { S: null, M: 90, L: 100 }),
          item("sh_ma_02", "مكرونة لحمة", { S: null, M: 90, L: 100 }),
          item("sh_ma_03", "مكرونة شاورما لحمة", { S: null, M: 95, L: 105 }),
          item("sh_ma_04", "مكرونة سوسيس", { S: null, M: 90, L: 100 }),
          item("sh_ma_05", "مكرونة بسطرمة", { S: null, M: 100, L: 110 }),
          item("sh_ma_06", "مكرونة ميكس لحوم", { S: null, M: 100, L: 110 }),
          item("sh_ma_07", "مكرونة لحوم مدخنة", { S: null, M: 100, L: 110 }),
          item("sh_ma_08", "مكرونة جمبري", { S: null, M: 140, L: 150 }),
          item("sh_ma_09", "مكرونة فراخ", { S: null, M: 100, L: 110 }),
          item("sh_ma_10", "مكرونة ميكس فراخ", { S: null, M: 110, L: 120 }),
          item("sh_ma_11", "مكرونة كرسبي", { S: null, M: 95, L: 110 }),
          item("sh_ma_12", "مكرونة استربس", { S: null, M: 120, L: 130 }),
          item("sh_ma_13", "مكرونة ميكس جبن", { S: null, M: 110, L: 120 }),
        ],
      },

      {
        id: "hawawshi",
        name: "قسم الحواوشي",
        items: [
          item("sh_hw_01", "حواوشي ميكس جبن", { S: null, M: 110, L: 160 }),
          item("sh_hw_02", "حواوشي مشروم", { S: null, M: 100, L: 150 }),
          item("sh_hw_03", "حواوشي سجق", { S: null, M: 100, L: 150 }),
          item("sh_hw_04", "حواوشي لحمة", { S: null, M: 100, L: 150 }),
          item("sh_hw_05", "حواوشي شاورما لحمة", { S: null, M: 110, L: 160 }),
          item("sh_hw_06", "حواوشي بسطرمة", { S: null, M: 110, L: 160 }),
          item("sh_hw_07", "حواوشي سوسيس", { S: null, M: 110, L: 150 }),
          item("sh_hw_08", "حواوشي ميكس لحوم", { S: null, M: 130, L: 170 }),
          item("sh_hw_09", "حواوشي فراخ", { S: null, M: 110, L: 160 }),
          item("sh_hw_10", "حواوشي فراخ مشروم", { S: null, M: 120, L: 170 }),
          item("sh_hw_11", "حواوشي كرسبي", { S: null, M: 110, L: 160 }),
          item("sh_hw_12", "حواوشي ميكس فراخ", { S: null, M: 130, L: 170 }),
          item("sh_hw_13", "حواوشي جمبري", { S: null, M: 150, L: 200 }),
          item("sh_hw_14", "حواوشي لحوم مدخنة", { S: null, M: 110, L: 170 }),
        ],
      },

      {
        id: "hot-crepes",
        name: "الكريب الحادق",
        items: [
          item("sh_ch_01", "كريب بانير كرسبي", { S: 90, M: null, L: null }),
          item("sh_ch_02", "كريب استربس زنجر", { S: 110, M: null, L: null }),
          item("sh_ch_03", "كريب كرانشي", { S: 100, M: null, L: null }),
          item("sh_ch_04", "كريب بطاطس", { S: 70, M: null, L: null }),
          item("sh_ch_05", "كريب سجق", { S: 90, M: null, L: null }),
          item("sh_ch_06", "كريب شاورما لحمة", { S: 100, M: null, L: null }),
          item("sh_ch_07", "كريب سوسيس", { S: 90, M: null, L: null }),
          item("sh_ch_08", "كريب برجر", { S: 100, M: null, L: null }),
          item("sh_ch_09", "كريب ميكس لحوم", { S: 110, M: null, L: null }),
          item("sh_ch_10", "كريب فراخ شيش", { S: 100, M: null, L: null }),
          item("sh_ch_11", "كريب فاهيتا", { S: 110, M: null, L: null }),
          item("sh_ch_12", "كريب ميكس فراخ", { S: 120, M: null, L: null }),
          item("sh_ch_13", "كريب بسطرمة", { S: 110, M: null, L: null }),
        ],
      },

      {
        id: "special-crepes",
        name: "كريب السبيشيال",
        items: [
          item("sh_cs_01", "كريب شكشك تقليدي", { S: 120, M: null, L: null }),
          item("sh_cs_02", "كريب تشيكن", { S: 120, M: null, L: null }),
          item("sh_cs_03", "كريب كرسبي", { S: 120, M: null, L: null }),
          item("sh_cs_04", "كريب شكشك", { S: 120, M: null, L: null }),
          item("sh_cs_05", "كريب عم شكشك", { S: 130, M: null, L: null }),
        ],
      },

      {
        id: "sweet-crepes",
        name: "كريب الحلو",
        items: [
          item("sh_sc_01", "كريب شوكولاتة", { S: 90, M: null, L: null }),
          item("sh_sc_02", "كريب شوكولاتة وموز", { S: 100, M: null, L: null }),
          item("sh_sc_03", "كريب شوكولاتة", { S: 110, M: null, L: null }),
          item("sh_sc_04", "كريب لوتس", { S: 110, M: null, L: null }),
        ],
      },

      {
        id: "additions",
        name: "الإضافات",
        items: [
          item("sh_ad_01", "إضافة موتزاريلا", { S: 40, M: null, L: 65 }),
          item("sh_ad_02", "إضافة لحوم", { S: 50, M: null, L: 75 }),
          item("sh_ad_03", "إضافة فراخ", { S: 60, M: null, L: 80 }),
          item("sh_ad_04", "إضافة كيري بالقطعة", { S: 20, M: null, L: null }),
          item("sh_ad_05", "إضافة رانش", { S: 25, M: null, L: null }),
          item("sh_ad_06", "إضافة باربكيو", { S: 25, M: null, L: null }),
        ],
      },

      {
        id: "appetizers",
        name: "المقبلات",
        items: [
          item("sh_ap_01", "علبة رانش", { S: 30, M: null, L: null }),
          item("sh_ap_02", "علبة باربكيو", { S: 30, M: null, L: null }),
          item("sh_ap_03", "بطاطس مخلل", { S: 15, M: null, L: null }),
          item("sh_ap_04", "مخلل", { S: 15, M: null, L: null }),
          item("sh_ap_05", "باكيت بطاطس", { S: 35, M: null, L: null }),
          item("sh_ap_06", "كاتشب", { S: 10, M: null, L: null }),
          item("sh_ap_07", "بطاطس موتزاريلا", { S: 80, M: null, L: null }),
        ],
      },
    ],

    // Legacy fields kept for components that still use row1Items/row2Items.
    row1Label: "البيتزا",
    row1Items: [
      item("sh_legacy_01", "بيتزا مارغريتا", { S: 90, M: 130, L: 180 }),
      item("sh_legacy_02", "بيتزا خضار", { S: 100, M: 140, L: 190 }),
      item("sh_legacy_03", "بيتزا كيري", { S: 110, M: 160, L: 210 }),
    ],

    row2Label: "الفطائر الحلوة",
    row2Items: [
      item("sh_legacy_04", "فطيرة سكر", { S: 50, M: 75, L: 120 }),
      item("sh_legacy_05", "فطيرة بغاشة", { S: 60, M: 85, L: 140 }),
      item("sh_legacy_06", "فطيرة كاستر", { S: 70, M: 100, L: 150 }),
    ],

    defaultMenuImage:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
  },
};

// karam: {
//   id: "karam",
//   nameAr: "كرم الشام",
//   nameEn: "KARAM ELSHAM",
//   defaultMessage:
//     "هجمع أوردر شاورما وفتة من كرم الشام، اللي هيدخل معانا يختار طلبه والحجم!",
//   row1Label: "شاورما سوري",
//   row1Items: [
//     { id: "kr_r1_1", name: "شاورما فراخ صاج", price: 65 },
//     { id: "kr_r1_2", name: "شاورما لحمة سوري", price: 75 },
//     { id: "kr_r1_3", name: "وجبة عربي فراخ دبل", price: 135 },
//     { id: "kr_r1_4", name: "سندوتش بطاطس بالجبنة", price: 45 },
//   ],
//   row2Label: "فتة وإضافات",
//   row2Items: [
//     { id: "kr_r2_1", name: "فتة شاورما فراخ", price: 110 },
//     { id: "kr_r2_2", name: "فتة شاورما ميكس", price: 125 },
//     { id: "kr_r2_3", name: "علبة تومية إضافي", price: 15 },
//     { id: "kr_r2_4", name: "كول سلو ومخلل", price: 20 },
//   ],
//   defaultMenuImage:
//     "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1200&q=80",
// },
// zizo: {
//   id: "zizo",
//   nameAr: "زيزو",
//   nameEn: "ZIZO",
//   defaultMessage:
//     "طلعة سريعة لزيزو! الكبدة والسجق والحواوشي سخنين، سجل طلبك بسرعة.",
//   row1Label: "سندوتشات",
//   row1Items: [
//     { id: "zz_r1_1", name: "كبدة إسكندراني حار", price: 35 },
//     { id: "zz_r1_2", name: "سجق شرقي بالجبنة", price: 40 },
//     { id: "zz_r1_3", name: "كفتة مشوية ع الفحم", price: 45 },
//     { id: "zz_r1_4", name: "سندوتش ميكس جريل", price: 55 },
//   ],
//   row2Label: "حواوشي ومقبلات",
//   row2Items: [
//     { id: "zz_r2_1", name: "حواوشي زيزو مخصوص", price: 70 },
//     { id: "zz_r2_2", name: "حواوشي وش بيتزا", price: 85 },
//     { id: "zz_r2_3", name: "باكت بطاطس بهارات", price: 25 },
//     { id: "zz_r2_4", name: "طحينة وسلطة بلدي", price: 15 },
//   ],
//   defaultMenuImage:
//     "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
// },
// shata: {
//   id: "shata",
//   nameAr: "شطة و دقة",
//   nameEn: "SHATA W DA2A",
//   defaultMessage:
//     "نازلين نجيب كشري وطواجن من شطة ودقة! حدد العلبة والحجم والإضافات.",
//   row1Label: "علب كشري",
//   row1Items: [
//     { id: "st_r1_1", name: "كشري مصري أصلي", price: 35 },
//     { id: "st_r1_2", name: "كشري سوبر إكسترا", price: 45 },
//     { id: "st_r1_3", name: "كشري بالكبدة", price: 60 },
//     { id: "st_r1_4", name: "فولاسو (عدس وحمص)", price: 30 },
//   ],
//   row2Label: "طواجن وحلو",
//   row2Items: [
//     { id: "st_r2_1", name: "طاجن مكرونة فراخ", price: 60 },
//     { id: "st_r2_2", name: "طاجن مكرونة لحمة", price: 55 },
//     { id: "st_r2_3", name: "إضافة تقلية وحمص", price: 15 },
//     { id: "st_r2_4", name: "رز بلبن فرن مكسرات", price: 30 },
//   ],
//   defaultMenuImage:
//     "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
// },