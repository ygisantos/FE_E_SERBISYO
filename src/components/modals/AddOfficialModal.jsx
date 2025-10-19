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
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null })); // Clear error on change
    setHasChanges(true);
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

    requiredFields.forEach(({ key, label }) => {
      if (!formData[key]) {
        newErrors[key] = `${label} is required`;
      }
    });

    // Validate contact number format
    if (formData.contact_no && !/^09\d{9}$/.test(formData.contact_no)) {
      newErrors.contact_no = 'Contact number must start with 09 and have 11 digits';
    }

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join('\n');
      showCustomToast(errorMessages, 'error');
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
    if (validateForm()) {
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
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="addOfficialForm"
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Create Official
            </button>
          </div>
        }
      >
        <form id="addOfficialForm" onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 space-y-6">
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
                    error={errors.position}
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
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                     error={errors.first_name}
                    className={errors.first_name ? 'border-red-500' : ''}
                  />
                  <InputField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                     error={errors.last_name}
                    className={errors.last_name ? 'border-red-500' : ''}
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
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  <InputField
                    label="Contact Number"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    required
                    error={errors.contact_no}
                    className={errors.contact_no ? 'border-red-500' : ''}
                  />
                  <InputField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
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
                     error={errors.civil_status}
                    className={errors.civil_status? 'border-red-500' : ''}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Municipality"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleChange}
                    required
                     error={errors.municipality}
                    className={errors.municipality ? 'border-red-500' : ''}
                  />
                  <InputField
                    label="Barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    required
                     error={errors.barangay}
                    className={errors.barangay ? 'border-red-500' : ''}
                  />
                  <InputField
                    label="House No."
                    name="house_no"
                    value={formData.house_no}
                    onChange={handleChange}
                    required
                     error={errors.house_no}
                    className={errors.house_no ? 'border-red-500' : ''}
                  />
                  <InputField
                    label="Street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                     error={errors.street }
                    className={errors.street ? 'border-red-500' : ''}
                  />
                  <InputField
                    label="ZIP Code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    required
                     error={errors.zip_code}
                    className={errors.zip_code ? 'border-red-500' : ''}
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
