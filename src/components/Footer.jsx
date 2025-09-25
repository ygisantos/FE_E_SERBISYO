import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import logo from '../assets/logo/santol_logo.png';

const Footer = () => (
  <footer className="w-full bg-[var(--color-primary)] text-white py-10 px-4 flex flex-col items-center justify-center mt-auto max-w-full overflow-x-visible border-t border-[var(--color-primary)]">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl mb-6 text-left text-xs sm:text-sm">
      {/* Brand */}
      <div className="flex flex-col items-center sm:items-start gap-2">
        <img src={logo} alt="Barangay Santol Logo" className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover bg-white/80 border border-white shadow mb-1" />
        <span className="font-extrabold text-xl sm:text-2xl text-white tracking-wide">E-Serbisyo</span>
        <span className="flex items-center gap-2 text-xs sm:text-sm text-white"><FiMapPin className="inline-block" /> Barangay Santol, Balagtas, Bulacan</span>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-xs sm:text-sm font-medium items-center sm:items-start">
        <Link to="/" className="hover:underline hover:text-white transition text-white">Home</Link>
        <Link to="/register" className="hover:underline hover:text-white transition text-white">Register</Link>
        <Link to="/login" className="hover:underline hover:text-white transition text-white">Login</Link>
      </nav>
      {/* Social & Contact */}
      <div className="flex flex-col gap-2 items-center sm:items-start">
        <a href="https://www.facebook.com/BarangaySantolOfficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline hover:text-white transition text-white text-xs sm:text-sm"><FiFacebook /> Facebook</a>
        <a href="mailto:barangaysantol@gmail.com" className="flex items-center gap-2 hover:underline hover:text-white transition text-white text-xs sm:text-sm"><FiMail /> Email</a>
        <span className="flex items-center gap-2 text-xs sm:text-sm text-white"><FiPhone /> 0912-345-6789</span>
      </div>
      {/* Empty for grid alignment */}
      <div className="flex flex-col items-center sm:items-end justify-end gap-2"></div>
    </div>
    <div className="w-full h-1 bg-[var(--color-primary)] opacity-20 rounded-full mb-2" />
    <div className="text-xs sm:text-sm text-center text-white">&copy; 2025 Barangay Management System. All rights reserved.</div>
  </footer>
);

export default Footer;
