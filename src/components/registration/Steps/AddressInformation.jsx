import React from 'react';
import InputField from "../../reusable/InputField";

const AddressInformation = ({ form, handleChange, stepErrors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Address Information</h3>
        <p className="text-gray-600 text-sm mt-2">Provide your current address details</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField 
          name="municipality" 
          value={form.municipality || ''} 
          onChange={handleChange} 
          required 
          placeholder="City/Municipality" 
          label="City/Municipality" 
          error={stepErrors.municipality}
        />
        <InputField 
          name="barangay" 
          value={form.barangay || ''} 
          onChange={handleChange} 
          required 
          placeholder="Barangay name" 
          label="Barangay" 
          error={stepErrors.barangay}
        />
        <InputField 
          name="house_no" 
          value={form.house_no || ''} 
          onChange={handleChange} 
          required 
          placeholder="House/Unit Number" 
          label="House/Unit No." 
          error={stepErrors.house_no}
        />
        <InputField 
          name="street" 
          value={form.street || ''} 
          onChange={handleChange} 
          required 
          placeholder="Street name" 
          label="Street" 
          error={stepErrors.street}
        />
        <InputField 
          name="zip_code" 
          value={form.zip_code || ''} 
          onChange={handleChange} 
          required 
          placeholder="4-digit ZIP code" 
          label="ZIP Code" 
          error={stepErrors.zip_code}
        />
        <InputField 
          name="type" 
          value="residence"
          onChange={() => {}}
          disabled
          label="Address Type"
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default AddressInformation;
  