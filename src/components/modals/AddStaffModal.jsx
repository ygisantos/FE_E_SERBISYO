import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import InputField from '../reusable/InputField';
import Select from '../reusable/Select';
import { showCustomToast } from '../Toast/CustomToast';
import ConfirmationModal from '../modals/ConfirmationModal';

const AddStaffModal = ({ isOpen, onClose, onSubmit }) => {
  const initialFormData = {
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    sex: '',
    nationality: 'Filipino',
    birthday: '',
    contact_no: '',
    birth_place: '',
    municipality: 'Balagtas',
    barangay: 'Pulong Gubat',
    house_no: '',
    zip_code: '3014',
    street: '',
    type: 'staff',
    civil_status: '',
    status: 'pending'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Just clear the red border
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSelectChange = (selected, fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: selected?.value }));
  };

  const civilStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "widowed", label: "Widowed" },
    { value: "separated", label: "Separated" }
  ];

  const sexOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" }
  ];

  // Add account type options
  const accountTypeOptions = [
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" }
  ];

  const validateForm = () => {
    const newErrors = {};
    let errorMessage = '';
    
    // Required field validation
    if (!formData.email) {
      newErrors.email = true;
      errorMessage = 'Email is required';
    }
    if (!formData.first_name) {
      newErrors.first_name = true;
      errorMessage = errorMessage || 'First name is required';
    }
    if (!formData.last_name) {
      newErrors.last_name = true;
      errorMessage = errorMessage || 'Last name is required';
    }
    if (!formData.sex) {
      newErrors.sex = true;
      errorMessage = errorMessage || 'Sex is required';
    }
    if (!formData.civil_status) {
      newErrors.civil_status = true;
      errorMessage = errorMessage || 'Civil status is required';
    }
    if (!formData.birthday) {
      newErrors.birthday = true;
      errorMessage = errorMessage || 'Birthday is required';
    }
    if (!formData.contact_no) {
      newErrors.contact_no = true;
      errorMessage = errorMessage || 'Contact number is required';
    }
    if (!formData.house_no) {
      newErrors.house_no = true;
      errorMessage = errorMessage || 'House number is required';
    }
    if (!formData.street) {
      newErrors.street = true;
      errorMessage = errorMessage || 'Street is required';
    }

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true;
      errorMessage = 'Invalid email format';
    }

    // Contact number format validation
    if (formData.contact_no && !/^09\d{9}$/.test(formData.contact_no)) {
      newErrors.contact_no = true;
      errorMessage = 'Contact number must start with 09 and be 11 digits';
    }

    setErrors(newErrors);
    if (errorMessage) {
      showCustomToast(errorMessage, 'error');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleCloseAttempt = () => {
    const hasChanges = Object.keys(formData).some(key => 
      formData[key] !== initialFormData[key]
    );
    
    if (hasChanges) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleConfirmedClose = () => {
    resetForm();
    setShowConfirmClose(false);
    onClose();
  };

  const handleSubmitAttempt = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmSubmit(true);
    }
  };

  const handleConfirmedSubmit = async () => {
    try {
      await onSubmit(formData);
      showCustomToast('Staff account created successfully', 'success');
      resetForm();
      setShowConfirmSubmit(false);
      onClose();
    } catch (error) {
      showCustomToast(error.message || 'Failed to create staff account', 'error');
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen} 
        onClose={handleCloseAttempt} 
        title="Add Staff Account"
        modalClass="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseAttempt}
              className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAttempt}
              className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Save Staff
            </button>
          </div>
        }
      >
        <form className="p-4 space-y-4">
          <div className="space-y-4">
            {/* Account Type */}
            <Select
              label="Account Type"
              value={accountTypeOptions.find(opt => opt.value === formData.type)}
              onChange={(selected) => handleChange({
                target: { name: 'type', value: selected.value }
              })}
              options={accountTypeOptions}
              required
              error={errors.type}
              placeholder="Select account type"
              className="text-xs"
            />

            {/* Basic Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email} 
                  required
                  className="col-span-2"
                />
                <InputField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name}
                  required
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                  required
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Personal Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Sex"
                  value={sexOptions.find(opt => opt.value === formData.sex)}
                  onChange={(selected) => handleSelectChange(selected, 'sex')}
                  options={sexOptions}
                  error={errors.sex}
                  required
                />
                <Select
                  label="Civil Status"
                  value={civilStatusOptions.find(opt => opt.value === formData.civil_status)}
                  onChange={(selected) => handleSelectChange(selected, 'civil_status')}
                  options={civilStatusOptions}
                  error={errors.civil_status}
                  required
                />
                <InputField
                  label="Birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleChange}
                  error={errors.birthday}
                  required
                />
                <InputField
                  label="Contact"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  error={errors.contact_no}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</h4>
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="House No."
                  name="house_no"
                  value={formData.house_no}
                  onChange={handleChange}
                  error={errors.house_no}
                  required
                />
                <InputField
                  label="Street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  error={errors.street}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        onConfirm={handleConfirmedClose}
        title="Discard Changes"
        message="Are you sure you want to discard your changes?"
        confirmText="Discard"
        cancelText="Continue Editing"
      />

      <ConfirmationModal
        isOpen={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        onConfirm={handleConfirmedSubmit}
        title="Create Staff Account"
        message="Are you sure you want to create this staff account?"
        confirmText="Create"
        cancelText="Cancel"
      />
    </>
  );
};

export default AddStaffModal;

