import { useState } from "react";
import { requestPasswordReset } from "../API/passwordRecovery.js";

export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
    } catch (error) {
      setErrorMessage(
        error.status === 503
          ? "خدمة البريد غير مفعّلة حاليًا. تواصل مع مسؤول التطبيق."
          : error.message || "تعذر إرسال رابط الاستعادة. حاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-2 inline-block rounded-md bg-[#E4572E]/15 px-3.5 py-1 text-xs font-black text-[#E4572E]">
        استعادة الحساب
      </div>
      <h1 className="mb-2 text-3xl font-black text-[#1a1f2c]">
        نسيت كلمة المرور؟
      </h1>
      <p className="mb-6 text-sm font-semibold text-[#1a1f2c]/70">
        اكتب بريدك المسجل، وهنبعتلك رابط آمن لتغيير كلمة المرور.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-right">
        <label
          htmlFor="forgot-password-email"
          className="text-xs font-bold text-[#1a1f2c]"
        >
          البريد الإلكتروني
          <input
            id="forgot-password-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#1a1f2c]/20 bg-white px-4 py-3 text-sm text-[#1a1f2c] shadow-sm focus:border-[#E4572E] focus:outline-none focus:ring-2 focus:ring-[#E4572E]/20"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-[#E4572E] py-3.5 font-black text-white shadow-lg transition hover:bg-[#c9451e] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
        </button>
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
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-5 text-xs font-black text-[#E4572E] underline"
      >
        الرجوع لتسجيل الدخول
      </button>
    </div>
  );
}
