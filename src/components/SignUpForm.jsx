import { useState } from "react";
import signUp from "../API/signUp";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
export default function SignUpForm({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);

  const [data, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roomNumber: "",
    phone: "",
  });
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signUp({
        data,
      });
      setUser(response.user);
      navigate("/homepage");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-md text-center overflow-y-auto">
      <div className="inline-block px-3.5 py-1 bg-[#153443]/15 text-[#153443] text-xs font-black rounded-md mb-2">
        فرد جديد
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-[#1a1f2c] mb-1">
        املي الداتا وحلال عليك الاكونت
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5 text-right"
      >
        <div>
          <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">
            اسم البيه
          </label>

          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="اسمك يا بيه"
            autoComplete="name"
            className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">
            الإيميل البيه
          </label>

          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="متبقاش فلاح بقا وتسال"
            autoComplete="email"
            className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">
            الباسورد
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="باسورد معقد محدش يخترقه"
              autoComplete="new-password"
              className="w-full px-3.5 py-2 pl-10 text-xs md:text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#153443] transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg
                  className="w-4 h-4"
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
                  className="w-4 h-4"
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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">
              رقم اوضتك
            </label>

            <input
              type="number"
              name="roomNumber"
              value={data.roomNumber}
              onChange={handleChange}
              placeholder="رقم أو ضتك"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">
              رقم الواتس ياريت ننجز
            </label>

            <input
              type="number"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="رقم عليه واتس"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3 bg-[#153443] hover:bg-[#0c222c] text-white font-black rounded-xl shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          يلا بينا !!
        </button>
      </form>

      <button
        type="button"
        onClick={onSwitch}
        className="mt-3 text-xs text-[#1a1f2c]/80 hover:text-[#153443] transition-colors cursor-pointer"
      >
        <span className="font-black text-[#153443] underline">
          معاك اكونت ولافف حوالين نفسك
        </span>
      </button>
    </div>
  );
}
