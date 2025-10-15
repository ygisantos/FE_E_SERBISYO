import React, { useMemo } from 'react';
import InputField from "../../reusable/InputField";

const FIXED_ADDRESS = {
  municipality: 'Balagtas',
  barangay: 'Santol',
  zip_code: '3016'
};

const AddressInformation = ({ form, handleChange, stepErrors }) => {
  const fixedFields = useMemo(() => ({
    municipality: FIXED_ADDRESS.municipality,
    barangay: FIXED_ADDRESS.barangay,
    zip_code: FIXED_ADDRESS.zip_code
  }), []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Address Information</h3>
        <p className="text-gray-600 text-sm mt-2">Provide your current address details</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField 
          name="municipality" 
          value={fixedFields.municipality} 
          onChange={() => {}}
          disabled
          readOnly
          placeholder="City/Municipality" 
          label="City/Municipality" 
          className="bg-gray-50 cursor-not-allowed select-none"
        />
        <InputField 
          name="barangay" 
          value={fixedFields.barangay} 
          onChange={() => {}}
          disabled
          readOnly
          placeholder="Barangay name" 
          label="Barangay" 
          className="bg-gray-50 cursor-not-allowed select-none"
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
          value={fixedFields.zip_code} 
          onChange={() => {}}
          disabled
          readOnly
          placeholder="4-digit ZIP code" 
          label="ZIP Code" 
          className="bg-gray-50 cursor-not-allowed select-none"
        />
        {/* <InputField 
          name="type" 
          value="residence"
          onChange={() => {}}
          disabled
          label="Address Type"
          className="bg-gray-50 cursor-not-allowed"
        /> */}
      </div>
    </div>
  );
};

export default AddressInformation;
