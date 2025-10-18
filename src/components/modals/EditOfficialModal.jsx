import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import InputField from '../Input/InputField';  // Changed from FormInput
import Select from "../reusable/Select";
import {  FaUpload, FaImage, FaTrash } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";


const EditOfficialModal = ({ isOpen, onClose, onSubmit, official }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    email: "",
    contact_no: "",
    position: "",
    term_start: "",
    term_end: "",
    birth_place: "",
    civil_status: "",
    municipality: "",
    barangay: "",
    house_no: "",
    zip_code: "",
    street: "",
    status: "active",
    image_path: null
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
    if (official && official.account) {
      setFormData({
        first_name: official.account.first_name || '',
        middle_name: official.account.middle_name || '',
        last_name: official.account.last_name || '',
        suffix: official.account.suffix || '',
        email: official.account.email || '',
        contact_no: official.account.contact_no || '',
        position: official.position || '',
        term_start: official.term_start?.split('T')[0] || '',
        term_end: official.term_end?.split('T')[0] || '',
        birth_place: official.account.birth_place || '',
        civil_status: official.account.civil_status || '',
        municipality: official.account.municipality || '',
        barangay: official.account.barangay || '',
        house_no: official.account.house_no || '',
        zip_code: official.account.zip_code || '',
        street: official.account.street || '',
        status: official.status || 'active'
      });

      if (official.image_path) {
        const imgUrl = getProfilePicUrl(official.image_path);
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

  const civilStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Widowed", label: "Widowed" },
    { value: "Divorced", label: "Divorced" }
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
        modalClass="max-w-4xl"
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
        <form id="editOfficialForm" onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Profile Picture Section */}
            <div className="col-span-12 md:col-span-4">
              {renderImageUpload()}
            </div>

            {/* Form Fields Section */}
            <div className="col-span-12 md:col-span-8 space-y-6">
              {/* Official Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Official Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Position"
                    value={positionOptions.find(opt => opt.value === formData.position)}
                    onChange={(selected) => handleInputChange({
                      target: { name: 'position', value: selected.value }
                    })}
                    options={positionOptions}
                    required
                  />
                  <InputField
                    label="Term Start"
                    name="term_start"
                    type="date"
                    value={formData.term_start}
                    onChange={handleInputChange}
                    required
                    error={errors.term_start?.[0]}
                  />
                  <InputField
                    label="Term End"
                    name="term_end"
                    type="date"
                    value={formData.term_end}
                    onChange={handleInputChange}
                    required
                    error={errors.term_end?.[0]}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                  <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                  <InputField label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleInputChange} />
                  <InputField label="Suffix" name="suffix" value={formData.suffix} onChange={handleInputChange} />
                  
                  <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  <InputField label="Contact No" name="contact_no" value={formData.contact_no} onChange={handleInputChange} required />
                  
                  <InputField label="Birth Place" name="birth_place" value={formData.birth_place} onChange={handleInputChange} required />
                  <Select
                    label="Civil Status"
                    name="civil_status"
                    value={{ value: formData.civil_status, label: formData.civil_status }}
                    onChange={(selected) => handleInputChange({
                      target: { name: 'civil_status', value: selected.value }
                    })}
                    options={civilStatusOptions}
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="House No" name="house_no" value={formData.house_no} onChange={handleInputChange} required />
                  <InputField label="Street" name="street" value={formData.street} onChange={handleInputChange} required />
                  <InputField label="Barangay" name="barangay" value={formData.barangay} onChange={handleInputChange} required />
                  <InputField label="Municipality" name="municipality" value={formData.municipality} onChange={handleInputChange} required />
                  <InputField label="ZIP Code" name="zip_code" value={formData.zip_code} onChange={handleInputChange} required />
                </div>
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

