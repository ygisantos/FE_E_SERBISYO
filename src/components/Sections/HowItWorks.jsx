import React from "react";
import { FiTool } from "react-icons/fi";

const HowItWorksSection = () => (
  <section className="w-full py-10 sm:py-16 bg-[var(--color-bg)] backdrop-blur-md border-t border-[var(--color-accent)] flex flex-col items-center px-2 sm:px-4">
    <div className="w-16 h-1.5 bg-[var(--color-secondary)] rounded-full mb-6 sm:mb-8" />
    <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-neutral-900 mb-6 sm:mb-8"><FiTool className="text-[var(--color-secondary)] text-2xl" /> How It Works</h2>
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 max-w-4xl w-full justify-center">
      <div className="flex-1 flex flex-col items-center text-center">
        <div className="bg-[var(--color-accent)] text-[var(--color-secondary)] rounded-full w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mb-2 sm:mb-3 text-xl sm:text-2xl font-bold border border-[var(--color-secondary)]">1</div>
        <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2">Request</h3>
        <p className="text-neutral-800 text-xs sm:text-sm">Residents log in, view available documents, and submit a request online.</p>
      </div>
      <div className="flex-1 flex flex-col items-center text-center">
        <div className="bg-[var(--color-accent)] text-[var(--color-secondary)] rounded-full w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mb-2 sm:mb-3 text-xl sm:text-2xl font-bold border border-[var(--color-secondary)]">2</div>
        <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2">Process</h3>
        <p className="text-neutral-800 text-xs sm:text-sm">Barangay staff search for requests, then release or reject them at the barangay hall.</p>
      </div>
      <div className="flex-1 flex flex-col items-center text-center">
        <div className="bg-[var(--color-accent)] text-[var(--color-secondary)] rounded-full w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mb-2 sm:mb-3 text-xl sm:text-2xl font-bold border border-[var(--color-secondary)]">3</div>
        <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2">Claim & Log</h3>
        <p className="text-neutral-800 text-xs sm:text-sm">Residents claim documents at the hall. All actions are logged for transparency and tracking.</p>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
