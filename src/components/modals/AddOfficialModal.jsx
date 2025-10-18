import React, { useState, useRef } from "react";
import Modal from "../Modal/Modal";
import FormInput from '../reusable/InputField';
import Select from "../reusable/Select";
import { FaUpload, FaImage, FaTrash } from "react-icons/fa";
import { showCustomToast } from '../Toast/CustomToast';

const AddOfficialModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    position: "",
    email: "",
    contact_no: "",
    sex: "M",
    birthday: "",
    birth_place: "",
    civil_status: "",
    municipality: "",
    barangay: "",
    house_no: "",
    zip_code: "",
    street: "",
    term_start: "",
    term_end: "",
    status: "active",
    type: "staff",
    nationality: "Filipino",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { key: 'position', label: 'Position' },
      { key: 'term_start', label: 'Term Start' },
      { key: 'term_end', label: 'Term End' },
      { key: 'email', label: 'Email' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'sex', label: 'Sex' },
      { key: 'birthday', label: 'Birthday' },
      { key: 'contact_no', label: 'Contact Number' },
      { key: 'birth_place', label: 'Birth Place' },
      { key: 'municipality', label: 'Municipality' },
      { key: 'barangay', label: 'Barangay' },
      { key: 'house_no', label: 'House No' },
      { key: 'zip_code', label: 'ZIP Code' },
      { key: 'street', label: 'Street' },
      { key: 'civil_status', label: 'Civil Status' },
    ];

    let hasErrors = false;
    requiredFields.forEach(({ key, label }) => {
      // Add debug logging
      console.log(`Checking ${key}: `, formData[key]);
      
      if (!formData[key]) {
        newErrors[key] = `${label} is required`;
        hasErrors = true;
      }
    });

    if (!formData.image) {
      newErrors.image = 'Profile picture is required';
      hasErrors = true;
    }

    // Debug logging
    if (hasErrors) {
      console.log('Validation errors:', newErrors);
    } else {
      console.log('All fields valid');
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const generatePassword = (firstName, lastName, birthday) => {
    // Get first 2 letters of first name and last name
    const firstTwo = (firstName || '').slice(0, 2).toLowerCase();
    const lastTwo = (lastName || '').slice(0, 2).toLowerCase();
    
    // Get year from birthday
    const year = new Date(birthday).getFullYear();
    
    // Combine them with !
    return `${firstTwo}${lastTwo}${year}!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showCustomToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Required fields
      const requiredFields = {
        position: formData.position,
        term_start: formData.term_start,
        term_end: formData.term_end,
        status: 'active',
        type: 'staff',
        email: formData.email,
        password: generatePassword(formData.first_name, formData.last_name, formData.birthday),
        password_confirmation: generatePassword(formData.first_name, formData.last_name, formData.birthday),
        first_name: formData.first_name,
        last_name: formData.last_name,
        sex: formData.sex,
        birthday: formData.birthday,
        contact_no: formData.contact_no,
        birth_place: formData.birth_place,
        municipality: formData.municipality,
        barangay: formData.barangay,
        house_no: formData.house_no,
        zip_code: formData.zip_code,
        street: formData.street,
        civil_status: formData.civil_status,
        nationality: 'Filipino'
      };

      // Add all required fields to FormData
      Object.entries(requiredFields).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Optional fields
      if (formData.middle_name) formDataToSend.append('middle_name', formData.middle_name);
      if (formData.suffix) formDataToSend.append('suffix', formData.suffix);

      // Image file
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      await onSubmit(formDataToSend);
      onClose();
      showCustomToast('Official added successfully', 'success');
    } catch (error) {
      const errorMessage = error?.errors?.[0] || error.message || 'Failed to create official';
      showCustomToast(errorMessage, 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const positionOptions = [
    { value: "Barangay Captain", label: "Barangay Captain" },
    { value: "Barangay Secretary", label: "Barangay Secretary" },
    { value: "Barangay Treasurer", label: "Barangay Treasurer" },
    { value: "Barangay Kagawad", label: "Barangay Kagawad" },
    { value: "SK Chairman", label: "SK Chairman" },
    { value: "Barangay Tanod", label: "Barangay Tanod" }
  ];

  const renderImageUpload = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div 
        className="relative group w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-red-500 transition-colors duration-200"
        onClick={() => fileInputRef.current?.click()}
      >
        {previewImage ? (
          <>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(true);
                  }}
                  className="p-1.5 bg-white rounded-full hover:bg-gray-100"
                >
                  <FaImage className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Remove this photo?')) {
                      setPreviewImage(null);
                      setFormData({ ...formData, image: null });
                    }
                  }}
                  className="p-1.5 bg-white rounded-full hover:bg-red-100"
                >
                  <FaTrash className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FaUpload className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            <span className="mt-2 text-xs text-gray-500 group-hover:text-red-500">Upload Photo</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Official"
      modalClass="max-w-4xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="addOfficialForm"
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Save Official
          </button>
        </div>
      }
    >
      <form id="addOfficialForm" onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Picture Section - 4 columns */}
          <div className="col-span-12 md:col-span-4">
            <div className="bg-gray-50 rounded-lg p-6 h-full flex items-center justify-center">
              {renderImageUpload()}
            </div>
          </div>

          {/* Form Fields Section - 8 columns */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            {/* Official Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Official Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Position"
                  value={positionOptions.find(opt => opt.value === formData.position)}
                  onChange={(selected) => handleChange({
                    target: { name: 'position', value: selected.value }
                  })}
                  options={positionOptions}
                  required
                  className="col-span-2"
                />
                <FormInput
                  label="Term Start"
                  name="term_start"
                  type="date"
                  value={formData.term_start}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Term End"
                  name="term_end"
                  type="date"
                  value={formData.term_end}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Middle Name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
                <FormInput
                  label="Suffix"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Contact Number"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Birth Place"
                  name="birth_place"
                  value={formData.birth_place}
                  onChange={handleChange}
                  required
                  placeholder="Enter place of birth"
                  error={errors.birth_place}
                />
                <Select
                  label="Civil Status"
                  name="civil_status"
                  value={{ value: formData.civil_status, label: formData.civil_status }}
                  onChange={(selected) => handleChange({
                    target: { name: 'civil_status', value: selected.value }
                  })}
                  options={[
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'widowed', label: 'Widowed' },
                    { value: 'separated', label: 'Separated' }
                  ]}
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Municipality"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Barangay"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="House No."
                  name="house_no"
                  value={formData.house_no}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="ZIP Code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddOfficialModal;
 