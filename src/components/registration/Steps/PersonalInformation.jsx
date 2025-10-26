import React from 'react';
import InputField from "../../reusable/InputField";
import Select from "../../reusable/Select";

const PersonalInformation = ({ form, handleChange, stepErrors }) => {
  const civilStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "widowed", label: "Widowed" },
    { value: "divorced", label: "Divorced" },
    { value: "separated", label: "Separated" }
  ];

  const sexOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" }
  ];

  const handleSelectChange = (selected, fieldName) => {
    handleChange({
      target: {
        name: fieldName,
        value: selected ? selected.value : ''
      }
    });
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    handleChange({
      target: {
        name: 'contact_no',
        value: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
        <p className="text-gray-600 text-sm mt-2">Tell us about yourself</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField 
          name="birthday" 
          value={form.birthday || ''} 
          onChange={handleChange} 
          required 
          type="date" 
          label="Date of Birth"
          error={stepErrors.birthday}
        />
        <Select
          name="sex"
          value={sexOptions.find(option => option.value === form.sex) || null}
          onChange={(selected) => handleSelectChange(selected, 'sex')}
          options={sexOptions}
          placeholder="Select Gender"
          label="Gender"
          error={stepErrors?.sex}
          required
        />
        <Select
          name="civil_status"
          value={civilStatusOptions.find(option => option.value === form.civil_status) || null}
          onChange={(selected) => handleSelectChange(selected, 'civil_status')}
          options={civilStatusOptions}
          placeholder="Select Civil Status"
          label="Civil Status"
          error={stepErrors?.civil_status}
          required
        />
        <InputField 
          name="nationality" 
          value="Filipino"
          disabled={true}
          readOnly={true}
          label="Nationality"
          className="bg-gray-50 cursor-not-allowed"
        />
        <InputField 
          name="contact_no" 
          value={form.contact_no || ''} 
          onChange={handleContactChange}
          required 
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          placeholder="09XXXXXXXXX" 
          label="Contact Number" 
          error={stepErrors.contact_no}
          className="appearance-none"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
            if (e.target.value.length >= 11) {
              e.preventDefault();
            }
          }}
        />
        <InputField 
          name="birth_place" 
          value={form.birth_place || ''} 
          onChange={handleChange} 
          required 
          placeholder="City/Municipality where you were born" 
          label="Place of Birth" 
          className="col-span-1 sm:col-span-2" 
          error={stepErrors.birth_place}
        />
      </div>
    </div>
  );
};

export default PersonalInformation;