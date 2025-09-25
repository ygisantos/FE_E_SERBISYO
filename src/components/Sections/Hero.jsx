import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import barangayBg from "../../assets/background/santol_hall.jpg";
import santolLogo from '../../assets/logo/santol_logo.png';

const HeroSection = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-2 sm:px-8 bg-[var(--color-bg)] overflow-hidden relative z-10"
      style={{
        backgroundImage: `url(${barangayBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover', 
      }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />

       <div aria-hidden="true" className="absolute -top-24 -left-32 w-[160px] xs:w-[220px] sm:w-[420px] h-[160px] xs:h-[220px] sm:h-[420px] bg-[var(--color-accent)] opacity-30 rounded-full blur-2xl z-0" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-28 xs:w-40 sm:w-80 h-28 xs:h-40 sm:h-80 bg-[var(--color-secondary)] opacity-10 rounded-full blur-2xl z-0" />
      <div className="w-full max-w-md xs:max-w-lg sm:max-w-3xl md:max-w-5xl mx-auto flex flex-col items-center justify-center gap-6 sm:gap-12 mb-4 sm:mb-10 relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center w-full text-center">
           {/* Logo and Title Section */}
           <div className="flex flex-col items-center w-full relative z-20 mt-10 sm:mt-12">
             <div className="flex items-center justify-center w-full">
               <img 
                 src={santolLogo} 
                 alt="Barangay Santol Logo" 
                 className="h-16 w-16 xs:h-20 xs:w-20 sm:h-24 sm:w-24 rounded-full object-cover bg-white/80 border border-white shadow mb-3 animate-fade-in-down" 
                 style={{ maxWidth: '100%', height: 'auto', marginTop: 0 }}
               />
             </div>
           </div>
          <span className="inline-block mb-2 px-4 py-1 rounded-full bg-[var(--color-secondary)] text-white font-semibold text-sm sm:text-base tracking-widest shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Barangay Santol</span>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 tracking-tight leading-tight w-full drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            E-Serbisyo
          </h1>
          <span className="block w-12 sm:w-16 h-2 bg-[var(--color-secondary)] rounded-full mt-2 mb-4 mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }} />
          <p className="text-base xs:text-lg sm:text-xl text-[var(--color-accent)] font-semibold mb-2 w-full tracking-wide animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Barangay Digital Services Platform</p>
          <p className="text-sm xs:text-base sm:text-lg text-white mb-4 font-medium max-w-xs xs:max-w-md sm:max-w-xl w-full animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Welcome to E-Serbisyo, your all-in-one digital platform for fast, secure, and transparent barangay services. Easily request documents, track your applications, and experience a more efficient local government process anytime, anywhere.
          </p>
          <p className="text-sm sm:text-base text-slate-200 mb-6 max-w-xs sm:max-w-lg w-full italic animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            Designed for residents and staff of Barangay Santol, Balagtas, Bulacan.
          </p>
        </div>
        
      </div>
      
    </section>
    
  );
};

export default HeroSection;
