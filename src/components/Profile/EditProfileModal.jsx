import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { validateForm } from '../../utils/validations';
import { toast } from 'react-toastify';
import { updateAccountInformation } from '../../api/accountApi';
import { useAuth } from '../../contexts/AuthContext';

const EditProfileModal = ({ isOpen, onClose, editForm, setEditForm, onSave }) => {
  const [invalidFields, setInvalidFields] = useState({});
  const { user } = useAuth();

  const handleSave = async () => {
    const validation = validateForm(editForm);
    if (!validation.isValid) {
      // Show first error in toast
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      
      // Mark invalid fields for red border
      setInvalidFields(validation.errors);
      return;
    }
    setInvalidFields({});
    
    try {
      await updateAccountInformation(user.id, editForm);
      toast.success('Profile updated successfully');
      onSave(editForm);
      onClose();
    } catch (error) {
      if (error.validationErrors) {
        // Set invalid fields for UI feedback
        setInvalidFields(error.validationErrors);
        // Show the first validation error message
        toast.error(error.message);
      } else {
        toast.error(error || 'Failed to update profile');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Display User Role as read-only */}
        <div className="bg-gray-50 px-4 py-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
          <div className="text-sm text-gray-900">{editForm.type}</div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "First Name", field: "firstName" },
            { label: "Last Name", field: "lastName" },
            { label: "Email", field: "email", type: "email" },
            { label: "Phone Number", field: "phone", type: "tel" },
            { label: "Date of Birth", field: "dateOfBirth", type: "date" }
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type || "text"}
                value={editForm[field] || ''}
                onChange={(e) => {
                  setEditForm({ ...editForm, [field]: e.target.value });
                  if (invalidFields[field]) {
                    setInvalidFields({ ...invalidFields, [field]: '' });
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  invalidFields[field] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;

 
