import { useMemo } from "react";
import { Download, MessageCircle, ShoppingBag } from "lucide-react";

const formatMoney = (amount) =>
  `${Number(amount || 0).toFixed(2)} ج.م`;

const getOrderItems = (order) => (Array.isArray(order.items) ? order.items : []);

const getSizeLabel = (item) =>
  item.sizeName || item.sizeCode || item.size || "عادي";

const escapeCsvValue = (value) => {
  const text = String(value ?? "");
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;

  return `"${safeText.replaceAll('"', '""')}"`;
};

const getWhatsAppLinkNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.startsWith("0") ? `20${digits.slice(1)}` : digits;
};

function downloadOrdersSheet(orders, summaries) {
  const rows = [
    [
      "نوع السجل",
      "اسم المطعم",
      "اسم العميل",
      "رقم WhatsApp",
      "الصنف",
      "الطلب المكتوب",
      "الحجم",
      "الكمية",
      "قيمة الصنف",
      "إجمالي الطلب",
      "إجمالي الكمية لهذا الصنف والحجم",
      "العملاء الذين طلبوه",
    ],
  ];

  orders.forEach((order) => {
    getOrderItems(order).forEach((item) => {
      rows.push([
        "تفاصيل الطلب",
        order.restaurantName,
        order.customerName,
        order.whatsapp ? `'${order.whatsapp}` : "",
        item.name,
        order.customRequest || "",
        getSizeLabel(item),
        item.quantity,
        Number(item.price || 0) * Number(item.quantity || 0),
        order.total,
        "",
        "",
      ]);
    });

    if (order.customRequest) {
      rows.push([
        "طلب مكتوب",
        order.restaurantName,
        order.customerName,
        order.whatsapp ? `'${order.whatsapp}` : "",
        "",
        order.customRequest,
        "",
        "",
        "",
        order.total,
        "",
        "",
      ]);
    }
  });

  summaries.forEach((summary) => {
    rows.push([
      "ملخص الصنف والحجم",
      summary.restaurantName,
      "",
      "",
      summary.itemName,
      "",
      summary.size,
      "",
      summary.total,
      "",
      summary.quantity,
      summary.customers,
    ]);
  });

  rows.push([
    "الإجمالي العام",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    "",
    "",
  ]);

  const csv = `\uFEFF${rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n")}`;
  const downloadUrl = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = `guest-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

export default function GuestOrdersDashboard({
  orders,
  error,
  onRetry,
  onBack,
}) {
  const summaries = useMemo(() => {
    const grouped = new Map();

    orders.forEach((order) => {
      getOrderItems(order).forEach((item) => {
        const restaurantName = order.restaurantName || "مطعم";
        const size = getSizeLabel(item);
        const key = [
          order.restaurantKey || restaurantName,
          item.id || item.name,
          size,
        ].join("|");
        const summary = grouped.get(key) || {
          restaurantName,
          itemName: item.name || "صنف",
          size,
          quantity: 0,
          total: 0,
          customers: [],
        };

        summary.quantity += Number(item.quantity || 0);
        summary.total +=
          Number(item.price || 0) * Number(item.quantity || 0);
        summary.customers.push(
          `${order.customerName || "عميل"} (${order.whatsapp || "بدون رقم"})`,
        );
        grouped.set(key, summary);
      });
    });

    return [...grouped.values()].sort((first, second) =>
      `${first.restaurantName}${first.itemName}${first.size}`.localeCompare(
        `${second.restaurantName}${second.itemName}${second.size}`,
        "ar",
      ),
    );
  }, [orders]);

  const totalCollected = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const totalPieces = orders.reduce(
    (sum, order) =>
      sum +
      getOrderItems(order).reduce(
        (itemSum, item) => itemSum + Number(item.quantity || 0),
        0,
      ),
    0,
  );

  return (
    <section className="relative z-10 space-y-6 font-cairo" dir="rtl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#737373]/25 pb-4">
        <div>
          <p className="font-oswald text-xs font-bold tracking-widest text-[#737373]">
            CUSTOMER ORDERS
          </p>
          <h1 className="mt-1 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
            لوحة طلبات الضيوف
          </h1>
          <p className="mt-1 text-sm font-bold text-[#737373]">
            بيانات العملاء، الأصناف والأحجام والكميات والإجماليات.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => downloadOrdersSheet(orders, summaries)}
            disabled={orders.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#4a4a4a] bg-[#F4A261] px-4 py-2 font-black text-[#1a1a1a] transition hover:bg-[#e9954e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={18} />
            تنزيل كشف CSV
          </button>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border-2 border-[#4a4a4a] bg-[#737373] px-4 py-2 font-bold text-white transition hover:bg-[#5e5e5e]"
          >
            الرجوع للإعلانات
          </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-800"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-red-400 px-3 py-1.5 hover:bg-red-100"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#737373]/30 bg-white/90 p-4">
          <p className="text-sm font-bold text-[#737373]">عدد الطلبات</p>
          <p className="mt-1 text-2xl font-black text-[#1a1a1a]">
            {orders.length}
          </p>
        </div>
        <div className="rounded-2xl border border-[#737373]/30 bg-white/90 p-4">
          <p className="text-sm font-bold text-[#737373]">إجمالي القطع</p>
          <p className="mt-1 text-2xl font-black text-[#1a1a1a]">
            {totalPieces}
          </p>
        </div>
        <div className="rounded-2xl border border-[#737373]/30 bg-white/90 p-4">
          <p className="text-sm font-bold text-[#737373]">إجمالي المبالغ</p>
          <p className="mt-1 text-2xl font-black text-[#737373]">
            {formatMoney(totalCollected)}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-[#1a1a1a]">
          كل عميل وطلبه بالتفصيل
        </h2>
        {orders.map((order) => (
          <article
            key={order.id}
            className="overflow-hidden rounded-2xl border border-[#737373]/30 bg-white/90"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 bg-[#737373] p-4 text-white">
              <div>
                <h3 className="font-black">
                  طلب {order.customerName} — {order.restaurantName}
                </h3>
                <p className="mt-1 text-sm">
                  {new Date(order.createdAt).toLocaleString("ar-EG")}
                </p>
              </div>
              <a
                href={`https://wa.me/${getWhatsAppLinkNumber(order.whatsapp)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 font-bold text-[#102b19]"
              >
                <MessageCircle size={17} />
                {order.whatsapp}
              </a>
            </header>
            <div className="space-y-2 p-4">
              {order.customRequest && (
                <div className="rounded-xl bg-[#FFF4E6] p-3">
                  <p className="text-sm font-black text-[#1a1a1a]">الطلب المكتوب</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {order.customRequest}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#737373]">
                    سعر الأصناف يحدده الكوليكتور بعد مراجعة الطلب.
                  </p>
                </div>
              )}
              {getOrderItems(order).map((item, index) => (
                <div
                  key={`${item.cartItemId || item.id}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-[#737373]/15 pb-2 last:border-0"
                >
                  <span className="font-bold">
                    {item.name} ({getSizeLabel(item)}) × {item.quantity}
                  </span>
                  <span>{formatMoney(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex flex-wrap justify-between gap-2 pt-2 font-bold">
                <span>الأصناف: {formatMoney(order.itemsTotal)}</span>
                <span>التوصيل: {formatMoney(order.deliveryFees)}</span>
                <span className="text-lg text-[#737373]">
                  {order.customRequest ? "الإجمالي المبدئي" : "الإجمالي"}:{" "}
                  {formatMoney(order.total)}
                </span>
              </div>
              {order.customRequest && (
                <p className="text-xs font-bold text-[#737373]">
                  الإجمالي لا يشمل سعر الطلب المكتوب.
                </p>
              )}
            </div>
          </article>
        ))}
        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#737373]/40 bg-white/70 p-8 text-center text-[#737373]">
            <ShoppingBag className="mx-auto mb-2" />
            هتظهر هنا طلبات الضيوف بعد ما يأكدوا طلباتهم.
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border-2 border-[#737373]/40 bg-white/90">
        <div className="border-b border-[#737373]/20 p-4">
          <h2 className="text-lg font-black text-[#1a1a1a]">
            ملخص الكميات حسب الصنف والحجم
          </h2>
          <p className="mt-1 text-sm font-bold text-[#737373]">
            الإجمالي المجمع لكل صنف، مع فصل الأحجام وبيان العملاء الذين طلبوه.
          </p>
        </div>
        {summaries.length === 0 ? (
          <p className="p-8 text-center text-sm font-bold text-[#737373]">
            لسه مفيش طلبات ضيوف.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-right text-sm">
              <thead className="bg-[#737373] text-white">
                <tr>
                  <th className="p-3">المطعم</th>
                  <th className="p-3">الصنف</th>
                  <th className="p-3">الحجم</th>
                  <th className="p-3">الكمية</th>
                  <th className="p-3">الإجمالي</th>
                  <th className="p-3">العملاء وأرقامهم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#737373]/15">
                {summaries.map((summary) => (
                  <tr
                    key={`${summary.restaurantName}-${summary.itemName}-${summary.size}`}
                  >
                    <td className="p-3 font-bold">{summary.restaurantName}</td>
                    <td className="p-3 font-bold">{summary.itemName}</td>
                    <td className="p-3">{summary.size}</td>
                    <td className="p-3 font-black">{summary.quantity}</td>
                    <td className="p-3 font-bold">{formatMoney(summary.total)}</td>
                    <td className="p-3">{summary.customers.join("، ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
