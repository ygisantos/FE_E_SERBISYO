import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const Navbar = ({
  navOpen,
  setNavOpen,
  links = [
    { to: "/", label: "Home" },
    { to: "/register", label: "Register" },
    { to: "/login", label: "Login" },
  ],
  logo,
  title = "Barangay Santoleño",
}) => {
  const location = useLocation();
  return (
    <nav className="w-full fixed top-0 left-0 z-30 bg-[var(--color-primary)] border-b border-[var(--color-secondary)] shadow-sm flex items-center justify-between px-4 sm:px-12 py-4">
      <div className="flex items-center gap-3 min-w-0">
        {logo && (
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full object-cover bg-white/80 border border-white shadow" />
        )}
        <span className="text-sm font-bold text-white tracking-tight uppercase hidden sm:inline sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl transition-all duration-200">{title}</span>
      </div>
      {/* Desktop Nav */}
      <div className="hidden md:flex gap-4 sm:gap-8">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-white font-medium transition text-xs sm:text-sm relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[var(--color-accent)] after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200${location.pathname === link.to ? ' after:scale-x-100' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* Mobile Nav */}
      <button
        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        onClick={() => setNavOpen((open) => !open)}
      >
        <FiMenu className="text-xl text-white" />
      </button>
      {navOpen && (
        <div className="absolute top-full right-4 mt-2 w-44 bg-[var(--color-white)] rounded-xl shadow-lg border border-[var(--color-accent)] flex flex-col z-40 animate-fade-in">
          {links.map((link, idx) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-6 py-3 text-neutral-950 font-medium hover:text-[var(--color-secondary)] transition text-sm${idx !== links.length - 1 ? ' border-b border-[var(--color-accent)]' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;