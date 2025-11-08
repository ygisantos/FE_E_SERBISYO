import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { createBlotter } from "../../api/blotterApi";
import { showCustomToast } from "../Toast/CustomToast";
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import Select from '../reusable/Select';
import { caseTypes } from '../../constants/caseTypes';
import { useUser } from '../../contexts/UserContext';  

const initialFormState = {
  complainant_name: "",
  respondent_name: "",
  additional_respondent: [],
  complaint_details: "",
  relief_sought: "",
  date_created: new Date().toISOString().split("T")[0],
  date_filed: new Date().toISOString().split("T")[0],
  received_by: "", // Empty since it will be set when staff updates status
  case_type: "",
  status: "filed",
  created_by: null,
  attached_proof: null
};

const CreateBlotterModal = ({ isOpen, onClose, onSuccess, createdBy }) => {
  const { currentUser } = useUser();  

  // Get full name from currentUser
  const getFullName = () => {
    if (!currentUser) return '';
    
    return `${currentUser.first_name}${currentUser.middle_name ? ' ' + currentUser.middle_name : ''}${currentUser.last_name ? ' ' + currentUser.last_name : ''}${currentUser.suffix ? ' ' + currentUser.suffix : ''}`
      .trim();
  };

  // Initialize formData with currentUser's name
  const [formData, setFormData] = useState({
    ...initialFormState,
    complainant_name: getFullName(),
    created_by: currentUser?.id
  });

  const [additionalRespondent, setAdditionalRespondent] = useState("");
  const [files, setFiles] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddRespondent = () => {
    if (additionalRespondent.trim()) {
      setFormData(prev => ({
        ...prev,
        additional_respondent: [...prev.additional_respondent, additionalRespondent.trim()]
      }));
      setAdditionalRespondent('');
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setFiles([]);
    setHasChanges(false);
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors = {};
    let errorMessage = '';

    // Required field validations
    if (!formData.complainant_name?.trim()) {
      newErrors.complainant_name = 'Complainant name is required';
      errorMessage = 'Complainant name is required';
    }

    if (!formData.respondent_name?.trim()) {
      newErrors.respondent_name = 'Respondent name is required';
      errorMessage = errorMessage || 'Respondent name is required';
    }

    if (!formData.complaint_details?.trim()) {
      newErrors.complaint_details = 'Complaint details are required';
      errorMessage = errorMessage || 'Complaint details are required';
    }

    if (!formData.relief_sought?.trim()) {
      newErrors.relief_sought = 'Relief sought is required';
      errorMessage = errorMessage || 'Relief sought is required';
    }

    if (!formData.case_type) {
      newErrors.case_type = 'Case type is required';
      errorMessage = errorMessage || 'Case type is required';
    }

    // Set errors and show toast if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showCustomToast(errorMessage, 'error');
      return false;
    }

    return true;
  };

  const handleSubmitAttempt = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmedSubmit = async () => {
    try {
      // Validate form before proceeding
      if (!validateForm()) {
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();
      
       const dataToSubmit = {
        ...formData,
        created_by: createdBy,
        status: 'filed'
      };

      // Add fields to FormData
      Object.keys(dataToSubmit).forEach(key => {
        if (key === 'additional_respondent') {
          // Handle additional_respondent as array by appending each value separately
          const respondents = dataToSubmit.additional_respondent || [];
          respondents.forEach((respondent, index) => {
            formDataToSend.append(`additional_respondent[${index}]`, respondent);
          });
        } else if (key !== 'attached_proof') {
          formDataToSend.append(key, dataToSubmit[key]);
        }
      });

      // Add attached_proof if exists
      if (files && files[0]) {
        const file = files[0];
        formDataToSend.append('attached_proof', file, file.name);
      }

      const response = await createBlotter(formDataToSend);
      showCustomToast("Sumbong created successfully", 'success');
      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Handle API validation errors
      if (error.errors) {
        const newErrors = {};
        Object.entries(error.errors).forEach(([field, messages]) => {
          newErrors[field] = messages[0];
        });
        setErrors(newErrors);
        showCustomToast(Object.values(error.errors)[0][0], 'error');
      } else {
        showCustomToast(error.message || "Failed to create sumbong", 'error');
      }
    } finally {
      setShowSubmitModal(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrors(prev => ({ ...prev, attached_proof: null }));
    
    if (file) {


      // Validate file type - more lenient check
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/jpg', 'application/jpeg'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      const validExts = ['jpeg', 'jpg', 'png', 'gif'];
      const maxSize = 4 * 1024 * 1024; // 4MB

      // More lenient validation
      const isValidType = validTypes.includes(file.type) || file.type.startsWith('image/');
      const isValidExt = validExts.includes(fileExt);

      if (!isValidType || !isValidExt) {
        setErrors(prev => ({
          ...prev,
          attached_proof: "The attached proof must be an image file (jpeg, png, jpg, gif)"
        }));
        showCustomToast("Please upload a valid image file (JPEG, PNG, JPG, or GIF)", "error");
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          attached_proof: "File size must not exceed 4MB"
        }));
        showCustomToast("File size must not exceed 4MB", "error");
        e.target.value = '';
        return;
      }

      setFiles([file]);
      // Also set in formData
      setFormData(prev => ({
        ...prev,
        attached_proof: file
      }));
    }
  };

  const removeFile = () => {
    setFiles([]);
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      resetForm();
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Magsumbong"
        modalClass="max-w-2xl w-full mx-4 md:mx-auto"
        footer={
          <div className="flex justify-end gap-2 px-4 py-3 sm:px-6">
            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAttempt}
              className="px-3 py-1.5 text-xs sm:text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        }
      >
        <form className="p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            {/* Complainant Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Complainant Information</h3>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Complainant Name
                </label>
                <input
                  type="text"
                  name="complainant_name"
                  value={formData.complainant_name}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
            </div>

            {/* Respondent Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Respondent Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Main Respondent
                  </label>
                  <input
                    type="text"
                    name="respondent_name"
                    value={formData.respondent_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 ${
                      errors.respondent_name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-red-500'
                    }`}
                    required
                  />
                  {errors.respondent_name && (
                    <span className="text-xs text-red-500">{errors.respondent_name}</span>
                  )}
                </div>

                {/* Additional Respondents Section */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Additional Respondents (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={additionalRespondent}
                      onChange={(e) => setAdditionalRespondent(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Enter name"
                    />
                    <button
                      type="button"
                      onClick={handleAddRespondent}
                      className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Add
                    </button>
                  </div>
                  {formData.additional_respondent.length > 0 && (
                    <div className="space-y-2">
                      {formData.additional_respondent.map((name, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 text-sm text-gray-600">{name}</span>
                          <button
                            onClick={() => handleRemoveRespondent(index)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Case Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Case Information</h3>
              <div className="space-y-4">
                <Select
                  label="Case Type"
                  value={caseTypes.find(type => type.value === formData.case_type)}
                  onChange={(selected) => {
                    setFormData(prev => ({
                      ...prev,
                      case_type: selected?.value || ""
                    }));
                    setHasChanges(true);
                  }}
                  options={caseTypes}
                  placeholder="Select Case Type"
                  required
                  error={errors.case_type}
                  className="text-xs"
                />

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Complaint Details
                  </label>
                  <textarea
                    name="complaint_details"
                    value={formData.complaint_details}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 ${
                      errors.complaint_details 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-red-500'
                    }`}
                    required
                  />
                  {errors.complaint_details && (
                    <span className="text-xs text-red-500">{errors.complainant_name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Relief Sought
                  </label>
                  <textarea
                    name="relief_sought"
                    value={formData.relief_sought}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 ${
                      errors.relief_sought 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-red-500'
                    }`}
                    required
                  />
                  {errors.relief_sought && (
                    <span className="text-xs text-red-500">{errors.relief_sought}</span>
                  )}
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Proof Attachment (Optional)
              </h3>
              <div className="space-y-4">
                {files.length === 0 ? (
                  <div className="relative">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          JPEG, PNG or JPG (MAX. 4MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>Proof of evidence is optional but recommended</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {files[0].name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(files[0].size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="ml-4 p-1 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmedSubmit}
        title="Submit Sumbong"
        message="Are you sure you want to submit this sumbong?"
        confirmText="Submit"
        cancelText="Cancel"
      />

      {/* Discard Changes Modal */}
      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          resetForm();
          onClose();
          setShowDiscardModal(false);
        }}
        title="Discard Changes"
        message="Are you sure you want to discard your changes?"
        confirmText="Discard"
        cancelText="Keep Editing"
        type="warning"
      />
    </>
  );
};

export default CreateBlotterModal;