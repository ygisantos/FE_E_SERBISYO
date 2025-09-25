import React, { useEffect, useState } from "react";
import HeroCarousel from "../HeroCarousel";

const AnnouncementsSection = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString();

  return (
    <section id="announcements" className="w-full flex flex-col items-center justify-center py-10 sm:py-16 px-3 sm:px-4 bg-white">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-secondary)] mb-2 tracking-tight">Barangay Announcements</h2>
        <div className="mb-2 text-base sm:text-lg text-gray-700 font-bold tracking-wide">{dateStr} &middot; {timeStr}</div>
        <p className="text-sm sm:text-base text-gray-700 mb-6 text-center max-w-2xl">Stay updated with the latest news, events, and important information from Barangay Santol. Check back regularly for new announcements.</p>
        <div className="w-full max-w-2xl">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
