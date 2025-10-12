import React from "react";

const Button = ({
  type = "button",
  loading = false,
  disabled = false,
  children,
  className = "",
  loadingText = "Please wait...",
  ...props
}) => ( 
  <button
    type={type}
    className={`px-2 py-3 cursor-pointer bg-[var(--color-secondary)] text-[var(--color-white)] rounded-xl font-bold shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition text-lg focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)] mt-2 ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? loadingText : children}
  </button>
);

export default Button;
