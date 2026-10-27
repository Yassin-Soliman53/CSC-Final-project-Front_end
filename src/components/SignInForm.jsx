import { useState } from "react";
import signIn from "../API/signIn";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function SignInForm({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn({
        data,
      });
      setUser(response.user);
      navigate("/homepage");
    } catch (error) {
      console.error(error);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm rounded-xl border border-[#1a1f2c]/20 focus:border-[#E4572E] focus:ring-[#E4572E]/20 bg-white text-[#1a1f2c] focus:outline-none focus:ring-2 shadow-sm";

  return (
    <div className="w-full max-w-md text-center">
      <div className="inline-block px-3.5 py-1 bg-[#E4572E]/15 text-[#E4572E] text-xs font-black rounded-md mb-2">
        دليفري
      </div>

      <h1 className="text-3xl font-black text-[#1a1f2c] mb-2">
        يلا خش شغل الشغل في الدليفري
      </h1>

      <p className="text-xs text-[#1a1f2c]/70 mb-6 font-semibold">
        عايزك سريع بس و ايدك خفيفه و انت بتهرب
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3.5 text-right"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="signin-email"
            className="text-xs font-bold text-[#1a1f2c] block mb-1"
          >
            ميلك يحج
          </label>

          <input
            id="signin-email"
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="حط إيميلك"
            autoComplete="username"
            required
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="signin-password"
            className="text-xs font-bold text-[#1a1f2c] block mb-1"
          >
            باسوردك علشان منزعلش
          </label>

          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="باسوردك معلش"
              autoComplete="current-password"
              required
              className={`${inputClass} pl-10`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E4572E] transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full py-3.5 bg-[#E4572E] hover:bg-[#c9451e] text-white font-black rounded-xl shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          خش من هنا
        </button>
      </form>

      <button
        type="button"
        onClick={onSwitch}
        className="mt-6 text-xs text-[#1a1f2c]/80 hover:text-[#E4572E] transition-colors cursor-pointer"
      >
        <span className="font-black text-[#E4572E] underline">
          فلاح و معنديش اكونت || خش اعمل من هنا
        </span>
      </button>
    </div>
  );
}
