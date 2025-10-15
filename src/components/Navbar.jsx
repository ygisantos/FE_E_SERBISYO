import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const Navbar = ({
  navOpen,
  setNavOpen,
  logo,
  title = "Barangay Santoleño",
  showSidebar = false,
  isMobile = false,
}) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const handleLogoClick = (e) => {
    if (isLandingPage) {
      e.preventDefault();
      // First scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Then refresh after scroll completes
      setTimeout(() => {
        window.location.reload();
      }, 500); // Wait for scroll to complete
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-30 bg-red-800 border-b border-red-900 shadow-sm flex items-center justify-between px-4 sm:px-12 py-4">
      <Link
        to="/"
        onClick={handleLogoClick}
        className="flex items-center gap-3 min-w-0"
      >
        {logo && (
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full object-cover bg-white/80 border border-white shadow" />
        )}
        <span className="text-sm font-bold text-white tracking-tight uppercase hidden sm:inline sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl transition-all duration-200">
          {title}
        </span>
      </Link>

      {/* Only show hamburger on mobile when sidebar is available */}
      {showSidebar && isMobile && (
        <button
          className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
          onClick={() => setNavOpen((open) => !open)}
        >
          <FiMenu className="text-xl text-white" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;