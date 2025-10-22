import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import FormInput from "../components/inputfield/FormInput";
import Button from "../components/reusable/Button";
import santolBg from "../assets/background/santol_hall.jpg";
import logo from "../assets/logo/santol_logo.png";
import CustomToastContainer, {
  showCustomToast,
} from "../components/Toast/CustomToast";
import { login } from "../api/loginApi";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import TermsModal from '../components/modals/TermsModal';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [navOpen, setNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));
    
    if (token && userData) {
      setLoading(true);
      const role = userData.type || "resident";

      if (!role) {
        navigate("/login");
        setLoading(false);
        return;
      }

      setTimeout(() => {
        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "staff":
            navigate("/worker/dashboard");
            break;
          case "resident":
            navigate("/resident/chatbot");
            break;
          default:
            navigate("/login");
        }
        setLoading(false);
      }, 700);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      showCustomToast("Please accept the Terms & Conditions to login", "error");
      setShowTermsModal(true);
      return;
    }
    if (!form.email || !form.password) {
      showCustomToast("Please enter both email and password.", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      
      if (data && data.account) {
        if (data.account.status === 'pending') {
          showCustomToast("You are not allowed to login. Your account status is pending.", "warning");
          setLoading(false);
          return;
        }

        if (data.account.status === 'inactive' || data.account.status === 'rejected') {
          showCustomToast("Your account is not active. Please contact the administrator.", "error");
          setLoading(false);
          return;
        }

        if (data.token) {
          authLogin(data.token, data.account);
          showCustomToast("Login successful!", "success");
          
          setTimeout(() => {
            const role = data.account.type || "resident";
            if (role === "admin") {
              navigate("/admin/dashboard");
            }
            else if (role === "staff") {
              navigate("/worker/dashboard");
            }
            else {
              // For residents, navigate and force reload
              window.location.href = "/resident/dashboard";
            }
          }, 2000);
        }
      }
    } catch (err) {
      showCustomToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300"
      style={{
        backgroundImage: `linear-gradient(rgba(30,30,30,0.5),rgba(30,30,30,0.5)), url(${santolBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar navOpen={navOpen} setNavOpen={setNavOpen} logo={logo} />
      <CustomToastContainer />
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-10 w-full px-2 sm:px-0">
        <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 flex flex-col items-center border border-[var(--color-accent)]">
          <span className="text-[var(--color-primary)] mb-6 font-bold text-2xl tracking-wide">
            Login
          </span>
          
          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
            <FormInput
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email address"
              label="Email Address"
            />
            
            <div className="relative">
              <FormInput
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                label="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-red-900 hover:underline font-medium"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>

            {/* Login Button */}
            <Button type="submit" loading={loading} loadingText="Logging in...">
              Login
            </Button>

            {/* Divider */}
            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Create Account Link */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-2.5 text-sm font-medium text-red-900 hover:text-red-800 transition-colors"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTerms}
        isAccepted={termsAccepted}
      />
    </div>
  );
};

export default Login;



