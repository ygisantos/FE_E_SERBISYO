import React from 'react';
import InputField from "../../reusable/InputField";

const AccountInformation = ({ form, handleChange, stepErrors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
        <p className="text-gray-600 text-sm mt-2">Create your account credentials</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField 
          name="first_name" 
          value={form.first_name || ''} 
          onChange={handleChange} 
          required 
          placeholder="Enter your first name" 
          label="First Name"
          error={stepErrors.first_name}
        />
        <InputField 
          name="last_name" 
          value={form.last_name || ''} 
          onChange={handleChange} 
          required 
          placeholder="Enter your last name" 
          label="Last Name"
          error={stepErrors.last_name}
        />
        <InputField 
          name="middle_name" 
          value={form.middle_name || ''} 
          onChange={handleChange} 
          placeholder="Enter your middle name (optional)" 
          label="Middle Name"
        />
        <InputField 
          name="suffix" 
          value={form.suffix || ''} 
          onChange={handleChange} 
          placeholder="Jr, Sr, III, etc. (optional)" 
          label="Suffix"
        />
        <InputField 
          name="email" 
          value={form.email || ''} 
          onChange={handleChange} 
          required 
          type="email" 
          placeholder="your.email@example.com" 
          label="Email Address" 
          className="col-span-1 sm:col-span-2"
          error={stepErrors.email}
        />
        <InputField 
          name="password" 
          value={form.password || ''} 
          onChange={handleChange} 
          required 
          type="password" 
          placeholder="Enter a strong password" 
          label="Password"
          error={stepErrors.password}
        />
        <InputField 
          name="password_confirmation" 
          value={form.password_confirmation || ''} 
          onChange={handleChange} 
          required 
          type="password" 
          placeholder="Confirm your password" 
          label="Confirm Password"
          error={stepErrors.password_confirmation}
        />
      </div>
    </div>
  );
};

export default AccountInformation;