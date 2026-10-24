import React, { useState } from 'react';
import profileImg from '../../assets/images/main.png';

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#153443] flex items-center justify-center p-4 md:p-8 overflow-hidden select-none" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        .font-cairo { font-family: 'Cairo', sans-serif; }
      `}</style>

      <div className="relative w-full max-w-5xl h-[670px] bg-[#f6ebd2] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.55)] overflow-hidden font-cairo flex">
        
        <div 
          className={`absolute top-0 right-0 w-full lg:w-[60%] h-full flex flex-col justify-center items-center p-8 md:p-14 z-10 transition-all duration-700 ease-in-out ${
            isSignUp 
              ? 'opacity-0 pointer-events-none translate-x-16' 
              : 'opacity-100 pointer-events-auto translate-x-0'
          }`}
        >
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

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3.5 text-right">
              <div>
                <label className="text-xs font-bold text-[#1a1f2c] block mb-1">ميلك يحج</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="حط إيميلك " 
                  autoComplete="username"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#E4572E] focus:ring-2 focus:ring-[#E4572E]/20 shadow-sm"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1a1f2c] block mb-1">باسوردك علشان منزعلش</label>
                <div className="relative">
                  <input 
                    type={showSignInPassword ? "text" : "password"} 
                    name="password"
                    placeholder="باسوردك معلش " 
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pl-10 text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#E4572E] focus:ring-2 focus:ring-[#E4572E]/20 shadow-sm"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E4572E] transition-colors cursor-pointer"
                  >
                    {showSignInPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="mt-2 w-full py-3.5 bg-[#E4572E] hover:bg-[#c9451e] text-white font-black rounded-xl shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                خش من هنا 
              </button>
            </form>

            <button 
              type="button"
              onClick={() => setIsSignUp(true)}
              className="mt-6 text-xs text-[#1a1f2c]/80 hover:text-[#E4572E] transition-colors cursor-pointer"
            >
              <span className="font-black text-[#E4572E] underline">فلاح و معنديش اكونت || خش اعمل من هنا</span>
            </button>
          </div>
        </div>

        <div 
          className={`absolute top-0 left-0 w-full lg:w-[60%] h-full flex flex-col justify-center items-center p-8 md:p-14 z-10 transition-all duration-700 ease-in-out ${
            isSignUp 
              ? 'opacity-100 pointer-events-auto translate-x-0' 
              : 'opacity-0 pointer-events-none -translate-x-16'
          }`}
        >
          <div className="w-full max-w-md text-center overflow-y-auto">
            <div className="inline-block px-3.5 py-1 bg-[#153443]/15 text-[#153443] text-xs font-black rounded-md mb-2">
              فرد جديد
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1a1f2c] mb-1">
              املي الداتا وحلال عليك الاكونت
            </h1>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5 text-right">
              <div>
                <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">اسم البيه</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="اسمك يا بيه" 
                  autoComplete="name"
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">الإيميل البيه </label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="متبقاش فلاح بقا وتسال" 
                  autoComplete="email"
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">الباسورد</label>
                <div className="relative">
                  <input 
                    type={showSignUpPassword ? "text" : "password"} 
                    name="password"
                    placeholder="باسورد معقد محدش يخترقه" 
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2 pl-10 text-xs md:text-sm rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#153443] transition-colors cursor-pointer"
                  >
                    {showSignUpPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">رقم اوضتك </label>
                  <input 
                    type="number" 
                    name="room"
                    placeholder="رقم أو ضتك " 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#1a1f2c]/20 bg-white text-[#1a1f2c] focus:outline-none focus:border-[#153443] shadow-sm"
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1a1f2c] block mb-0.5">رقم الواتس ياريت ننجز</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="رقم عليه واتس " 
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
              onClick={() => setIsSignUp(false)}
              className="mt-3 text-xs text-[#1a1f2c]/80 hover:text-[#153443] transition-colors cursor-pointer"
            >
              <span className="font-black text-[#153443] underline"> معاك اكونت ولافف حوالين نفسك</span>
            </button>
          </div>
        </div>

        <div 
          className={`hidden lg:flex absolute top-0 left-0 w-[40%] h-full items-center justify-center p-8 z-20 shadow-2xl transition-all duration-700 ease-in-out ${
            isSignUp 
              ? 'bg-[#E4572E]' 
              : 'bg-[#153443]' 
          }`}
          style={{
            transform: isSignUp ? 'translateX(150%)' : 'translateX(0%)'
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