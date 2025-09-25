import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Register from "../components/Register"; // Import the multi-step Register component
import logo from '../assets/logo/santol_logo.png';
import CustomToastContainer, { showCustomToast } from "../components/Toast/CustomToast";
import { register } from "../api/registerApi";
import { validateForm } from "../utils/validations";

const initialState = {
  email: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  sex: "",
  nationality: "Filipino",
  birthday: "",
  contact_no: "",
  birth_place: "",
  municipality: "",
  barangay: "",
  house_no: "",
  zip_code: "",
  street: "",
  password: "",
  password_confirmation: "",
  type: "residence",
  pwd_number: "",
  single_parent_number: "",
  profile_picture: null,
  status: "pending",
};

const RegisterPage = () => {
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSignal, setResetSignal] = useState(0); // Add reset signal

  const handleChange = (e) => {
    let updatedForm;
    
    if (e.target.type === "file") {
      const file = e.target.files[0];
      // Validate file type before setting
      if (
        file &&
        !["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      ) {
        setErrors({
          ...errors,
          profile_picture: [
            "The profile picture field must be an image.",
            "The profile picture field must be a file of type: jpeg, jpg, png.",
          ],
        });
        updatedForm = { ...form, profile_picture: null };
      } else {
        setErrors((prev) => {
          const { profile_picture, ...rest } = prev;
          return rest;
        });
        updatedForm = { ...form, [e.target.name]: file };
      }
    } else if (e.target.type === "checkbox") {
      updatedForm = { ...form, [e.target.name]: e.target.checked };
    } else {
      updatedForm = { ...form, [e.target.name]: e.target.value };
    }

    // Update form state
    setForm(updatedForm);

    // Validate the changed field
    const fieldName = e.target.name;
    if (fieldName && fieldName !== 'profile_picture') {  // Skip file validation here
      const fieldValidation = validateForm({ [fieldName]: updatedForm[fieldName] });
      if (!fieldValidation.isValid) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: [fieldValidation.errors[fieldName]]
        }));
      } else {
        setErrors(prev => {
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form before submission
    const validation = validateForm(form);
    if (!validation.isValid) {
      // Convert validation errors to match API error format
      const formattedErrors = {};
      Object.entries(validation.errors).forEach(([field, message]) => {
        formattedErrors[field] = [message];
      });
      setErrors(formattedErrors);
      showCustomToast("Please fix the form errors before submitting.", "error");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        // Only append if value is not undefined or null
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await register(formData);
      setSuccess(res);
      setForm(initialState);
      setResetSignal((prev) => prev + 1); // Trigger reset for Register stepper
      showCustomToast("Registration successful!", "success");
    } catch (err) {
      setErrors(err);
      showCustomToast("Registration failed. Please check the form.", "error");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300"
      style={{
        backgroundImage: `linear-gradient(rgba(30,30,30,0.5),rgba(30,30,30,0.5)), url('/src/assets/background/santol_hall.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <CustomToastContainer />
      <Navbar navOpen={navOpen} setNavOpen={setNavOpen} logo={logo} />     
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-10 w-full bg-transparent">
        <div className="w-full max-w-4xl bg-white/95 rounded-3xl shadow-2xl p-6 sm:p-12 flex flex-col items-center border border-[var(--color-accent)]">
          <span className="text-[var(--color-primary)] mb-6 font-bold text-2xl tracking-wide">Resident Registration</span>
          {/* Show API validation errors */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 w-full">
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, msgs]) =>
                    msgs.map((msg, idx) => (
                      <li key={field + idx}>{msg}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
          <Register 
            form={form} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit}
            resetSignal={resetSignal}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;