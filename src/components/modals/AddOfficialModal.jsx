import React, { useState, useRef } from "react";
import Button from "../reusable/Button";
import Modal from "../Modal/Modal";
import FormInput from '../Input/InputField';
import { FaUser, FaBriefcase, FaCalendarAlt, FaImage, FaCloudUploadAlt, FaSearch, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const AddOfficialModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
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
      const fullName = `${formData.first_name} ${formData.middle_name ? formData.middle_name + ' ' : ''}${formData.last_name}`;
      const apiData = {
        full_name: fullName.trim(),
        position: formData.position,
        image: formData.image_path,
        term_start: formData.term_start,
        term_end: formData.term_end,
        status: formData.status,
      };
      
      await onSubmit(apiData);
      onClose();
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

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button
        type="button"
        onClick={onClose}
        variant="secondary"
        className="px-5 py-2 text-sm font-medium hover:bg-red-700"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="addOfficialForm"
        className="px-5 py-2 text-sm font-medium bg-red-800 hover:bg-red-700 text-white shadow-sm"
      >
        Save Changes
      </Button>
    </div>
  );

  const ImagePreviewModal = () => (
    <Modal
      isOpen={showPreview}
      onClose={() => setShowPreview(false)}
      title="Profile Photo Preview"
      modalClass="max-w-md"
    >
      <div className="relative flex flex-col items-center">
        <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
          <img
            src={previewImage}
            alt="Full Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          type="button"
          onClick={() => setShowPreview(false)}
          className="mt-6 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Close Preview
        </Button>
      </div>
    </Modal>
  );

  const renderImageSection = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Profile Photo
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Upload a square photo in JPG or PNG format
        </p>
      </div>
      <div
        className="relative group"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-48 h-48 mx-auto rounded-full border-2 border-dashed border-gray-300 group-hover:border-red-500 transition-all bg-white overflow-hidden">
          {previewImage ? (
            <div className="relative w-full h-full group">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="p-2 bg-white rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                  title="View photo"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this photo?')) {
                      setPreviewImage(null);
                      setFormData({ ...formData, image_path: "" });
                    }
                  }}
                  className="p-2 bg-white rounded-full hover:bg-red-50 text-red-500 transition-colors"
                  title="Remove photo"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-3 rounded-full bg-gray-50 text-gray-400 group-hover:text-red-500 transition-colors">
                <FaCloudUploadAlt className="w-7 h-7" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Click to upload
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="image_path"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Add New Official" footer={modalFooter}>
        <form id="addOfficialForm" onSubmit={handleSubmit} className="space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-600">
              Complete the form below to add a new barangay official. Required fields are marked with an asterisk (*).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Profile Photo Section */}
            <div className="flex justify-center">
              {renderImageSection()}
            </div>

            {/* Form Fields Section - Vertical Layout */}
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="space-y-4">
                <FormInput
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  icon={FaUser}
                  placeholder="Enter first name"
                  required
                  error={errors.first_name}
                />

                <FormInput
                  label="Middle Name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  icon={FaUser}
                  placeholder="Enter middle name (optional)"
                />

                <FormInput
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  icon={FaUser}
                  placeholder="Enter last name"
                  required
                  error={errors.last_name}
                />
              </div>

              {/* Other Fields */}
              <div className="space-y-4">
                <FormInput
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  icon={FaBriefcase}
                  placeholder="Enter position"
                  required
                  error={errors.position}
                />

                <FormInput
                  label="Term Start"
                  name="term_start"
                  type="date"
                  value={formData.term_start}
                  onChange={handleChange}
                  icon={FaCalendarAlt}
                  required
                  error={errors.term_start}
                />

                <FormInput
                  label="Term End"
                  name="term_end"
                  type="date"
                  value={formData.term_end}
                  onChange={handleChange}
                  icon={FaCalendarAlt}
                  required
                  error={errors.term_end}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
      {showPreview && <ImagePreviewModal />}
    </>
  );
};

export default AddOfficialModal;
