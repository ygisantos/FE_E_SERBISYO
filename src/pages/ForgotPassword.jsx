import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/inputfield/FormInput";
import Button from "../components/reusable/Button";
import CustomToastContainer, { showCustomToast } from "../components/Toast/CustomToast";
import logo from "../assets/logo/santol_logo.png";
import axiosInstance from "../axios";

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: "", birthday: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/forgot-password", form);
      showCustomToast("Password reset instructions sent to your email.", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      let msg = "Failed to send reset instructions";
      const credentialsError = err.response?.data?.error?.credentials;
      if (Array.isArray(credentialsError)) {
        msg = credentialsError.join(" ");
      } else if (typeof credentialsError === "string") {
        msg = credentialsError;
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      showCustomToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <CustomToastContainer />
  <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-(--color-accent)">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 mb-2" />
          <span className="font-bold text-2xl text-(--color-primary)">Forgot Password</span>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FormInput
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email address"
            label="Email Address"
            required
          />
          <FormInput
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            type="date"
            placeholder="Enter your birthday"
            label="Birthday"
            required
          />
          <Button type="submit" loading={loading} loadingText="Sending...">
            Send Reset Instructions
          </Button>
          <button
            type="button"
            className="text-sm text-red-900 hover:underline mt-2"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
