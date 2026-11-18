import { useEffect, useState } from "react";
import {
  getAdminRequests,
  reviewAdminRequest,
} from "../../API/adminRequests.js";

export default function AdminRequestsDashboard({ onBack }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyRequestId, setBusyRequestId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadRequests = async () => {
      try {
        const response = await getAdminRequests();
        if (isMounted) {
          setRequests(Array.isArray(response.requests) ? response.requests : []);
        }
      } catch (requestError) {
        console.error("Could not load admin access requests:", requestError);
        if (isMounted) {
          setError(requestError.message || "تعذر تحميل طلبات الصلاحية.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleReview = async (request, status) => {
    const requestId = request._id || request.id;
    setBusyRequestId(requestId);
    setError("");
    try {
      await reviewAdminRequest(requestId, status);
      setRequests((currentRequests) =>
        currentRequests.filter(
          (currentRequest) =>
            (currentRequest._id || currentRequest.id) !== requestId,
        ),
      );
    } catch (requestError) {
      console.error("Could not review admin access request:", requestError);
      setError(requestError.message || "تعذرت مراجعة الطلب.");
    } finally {
      setBusyRequestId("");
    }
  };

  return (
    <section className="relative z-10 space-y-5 font-cairo" dir="rtl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#737373]/25 pb-4">
        <div>
          <p className="font-oswald text-xs font-bold tracking-widest text-[#737373]">
            ADMIN ACCESS
          </p>
          <h1 className="mt-1 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
            طلبات صلاحية الأدمن
          </h1>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border-2 border-[#4a4a4a] bg-[#737373] px-4 py-2 font-bold text-white transition hover:bg-[#5e5e5e]"
        >
          الرجوع للإعلانات
        </button>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}
      {isLoading ? (
        <p role="status" className="rounded-xl bg-white p-5 text-sm font-bold">
          جاري تحميل الطلبات...
        </p>
      ) : requests.length === 0 ? (
        <p className="rounded-xl bg-white p-5 text-sm font-bold text-[#555]">
          لا توجد طلبات معلقة.
        </p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const requestId = request._id || request.id;
            const requester = request.requestedBy;

            return (
              <article
                key={requestId}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#737373]/30 bg-white p-4"
              >
                <div>
                  <h2 className="font-black">{requester?.name || "مستخدم"}</h2>
                  <p className="mt-1 text-sm text-[#555]">
                    {requester?.email || "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyRequestId === requestId}
                    onClick={() => handleReview(request, "approved")}
                    className="rounded-xl bg-green-700 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                  >
                    قبول
                  </button>
                  <button
                    type="button"
                    disabled={busyRequestId === requestId}
                    onClick={() => handleReview(request, "rejected")}
                    className="rounded-xl bg-red-700 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                  >
                    رفض
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
