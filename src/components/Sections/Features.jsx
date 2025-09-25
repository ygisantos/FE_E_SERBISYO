import React from "react";
import { FiStar, FiZap, FiLock, FiGlobe } from "react-icons/fi";

const FeaturesSection = () => (
  <section className="w-full py-10 sm:py-16 bg-[var(--color-bg)] backdrop-blur-md border-t border-[var(--color-accent)] flex flex-col items-center px-2 sm:px-4">
    <div className="w-16 h-1.5 bg-[var(--color-secondary)] rounded-full mb-6 sm:mb-8" />
    <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-neutral-900 mb-6 sm:mb-8"><FiStar className="text-[var(--color-secondary)] text-2xl" /> Key Features</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl w-full">
      <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-[var(--color-white)] rounded-2xl shadow border border-[var(--color-secondary)]">
        <FiZap className="text-[var(--color-secondary)] text-3xl mb-2 sm:mb-3" />
        <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2">Online Document Requests</h3>
        <p className="text-neutral-800 text-xs sm:text-sm">Residents can easily request barangay documents online and track their status in real time.</p>
      </div>
      <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-[var(--color-white)] rounded-2xl shadow border border-[var(--color-secondary)]">
        <FiLock className="text-[var(--color-secondary)] text-3xl mb-2 sm:mb-3" />
        <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2">Staff Review & Release</h3>
        <p className="text-neutral-800 text-xs sm:text-sm">Barangay staff can search, review, release, or reject requests efficiently at the barangay hall.</p>
      </div>
      <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-[var(--color-white)] rounded-2xl shadow border border-[var(--color-secondary)]">
        <FiGlobe className="text-[var(--color-secondary)] text-3xl mb-2 sm:mb-3" />
        <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2">Transparent Certificate Log</h3>
        <p className="text-neutral-800 text-xs sm:text-sm">All actions are logged for transparency, showing the status and history of every request.</p>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
