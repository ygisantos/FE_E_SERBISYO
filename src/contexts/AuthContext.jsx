import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
      const userData = localStorage.getItem("userData");
      setUser(userData ? JSON.parse(userData) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
     let userRole = "";
    if (userData?.type) {
      userRole = userData.type === 'residence' ? 'Resident' : userData.type.charAt(0).toUpperCase() + userData.type.slice(1);
    }
    localStorage.setItem("userRole", userRole);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    console.log('[DEBUG] AuthContext.logout called');
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    setToken(null);
    setUser(null);
    console.log('[DEBUG] After AuthContext.logout', {
      token: localStorage.getItem('token'),
      userData: localStorage.getItem('userData'),
      userRole: localStorage.getItem('userRole'),
    });
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
