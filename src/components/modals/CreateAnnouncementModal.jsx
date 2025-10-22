import React, { useState, useEffect, useRef } from 'react';
import Modal from '../Modal/Modal';
import { FaImage, FaTimes } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';
import Select from '../reusable/Select';
import { showCustomToast } from '../Toast/CustomToast';

const CreateAnnouncementModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    images: []
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // character limit state
  const MAX_CHARS = 1000;
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    setFormData({
      type: '',
      description: '',
      images: []
    });
    setPreviewUrl(null);
    setHasChanges(false);
    setCharCount(0); 
    setErrors({});
  };

  const typeOptions = [
    { value: "information", label: "Information" },
    { value: "warning", label: "Warning" },
    { value: "problem", label: "Problem" }
  ];

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const hasChangesInForm = () => {
    return formData.type !== '' || 
           formData.description !== '' || 
           formData.images.length > 0 ||
           previewUrl !== null;
  };

  useEffect(() => {
    setHasChanges(hasChangesInForm());
  }, [formData, previewUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'description') {
      //Limit or prevent typing if max chars reached
      if (value.length <= MAX_CHARS) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        setCharCount(value.length);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [file]
      }));
      setHasChanges(true);
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFormData(prev => ({
      ...prev,
      images: []
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let toastMessage = '';
    
    if (!formData.type) {
      newErrors.type = 'Type is required';
      toastMessage = 'Type is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      toastMessage = toastMessage || 'Description is required';
    }

    setErrors(newErrors);
    if (toastMessage) {
      showCustomToast(toastMessage, 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleSubmitAttempt = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      // Create object first to verify data
      const submitData = {
        type: formData.type,
        description: formData.description,
      };

    
      // Create FormData
      const formDataToSend = new FormData();
      
      // Append each field
      Object.keys(submitData).forEach(key => {
        formDataToSend.append(key, submitData[key]);
      });

      // Add image if exists
      if (formData.images[0]) {
        formDataToSend.append('image', formData.images[0]);
      }

      const result = await onSubmit(submitData); 

      
      showCustomToast('Announcement created successfully', 'success');
      resetForm();
      setShowConfirmModal(false);
      onClose();
    } catch (error) {
       showCustomToast(
        error.response?.data?.errors?.type?.[0] || 'Failed to create announcement', 
        'error'
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create New Announcement"
      >
        <form className="space-y-6 p-6">
          {/* Type Selection */}
          <Select
            label="Type"
            name="type"
            value={typeOptions.find(opt => opt.value === formData.type)}
            onChange={(selected) => handleInputChange({
              target: { name: 'type', value: selected.value }
            })}
            options={typeOptions}
            required
            placeholder="Select announcement type..."
            error={errors.type}
            className={`text-sm ${errors.type ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />

          {/* Description Field with Character Counter */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs ${charCount >= MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter announcement details..."
              className={`mt-1 block w-full rounded-md border px-4 py-2 text-sm
                ${errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}
                focus:border-red-500 focus:ring-red-500
                ${charCount >= MAX_CHARS ? 'border-red-300' : ''}`}
              rows={6}
              onKeyDown={(e) => {
                if (formData.description.length >= MAX_CHARS && e.key !== 'Backspace' && e.key !== 'Delete') {
                  e.preventDefault();
                }
              }}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
            {charCount >= MAX_CHARS && (
              <p className="text-xs text-red-500 mt-1">
                Character limit reached
              </p>
            )}
          </div>

          {/* Single Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image"
              ref={fileInputRef}
            />
            
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                  >
                    <span className="text-white text-sm flex items-center gap-2">
                      <FaTimes className="w-4 h-4" />
                      Remove Image
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaImage className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitAttempt}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-900 rounded-md hover:bg-red-800 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

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

      {/* Confirm Submit Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Create Announcement"
        message="Are you sure you want to create this announcement?"
        confirmText="Create"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
};

export default CreateAnnouncementModal;
