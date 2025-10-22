import React, { useState } from "react";
import Modal from "../Modal/Modal";
import InputField from '../reusable/InputField'; 
import Select from "../reusable/Select";
import { showCustomToast } from '../Toast/CustomToast';
import ConfirmationModal from '../modals/ConfirmationModal';

const AddOfficialModal = ({ isOpen, onClose, onSubmit }) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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
  const [errors, setErrors] = useState({});

  const positionOptions = [
    { value: "Barangay Captain", label: "Barangay Captain" },
    { value: "Barangay Secretary", label: "Barangay Secretary" },
    { value: "Barangay Treasurer", label: "Barangay Treasurer" },
    { value: "Barangay Kagawad", label: "Barangay Kagawad" },
    { value: "SK Chairman", label: "SK Chairman" },
    { value: "Barangay Tanod", label: "Barangay Tanod" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setHasChanges(true);
  };

  const handleSelectChange = (selected, fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: selected?.value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors = {};
    let toastMessage = '';

    if (!formData.position) {
      newErrors.position = 'Position is required';
      toastMessage = 'Position is required';
    }
    if (!formData.term_start) {
      newErrors.term_start = 'Term start is required';
      toastMessage = toastMessage || 'Term start is required';
    }
    if (!formData.term_end) {
      newErrors.term_end = 'Term end is required';
      toastMessage = toastMessage || 'Term end is required';
    }
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
      toastMessage = toastMessage || 'First name is required';
    }
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
      toastMessage = toastMessage || 'Last name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
      toastMessage = toastMessage || 'Email is required';
    }
    if (!formData.contact_no) {
      newErrors.contact_no = 'Contact number is required';
      toastMessage = toastMessage || 'Contact number is required';
    }
    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
      toastMessage = toastMessage || 'Birthday is required';
    }
    if (!formData.birth_place) {
      newErrors.birth_place = 'Birth place is required';
      toastMessage = toastMessage || 'Birth place is required';
    }
    if (!formData.civil_status) {
      newErrors.civil_status = 'Civil status is required';
      toastMessage = toastMessage || 'Civil status is required';
    }
    if (!formData.municipality) {
      newErrors.municipality = 'Municipality is required';
      toastMessage = toastMessage || 'Municipality is required';
    }
    if (!formData.barangay) {
      newErrors.barangay = 'Barangay is required';
      toastMessage = toastMessage || 'Barangay is required';
    }
    if (!formData.house_no) {
      newErrors.house_no = 'House number is required';
      toastMessage = toastMessage || 'House number is required';
    }
    if (!formData.street) {
      newErrors.street = 'Street is required';
      toastMessage = toastMessage || 'Street is required';
    }
    if (!formData.zip_code) {
      newErrors.zip_code = 'ZIP code is required';
      toastMessage = toastMessage || 'ZIP code is required';
    }

    // Format validations
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      toastMessage = toastMessage || 'Invalid email format';
    }
    if (formData.contact_no && !/^09\d{9}$/.test(formData.contact_no)) {
      newErrors.contact_no = 'Must start with 09 and have 11 digits';
      toastMessage = toastMessage || 'Must start with 09 and have 11 digits';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showCustomToast(toastMessage, 'error');
      return false;
    }
    return true;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      setShowSubmitModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Remove image handling and just send other fields
      const fieldsToSend = {
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

      Object.entries(fieldsToSend).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Optional fields
      if (formData.middle_name) formDataToSend.append('middle_name', formData.middle_name);
      if (formData.suffix) formDataToSend.append('suffix', formData.suffix);

      await onSubmit(formDataToSend);
      showCustomToast('Official added successfully', 'success');
      resetForm();
      onClose();
      setShowSubmitModal(false);
    } catch (error) {
      showCustomToast(error?.message || 'Failed to create official', 'error');
      setShowSubmitModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setErrors({});
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      resetForm();
      onClose();
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleCancel} 
        title="Add Official"
        modalClass="max-w-4xl"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              type="button"
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="addOfficialForm"
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              onClick={handleSubmit} // Add direct click handler
            >
              Create Official
            </button>
          </div>
        }
      >
        <form 
          id="addOfficialForm" 
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 space-y-6">
              {/* Official Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Official Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Position"
                    value={positionOptions.find(opt => opt.value === formData.position)}
                    onChange={(selected) => handleSelectChange(selected, 'position')}
                    options={positionOptions}
                    required
                    error={errors.position}
                    className={`col-span-1 md:col-span-2 ${errors.position ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <InputField
                    label="Term Start"
                    name="term_start"
                    type="date"
                    value={formData.term_start}
                    onChange={handleChange}
                    required
                    error={errors.term_start}
                  />
                  <InputField
                    label="Term End"
                    name="term_end"
                    type="date"
                    value={formData.term_end}
                    onChange={handleChange}
                    required
                    error={errors.term_end}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    error={errors.first_name}
                    className="text-xs"
                  />
                  <InputField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    error={errors.last_name}
                    className="text-xs"
                  />
                  <InputField
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Suffix"
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.email}
                    className="text-xs"
                  />
                  <InputField
                    label="Contact Number"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    required
                    error={errors.contact_no}
                    className="text-xs"
                  />
                  <InputField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
                    error={errors.birthday}
                    className="text-xs"
                  />
                  <InputField
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
                    onChange={(selected) => handleSelectChange(selected, 'civil_status')}
                    options={[
                      { value: 'single', label: 'Single' },
                      { value: 'married', label: 'Married' },
                      { value: 'widowed', label: 'Widowed' },
                      { value: 'separated', label: 'Separated' }
                    ]}
                    required
                    error={errors.civil_status}
                    className={`${errors.civil_status? 'border-red-500 ring-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Municipality"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleChange}
                    required
                    error={errors.municipality}
                    className={`${errors.municipality ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <InputField
                    label="Barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    required
                    error={errors.barangay}
                    className={`${errors.barangay ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <InputField
                    label="House No."
                    name="house_no"
                    value={formData.house_no}
                    onChange={handleChange}
                    required
                    error={errors.house_no}
                    className={`${errors.house_no ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <InputField
                    label="Street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    error={errors.street }
                    className={`${errors.street ? 'border-red-500 ring-red-500' : ''}`}
                  />
                  <InputField
                    label="ZIP Code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    required
                    error={errors.zip_code}
                    className={`${errors.zip_code ? 'border-red-500 ring-red-500' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Create Official"
        message="Are you sure you want to create this official?"
        confirmText="Create"
        cancelText="Cancel"
      />

      {/* Discard Changes Modal */}
      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          resetForm();
          onClose();
          setShowDiscardModal(false);
        }}
        title="Discard Changes"
        message="Are you sure you want to discard your changes?"
        confirmText="Discard"
        cancelText="Keep Editing"
        type="warning"
      />
    </>
  );
};

export default AddOfficialModal;
