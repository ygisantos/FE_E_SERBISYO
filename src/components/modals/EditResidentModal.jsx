import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { updateAccountInformation } from '../../api/accountApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import InputField from '../reusable/InputField';
import Select from '../reusable/Select';
import { User, Mail, Phone, Home, MapPin } from 'lucide-react';

const EditResidentModal = ({ resident, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: resident?.first_name || '',
    middle_name: resident?.middle_name || '',
    last_name: resident?.last_name || '',
    suffix: resident?.suffix || '',
    sex: resident?.sex || '',
    nationality: resident?.nationality || 'Filipino',
    birthday: resident?.birthday || '',
    contact_no: resident?.contact_no || '',
    birth_place: resident?.birth_place || '',
    municipality: resident?.municipality || '',
    barangay: resident?.barangay || '',
    house_no: resident?.house_no || '',
    zip_code: resident?.zip_code || '',
    street: resident?.street || '',
    civil_status: resident?.civil_status || '',
    email: resident?.email || '',
    type: resident?.type || 'residence'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const civilStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "widowed", label: "Widowed" },
    { value: "divorced", label: "Divorced" },
    { value: "separated", label: "Separated" }
  ];

  const typeOptions = [
    { value: "residence", label: "Resident" },
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Admin" }
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
  };

  const handleSelectChange = (selected, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: selected ? selected.value : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let toastMessage = '';
    
    // Required field validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      toastMessage = 'Email is required';
    }
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
      toastMessage = toastMessage || 'First name is required';
    }
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
      toastMessage = toastMessage || 'Last name is required';
    }
    if (!formData.contact_no) {
      newErrors.contact_no = 'Contact number is required';
      toastMessage = toastMessage || 'Contact number is required';
    }

    // Format validations
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      toastMessage = toastMessage || 'Invalid email format';
    }
    if (formData.contact_no && !/^09\d{9}$/.test(formData.contact_no)) {
      newErrors.contact_no = 'Contact number must start with 09 and be 11 digits';
      toastMessage = toastMessage || 'Contact number must start with 09 and be 11 digits';
    }

    setErrors(newErrors);
    if (toastMessage) {
      showCustomToast(toastMessage, 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const response = await updateAccountInformation(resident.id, formData);
      showCustomToast(response.message, 'success');
      onSuccess(response.account);
      onClose();
    } catch (error) {
      showCustomToast(error.message || 'Failed to update resident information', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Edit Resident"
      modalClass="max-w-2xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      }
    >
      <div className="p-4 space-y-4">
        {/* Account Type Selection */}
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</h4>
          <Select
            label="User Type"
            value={typeOptions.find(opt => opt.value === formData.type) || null}
            onChange={(selected) => handleSelectChange(selected, 'type')}
            options={typeOptions}
            required
            className="text-xs"
            error={errors.type}
          />
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Personal Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="text-xs"
              error={errors.first_name}
            />
            <InputField
              label="Middle Name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="text-xs"
            />
            <InputField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="text-xs"
              error={errors.last_name}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              required
              className={`text-xs ${errors.birthday ? 'border-red-500' : ''}`}
              error={errors.birthday}
            />
            <Select
              label="Civil Status"
              value={civilStatusOptions.find(opt => opt.value === formData.civil_status) || null}
              onChange={(selected) => handleSelectChange(selected, 'civil_status')}
              options={civilStatusOptions}
              required
              className={`text-xs ${errors.civil_status ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              placeholder="Select Status"
              error={errors.civil_status}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Contact Number"
              name="contact_no"
              type="tel"
              value={formData.contact_no}
              onChange={handleChange}
              required
              className="text-xs"
              error={errors.contact_no}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="text-xs"
              error={errors.email}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="House No."
              name="house_no"
              value={formData.house_no}
              onChange={handleChange}
              required
              className={`text-xs ${errors.house_no ? 'border-red-500' : ''}`}
              error={errors.house_no}
            />
            <InputField
              label="Street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              className={`text-xs ${errors.street ? 'border-red-500' : ''}`}
              error={errors.street}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditResidentModal;
