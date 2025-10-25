import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/santol_logo.png";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <img src={logo} alt="Logo" className="w-20 h-20 mb-6" />
    <h1 className="text-4xl font-bold text-red-900 mb-2">404</h1>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
    <p className="text-gray-600 mb-6 text-center">
      Sorry, the page you are looking for does not exist or has been moved.
    </p>
    <Link
      to="/"
      className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition"
    >
      Go to Home
    </Link>
  </div>
);

export default NotFound;
