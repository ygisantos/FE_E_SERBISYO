import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import FormInput from '../reusable/InputField';
import Select from "../reusable/Select";
import {  FaUpload, FaImage, FaTrash } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";


const EditOfficialModal = ({ isOpen, onClose, onSubmit, official }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    position: "",
    image_path: "",
    term_start: "",
    term_end: "",
    status: "active",
  });
  const [originalData, setOriginalData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef(null);
  const initialFormData = useRef(null);

  const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    // Use storage URL from env
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    return `${storageUrl}/${path}`;
  };

  useEffect(() => {
    if (official) {
      // Since we're getting direct official object from response
      const data = official;

      // Parse full name
      const nameParts = data.full_name.split(' ').filter(part => part);
      let firstName = nameParts[0] || '';
      let lastName = nameParts[nameParts.length - 1] || '';
      let middleName = '';
      let suffix = '';

      // Extract middle name and suffix if name has more than 2 parts
      if (nameParts.length > 2) {
        const middleParts = nameParts.slice(1, -1);
        const commonSuffixes = ['Jr', 'Sr', 'II', 'III', 'IV'];
        const lastMiddlePart = middleParts[middleParts.length - 1];
        
        if (commonSuffixes.includes(lastMiddlePart)) {
          suffix = lastMiddlePart;
          middleName = middleParts.slice(0, -1).join(' ');
        } else {
          middleName = middleParts.join(' ');
        }
      }

      const formattedData = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        suffix: suffix,
        position: data.position,
        term_start: data.term_start?.split('T')[0],
        term_end: data.term_end?.split('T')[0],
        status: data.status,
      };

      setFormData(formattedData);
      setOriginalData(formattedData);

      // Set preview image
      if (data.image_path) {
        const imgUrl = getProfilePicUrl(data.image_path);
        setPreviewImage(imgUrl);
      }
    }
  }, [official, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image_path: file
      }));
      setPreviewImage(URL.createObjectURL(file));
      setShowPreview(true);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setFormData(originalData || {});
    setPreviewImage(null);
    setErrors({});
    setHasChanges(false);
    onClose();
  };

  const handleDiscardChanges = () => {
    setShowDiscardModal(false);
    resetAndClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSaveModal(true);
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
        className="relative group w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-red-500 transition-colors duration-200 cursor-pointer overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {previewImage ? (
          <div className="h-full">
            <img 
              src={previewImage} 
              alt="Official's photo" 
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(true);
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-white"
                >
                  <FaImage className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(null);
                    setFormData(prev => ({ ...prev, image_path: null }));
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-red-50"
                >
                  <FaTrash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
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
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {previewImage && (
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="text-xs text-red-600 hover:text-red-700"
        >
          View Photo
        </button>
      )}
    </div>
  );

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        title="Edit Official"
        modalClass="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="editOfficialForm"
              className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Save Changes
            </button>
          </div>
        }
      >
        <form id="editOfficialForm" onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Image Upload */}
            <div className="flex items-center justify-center p-4 bg-gray-50/50 rounded-lg">
              {renderImageUpload()}
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  error={errors.first_name}
                  placeholder="First name"
                  className="text-xs"
                />
                <FormInput
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  error={errors.last_name}
                  placeholder="Last name"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Middle Name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="text-xs"
                />
                <FormInput
                  label="Suffix"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleInputChange}
                  placeholder="Jr, Sr, III, etc."
                  className="text-xs"
                />
              </div>

              <Select
                label="Position"
                value={positionOptions.find(opt => opt.value === formData.position)}
                onChange={(selected) => handleInputChange({
                  target: { name: 'position', value: selected.value }
                })}
                options={positionOptions}
                required
                error={errors.position}
                placeholder="Select position"
                className="text-xs"
              />

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Term Start"
                  name="term_start"
                  type="date"
                  value={formData.term_start}
                  onChange={handleInputChange}
                  required
                  error={errors.term_start}
                  className="text-xs"
                />
                <FormInput
                  label="Term End"
                  name="term_end"
                  type="date"
                  value={formData.term_end}
                  onChange={handleInputChange}
                  required
                  error={errors.term_end}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Discard Changes Modal */}
      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleDiscardChanges}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        cancelText="Keep Editing"
        type="warning"
      />

      {/* Save Changes Modal */}
      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={() => {
          const formDataToSend = new FormData();
          const fullName = `${formData.first_name} ${formData.middle_name ? formData.middle_name + ' ' : ''}${formData.last_name}${formData.suffix ? ' ' + formData.suffix : ''}`;
    
          formDataToSend.append('full_name', fullName.trim());
          formDataToSend.append('position', formData.position);
          formDataToSend.append('term_start', formData.term_start);
          formDataToSend.append('term_end', formData.term_end);
          formDataToSend.append('status', formData.status);
    
          if (formData.image_path instanceof File) {
            formDataToSend.append('image', formData.image_path);
          }
    
          onSubmit(formDataToSend);
          setShowSaveModal(false);
        }}
        title="Save Changes"
        message="Are you sure you want to save these changes?"
        confirmText="Save"
        cancelText="Cancel"
        type="warning"
      />

      {/* Preview Modal */}
      {showPreview && (
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Profile Photo"
          modalClass="max-w-md"
        >
          <div className="p-4 flex flex-col items-center">
            <img
              src={previewImage}
              alt="Preview"
              className="w-48 h-48 rounded-full object-cover shadow-sm"
            />
            <button
              onClick={() => setShowPreview(false)}
              className="mt-4 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
 
export default EditOfficialModal;
  
