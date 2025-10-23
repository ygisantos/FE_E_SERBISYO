import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import InputField from '../Input/InputField';  
import Select from '../reusable/Select';
import { updateAccountInformation } from '../../api/accountApi';
import { showCustomToast } from '../Toast/CustomToast';

const EditStaffModal = ({ isOpen, onClose, staff, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: staff?.first_name || '',
    last_name: staff?.last_name || '',
    middle_name: staff?.middle_name || '',
    suffix: staff?.suffix || '',
    email: staff?.email || '',
    contact_no: staff?.contact_no || '',
    type: staff?.type || 'staff',
    birth_place: staff?.birth_place || '',
    civil_status: staff?.civil_status || '',
    municipality: staff?.municipality || '',
    barangay: staff?.barangay || '',
    house_no: staff?.house_no || '',
    zip_code: staff?.zip_code || '',
    street: staff?.street || '',
    birthday: staff?.birthday || '',
    sex: staff?.sex || '',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    try {
      await updateAccountInformation(staff.id, formData);
      showCustomToast('Staff updated successfully', 'success');
      onSuccess();
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
        // Show first error message as toast
        const firstError = Object.values(error.errors)[0][0];
        showCustomToast(firstError, 'error');
      } else {
        showCustomToast(error.message || 'Failed to update staff', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const typeOptions = [
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Admin" }
  ];

  const civilStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "widowed", label: "Widowed" },
    { value: "divorced", label: "Divorced" }
  ];

  const sexOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Staff"
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
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="p-6">
        <div className="space-y-6">
          {/* Staff Information */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Staff Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Account Type"
                value={typeOptions.find(opt => opt.value === formData.type)}
                onChange={(selected) => handleInputChange({
                  target: { name: 'type', value: selected.value }
                })}
                options={typeOptions}
                required
              />
              <InputField 
                label="Email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                error={errors.email}
                readOnly
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} required error={errors.first_name} />
              <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} required error={errors.last_name} />
              <InputField label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleInputChange} />
              <InputField label="Suffix" name="suffix" value={formData.suffix} onChange={handleInputChange} />
              
              {/* Added Birthday and Sex fields */}
              <InputField 
                label="Birthday" 
                name="birthday" 
                type="date" 
                value={formData.birthday ? formData.birthday.split('T')[0] : ''} 
                onChange={handleInputChange} 
                required 
                error={errors.birthday}
              />
              <Select
                label="Sex"
                value={sexOptions.find(opt => opt.value === formData.sex)}
                onChange={(selected) => handleInputChange({
                  target: { name: 'sex', value: selected.value }
                })}
                options={sexOptions}
                required
                error={errors.sex}
              />

              <InputField label="Contact No" name="contact_no" value={formData.contact_no} onChange={handleInputChange} required error={errors.contact_no} />
              <Select
                label="Civil Status"
                value={civilStatusOptions.find(opt => opt.value === formData.civil_status)}
                onChange={(selected) => handleInputChange({
                  target: { name: 'civil_status', value: selected.value }
                })}
                options={civilStatusOptions}
                required
              />
              <InputField label="Birth Place" name="birth_place" value={formData.birth_place} onChange={handleInputChange} required error={errors.birth_place} />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="House No" name="house_no" value={formData.house_no} onChange={handleInputChange} required error={errors.house_no} />
              <InputField label="Street" name="street" value={formData.street} onChange={handleInputChange} required error={errors.street} />
              <InputField label="Barangay" name="barangay" value={formData.barangay} onChange={handleInputChange} required error={errors.barangay} />
              <InputField label="Municipality" name="municipality" value={formData.municipality} onChange={handleInputChange} required error={errors.municipality} />
              <InputField label="ZIP Code" name="zip_code" value={formData.zip_code} onChange={handleInputChange} required error={errors.zip_code} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditStaffModal;
