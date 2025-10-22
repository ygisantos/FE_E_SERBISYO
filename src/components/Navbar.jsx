import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import configService from "../utils/configService";
import ConfirmationModal from "./modals/ConfirmationModal";
import logo from "../assets/logo/santol_logo.png";

const Navbar = ({
  navOpen, // eslint-disable-line no-unused-vars
  setNavOpen,
  logo: propLogo,
  title,
  showSidebar = false,
  isMobile = false,
  showProfileDropdown = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const isLandingPage = location.pathname === "/";
  const [appName, setAppName] = useState(title || "Barangay Santoleño");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  // Get user data
  const userData = auth?.user || JSON.parse(localStorage.getItem("userData") || "{}");
  const userName = userData?.full_name || userData?.fullname || 
    (userData?.first_name && userData?.last_name ? 
      `${userData.first_name} ${userData.last_name}` : 
      userData?.name || userData?.username || "User");
  const userRole = userData?.type || "resident";
  const userAvatar = userData?.profilePicture || logo;

  useEffect(() => {
    // Get app name from configuration
    const getAppName = () => {
      const configuredName = configService.getConfigValue('app_header');
      setAppName(configuredName);
    };

    // Initial load
    getAppName();

    // Set up interval to check for config updates
    const interval = setInterval(() => {
      if (configService.isCacheExpired()) {
        // Cache is expired, configs will be refreshed on next API call
        getAppName();
      }
    }, 30000); // Check every 30 seconds

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [title]);

  const handleLogout = async () => {
    try {
      if (auth?.logout) {
        auth.logout();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      navigate('/login');
    }
    setIsDropdownOpen(false);
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    let profilePath = "/profile";
    
    // Navigate to role-specific profile page
    switch (userRole) {
      case "admin":
        profilePath = "/admin/profile";
        break;
      case "staff":
      case "worker":
        profilePath = "/worker/profile";
        break;
      case "residence":
      case "resident":
        profilePath = "/resident/profile";
        break;
      default:
        profilePath = "/profile";
    }
    
    navigate(profilePath);
    setIsDropdownOpen(false);
  };

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
    <>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
      
      <nav className="w-full fixed top-0 left-0 z-30 bg-red-800 border-b border-red-900 shadow-sm flex items-center justify-between px-4 sm:px-12 py-4">
      <Link
        to="/"
        onClick={handleLogoClick}
        className="flex items-center gap-3 min-w-0"
      >
        {propLogo && (
          <img src={propLogo} alt="Logo" className="h-10 w-10 rounded-full object-cover bg-white/80 border border-white shadow" />
        )}
        <span className="text-sm font-bold text-white tracking-tight uppercase hidden sm:inline sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl transition-all duration-200">
          {appName}
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Profile Dropdown - only show when user is authenticated and showProfileDropdown is true */}
        {showProfileDropdown && userData && Object.keys(userData).length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <img
                src={userAvatar}
                alt={userName}
                className="h-8 w-8 rounded-full object-cover bg-white border border-white shadow"
              />
              <span className="hidden sm:inline text-sm font-medium truncate max-w-32">
                {userName}
              </span>
              <FiChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRole === 'residence' ? 'Resident' : userRole}
                  </p>
                </div>
                
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <FiUser className="w-4 h-4" />
                  My Profile
                </button>
                
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Only show hamburger on mobile when sidebar is available */}
        {showSidebar && isMobile && (
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
            onClick={() => setNavOpen((open) => !open)}
          >
            <FiMenu className="text-xl text-white" />
          </button>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;