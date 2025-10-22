import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { updatePassword } from '../../api/accountApi';
import { showCustomToast } from '../Toast/CustomToast';
import ConfirmationModal from './ConfirmationModal';
import InputField from '../Input/InputField';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const initialFormData = {
    current_password: '',
    new_password: '',
    confirm_password: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const rules = [
      { test: /.{8,}/, message: "Must be at least 8 characters long" },
      { test: /[A-Z]/, message: "Must contain uppercase letter" },
      { test: /[a-z]/, message: "Must contain lowercase letter" },
      { test: /[0-9]/, message: "Must contain number" },
      { test: /[^A-Za-z0-9]/, message: "Must contain special character" }
    ];
    const failedRules = rules.filter(rule => !rule.test.test(password));
    return failedRules.length ? failedRules[0].message : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setHasChanges(true);
  };

  // Update error handling: store error messages per field
  const validateForm = () => {
    const newErrors = {};
    let errorMessage = '';

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
      errorMessage = 'Current password is required';
    }
    const passwordError = validatePassword(formData.new_password);
    if (passwordError) {
      newErrors.new_password = passwordError;
      errorMessage = errorMessage || passwordError;
    }
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
      errorMessage = errorMessage || 'Passwords do not match';
    }
    if (formData.new_password === formData.current_password) {
      newErrors.new_password = 'New password must be different from current password';
      errorMessage = errorMessage || 'New password must be different from current password';
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
    setHasChanges(false);
  };

  const handleCloseAttempt = () => {
    const hasAnyChanges = Object.keys(formData).some(key => formData[key] !== initialFormData[key]);
    if (hasAnyChanges) {
      setShowDiscardModal(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const handleConfirmedClose = () => {
    resetForm();
    setShowDiscardModal(false);
    onClose();
  };

  const handleSubmitAttempt = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  // Show API errors in correct field
  const handleConfirmedSubmit = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      await updatePassword(userData.id, {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });
      showCustomToast('Password changed successfully', 'success');
      resetForm();
      setShowConfirmModal(false);
      onClose();
    } catch (error) {
      let toastMsg = 'Failed to change password';
      const fieldErrors = {};
      if (error.response?.data?.error) {
        const errorData = error.response.data.error;
        if (typeof errorData === 'object') {
          Object.entries(errorData).forEach(([field, messages]) => {
            fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
            if (!toastMsg) toastMsg = fieldErrors[field];
          });
        } else if (typeof errorData === 'string') {
          toastMsg = errorData;
        }
      } else if (error.response?.data?.message) {
        toastMsg = error.response.data.message;
      }
      setErrors(fieldErrors);
      showCustomToast(toastMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render password field with error message
  const renderPasswordField = (name, label) => (
    <div className="relative">
      <InputField
        label={label}
        name={name}
        type={showPasswords[name] ? "text" : "password"}
        value={formData[name]}
        onChange={handleChange}
        error={errors[name]}
        required
      />
      <button
        type="button"
        onClick={() => togglePasswordVisibility(name)}
        className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
      >
        {showPasswords[name] ? (
          <FaEyeSlash className="w-4 h-4" />
        ) : (
          <FaEye className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        title="Change Password"
        modalClass="max-w-md"
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
              disabled={loading}
              className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        }
      >
        <form className="space-y-6">
          {renderPasswordField('current_password', 'Current Password')}
          {renderPasswordField('new_password', 'New Password')}
          {renderPasswordField('confirm_password', 'Confirm New Password')}
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmedSubmit}
        title="Change Password"
        message="Are you sure you want to change your password?"
        confirmText="Change"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmedClose}
        title="Discard Changes"
        message="Are you sure you want to discard your changes?"
        confirmText="Discard"
        cancelText="Keep Editing"
        type="warning"
      />
    </>
  );
};

export default ChangePasswordModal;
