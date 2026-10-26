import { useState } from "react";
import profileImg from "../assets/images/main.png";
import SignInForm from "../components/signInForm.jsx";
import SignUpForm from "../components/SignUpForm.jsx";
export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      className="min-h-screen w-full bg-[#153443] flex items-center justify-center p-4 md:p-8 overflow-hidden select-none"
      dir="rtl"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        .font-cairo { font-family: 'Cairo', sans-serif; }
      `}</style>

      <div className="relative w-full max-w-5xl h-[670px] bg-[#f6ebd2] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.55)] overflow-hidden font-cairo flex">
        {/* Sign-in panel */}
        <div
          className={`absolute top-0 right-0 w-full lg:w-[60%] h-full flex flex-col justify-center items-center p-8 md:p-14 z-10 transition-all duration-700 ease-in-out ${
            isSignUp
              ? "opacity-0 pointer-events-none translate-x-16"
              : "opacity-100 pointer-events-auto translate-x-0"
          }`}
        >
          <SignInForm onSwitch={() => setIsSignUp(true)} />
        </div>

        {/* Sign-up panel */}
        <div
          className={`absolute top-0 left-0 w-full lg:w-[60%] h-full flex flex-col justify-center items-center p-8 md:p-14 z-10 transition-all duration-700 ease-in-out ${
            isSignUp
              ? "opacity-100 pointer-events-auto translate-x-0"
              : "opacity-0 pointer-events-none -translate-x-16"
          }`}
        >
          <SignUpForm onSwitch={() => setIsSignUp(false)} />
        </div>

        {/* Animated image panel */}
        <div
          className={`hidden lg:flex absolute top-0 left-0 w-[40%] h-full items-center justify-center p-8 z-20 shadow-2xl transition-all duration-700 ease-in-out ${
            isSignUp ? "bg-[#E4572E]" : "bg-[#153443]"
          }`}
          style={{
            transform: isSignUp ? "translateX(150%)" : "translateX(0%)",
          }}
        >
          <div className="relative p-3 rounded-full bg-white/15 shadow-2xl border-2 border-[#f6ebd2]/50 transition-transform duration-500 hover:scale-105">
            <div className="w-56 h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden border-4 border-[#f6ebd2] shadow-inner">
              <img
                src={profileImg}
                alt="Smugglers"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
