import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../API/passwordRecovery.js";

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!token) {
      setErrorMessage("رابط الاستعادة غير مكتمل. اطلب رابطًا جديدًا.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
    } catch (error) {
      setErrorMessage(
        error.message || "تعذر تغيير كلمة المرور. اطلب رابط استعادة جديدًا.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#153443] p-4"
    >
      <section className="w-full max-w-lg rounded-3xl bg-[#f6ebd2] p-6 shadow-2xl sm:p-10">
        <h1 className="text-2xl font-black text-[#1a1f2c]">
          تعيين كلمة مرور جديدة
        </h1>
        <p className="mt-2 text-sm text-[#1a1f2c]/70">
          اختار كلمة مرور جديدة لا تقل عن 8 أحرف.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-[#1a1f2c]">
            كلمة المرور الجديدة
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#1a1f2c]/20 bg-white px-4 py-3 focus:border-[#E4572E] focus:outline-none"
            />
          </label>

          <label className="block text-sm font-bold text-[#1a1f2c]">
            تأكيد كلمة المرور
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#1a1f2c]/20 bg-white px-4 py-3 focus:border-[#E4572E] focus:outline-none"
            />
          </label>

          {!message && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#E4572E] px-4 py-3 font-black text-white hover:bg-[#c9451e] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ كلمة المرور"}
            </button>
          )}
          {message && (
            <p role="status" className="text-sm font-bold text-green-700">
              {message}
            </p>
          )}
          {errorMessage && (
            <p role="alert" className="text-sm font-bold text-red-700">
              {errorMessage}
            </p>
          )}
          {message && (
            <Link
              to="/signIn"
              className="block text-center font-bold text-[#E4572E] underline"
            >
              تسجيل الدخول
            </Link>
          )}
        </form>
      </section>
    </main>
  );
}
