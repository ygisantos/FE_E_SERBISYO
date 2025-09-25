import React from "react";

const LoadingSpinner = () => (
  <div className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-xs flex items-center justify-center z-[9999]">
    <svg
      className="animate-spin h-16 w-16 block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="#ffffff"
        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
      />
    </svg>
  </div>
);

export default LoadingSpinner;
