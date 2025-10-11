import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal/Modal";
import FormInput from '../reusable/InputField';
import Select from "../reusable/Select";
import { FaUser, FaBriefcase, FaCalendarAlt, FaUpload, FaImage, FaTrash } from "react-icons/fa";

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
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (official) {
      // Split full name into components
      const nameParts = official.full_name.split(' ');
      const lastName = nameParts.pop();
      const firstName = nameParts.shift();
      const middleAndSuffix = nameParts.join(' ');
      
      // Check for common suffixes
      const suffixes = ['Jr', 'Sr', 'II', 'III', 'IV'];
      let middleName = middleAndSuffix;
      let suffix = '';
      
      suffixes.forEach(s => {
        if (middleAndSuffix.endsWith(s)) {
          suffix = s;
          middleName = middleAndSuffix.slice(0, -(s.length + 1)).trim();
        }
      });

      setFormData({
        first_name: firstName || '',
        middle_name: middleName || '',
        last_name: lastName || '',
        suffix: suffix || '',
        position: official.position,
        term_start: official.term_start?.split('T')[0],
        term_end: official.term_end?.split('T')[0],
        status: official.status,
      });

      if (official.image_path) {
        const imgUrl = `${import.meta.env.VITE_API_BASE_URL}/${official.image_path}`;
        setPreviewImage(imgUrl);
      }
    }
  }, [official]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
                      setFormData(prev => ({ ...prev, image_path: null }));
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
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Edit Official"
        modalClass="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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
