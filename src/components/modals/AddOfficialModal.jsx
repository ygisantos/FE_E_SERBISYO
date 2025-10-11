import React, { useState, useRef } from "react";
import Modal from "../Modal/Modal";
import FormInput from '../reusable/InputField';
import Select from "../reusable/Select";
import { FaUpload, FaImage, FaTrash } from "react-icons/fa";

const AddOfficialModal = ({ isOpen, onClose, onSubmit }) => {
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
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.term_start) {
      newErrors.term_start = 'Term start date is required';
    }
    
    if (!formData.term_end) {
      newErrors.term_end = 'Term end date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      const fullName = `${formData.first_name} ${formData.middle_name ? formData.middle_name + ' ' : ''}${formData.last_name}${formData.suffix ? ' ' + formData.suffix : ''}`;
      
      formDataToSend.append('full_name', fullName.trim());
      formDataToSend.append('position', formData.position);
      formDataToSend.append('term_start', formData.term_start);
      formDataToSend.append('term_end', formData.term_end);
      formDataToSend.append('status', 'active');
      
      if (formData.image_path) {
        formDataToSend.append('image', formData.image_path);
      }
      
      try {
        await onSubmit(formDataToSend);
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image_path: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, image_path: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
        className="relative group w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-red-500 transition-colors duration-200"
        onClick={() => fileInputRef.current?.click()}
      >
        {previewImage ? (
          <>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(true);
                  }}
                  className="p-1.5 bg-white rounded-full hover:bg-gray-100"
                >
                  <FaImage className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Remove this photo?')) {
                      setPreviewImage(null);
                      setFormData({ ...formData, image_path: null });
                    }
                  }}
                  className="p-1.5 bg-white rounded-full hover:bg-red-100"
                >
                  <FaTrash className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          </>
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
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Official"
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
            type="submit"
            form="addOfficialForm"
            className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Save Official
          </button>
        </div>
      }
    >
      <form id="addOfficialForm" onSubmit={handleSubmit} className="p-4 space-y-4">
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
                onChange={handleChange}
                required
                error={errors.first_name}
                placeholder="First name"
                className="text-xs"
              />
              <FormInput
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Optional"
                className="text-xs"
              />
              <FormInput
                label="Suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                placeholder="Jr, Sr, III, etc."
                className="text-xs"
              />
            </div>

            <Select
              label="Position"
              value={positionOptions.find(opt => opt.value === formData.position)}
              onChange={(selected) => handleChange({
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
                onChange={handleChange}
                required
                error={errors.term_start}
                className="text-xs"
              />
              <FormInput
                label="Term End"
                name="term_end"
                type="date"
                value={formData.term_end}
                onChange={handleChange}
                required
                error={errors.term_end}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddOfficialModal;
     