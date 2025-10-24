import React, { useState, createContext, useEffect } from "react";
import { logout } from "../../api/logoutApi";
import { showCustomToast } from "../Toast/CustomToast";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import UserSidebar from "../Sidebar";
import logo from "../../assets/logo/santol_logo.png";
import { LoadingProvider, useLoading } from "../LoadingContext";
import LoadingSpinner from "../Loading";
import CustomToastContainer from "../Toast/CustomToast";
import ConfirmationModal from "../modals/ConfirmationModal";

// UserContext to provide user role throughout the app
export const UserContext = createContext({ role: null });

// Example: Replace this with your real authentication logic
const getUserRole = () => {
  // TODO: Replace with real logic (e.g., from auth provider, JWT, etc.)
  // For demo, fallback to localStorage or default to 'resident'
  return localStorage.getItem("userRole") || "admin";
};

const shouldShowSidebar = (pathname) => {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/resident") ||
    pathname.startsWith("/worker")
  );
};

const Layout = ({ children, title = "Barangay Santoleño", links = [], logoImg = logo }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Centralized logout logic
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    setLogoutLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      const res = await logout(userData.email || "", userData.password || "");
      showCustomToast(res.message || "Logout successful", "success");
      setTimeout(() => {
        setLogoutLoading(false);
        window.location.href = "/login";
      }, 2500);
    } catch (err) {
      setLogoutLoading(false);
      showCustomToast(err?.toString() || "Logout failed", "error");
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const role = getUserRole();
  const showSidebar = shouldShowSidebar(location.pathname);
  const { loading } = useLoading();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when route changes
      if (mobile) {
        setSidebarOpen(false);
        setSidebarCollapsed(false); // Always expanded on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Expose setLoading globally for axios
  useEffect(() => {
    window.setGlobalLoading = (val) => {
      // Use setTimeout to avoid React state update on unmounted component
      setTimeout(() => {
        if (val) loadingContext.show();
        else loadingContext.hide();
      }, 0);
    };
    return () => {
      window.setGlobalLoading = undefined;
    };
  }, []);

   useEffect(() => {
    if (isMobile && sidebarOpen) {
      // Prevent scrolling on both body and main content
      document.body.classList.add('overflow-hidden');
      document.documentElement.classList.add('overflow-hidden');
    } else {
      // Re-enable scrolling
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    }

    return () => {
      // Cleanup
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [isMobile, sidebarOpen]);

  return (
    <UserContext.Provider value={{ role }}>
      <LoadingProvider>
        <CustomToastContainer />
        <ConfirmationModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          type="warning"
        />
        
        <div className={`min-h-screen flex flex-col bg-white ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}`}>
          <Navbar
            logo={logoImg}
            title={title}
            navOpen={sidebarOpen}
            setNavOpen={setSidebarOpen}
            showSidebar={showSidebar} // Pass showSidebar prop
            isMobile={isMobile} // Pass isMobile prop
            showProfileDropdown={showSidebar} // Show profile dropdown when sidebar is shown (authenticated pages)
          />

          <div className={`flex flex-grow pt-12 relative ${isMobile && sidebarOpen ? 'overflow-hidden fixed inset-0' : ''}`}>
            {/* Sidebar */}
            {showSidebar && (
              <>
                {/* Sidebar Container */}
                <div
                  className={`
                  ${
                    isMobile
                      ? `fixed top-12 left-0 h-[calc(100vh-3rem)] z-50 transform transition-transform duration-300 ease-in-out ${
                          sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`
                      : "sticky top-12 h-[calc(100vh-3rem)] z-20"
                  }
                `}
                >
                  <UserSidebar
                    role={role}
                    isMobile={isMobile}
                    isOpen={sidebarOpen}
                    isCollapsed={isMobile ? false : sidebarCollapsed}
                    onClose={() => setSidebarOpen(false)}
                    onLogout={handleLogout}
                    setIsCollapsed={setSidebarCollapsed}
                  />
                </div>
              </>
            )}

            {/* Blur overlay only on mobile, only over main content */}
            {isMobile && sidebarOpen && (
              <div
                className="fixed top-12 left-0 w-full h-[calc(100vh-3rem)] z-40 backdrop-blur-xs backdrop-brightness-70 bg-white/40 transition-all duration-200"
                style={{ pointerEvents: "auto" }}
              />
            )}

            {/* Main Content */}
            <main className={`
              flex-grow transition-all duration-300
              ${showSidebar && !isMobile ? 'ml-0' : ''}
              ${isMobile ? 'w-full' : ''}
              ${isMobile && sidebarOpen ? 'overflow-hidden' : 'overflow-auto'}
            `}>
              <div
                className="p-4 sm:p-6"
                style={{
                  minHeight: "calc(100vh - 3rem)",
                  position: "relative",
                }}
              >
                {/* Loading overlay only covers main content */}
                {(loading || logoutLoading) && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
                    <LoadingSpinner className="h-12 w-12" />
                  </div>
                )}
                {/* Only this section updates on route change */}
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </LoadingProvider>
    </UserContext.Provider>
  );
};

export default Layout;
