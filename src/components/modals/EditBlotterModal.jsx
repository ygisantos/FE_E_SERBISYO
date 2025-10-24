import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { updateBlotter } from "../../api/blotterApi";
import { showCustomToast } from "../Toast/CustomToast";
import { X } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import InputField from '../Input/InputField';
import Select from '../reusable/Select';
import { caseTypes } from '../../constants/caseTypes';

const EditBlotterModal = ({ isOpen, onClose, data, onSuccess }) => {
  const [formData, setFormData] = useState({
    complainant_name: "",
    respondent_name: "",
    additional_respondent: [],
    complaint_details: "",
    relief_sought: "",
    case_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [additionalRespondentInput, setAdditionalRespondentInput] = useState("");

  useEffect(() => {
    if (data) {
      const newFormData = {
        complainant_name: data.complainant_name || "",
        respondent_name: data.respondent_name || "",
        additional_respondent: Array.isArray(data.additional_respondent) 
          ? data.additional_respondent 
          : [],
        complaint_details: data.complaint_details || "",
        relief_sought: data.relief_sought || "",
        case_type: data.case_type || "",
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleSelectChange = (selected) => {
    setFormData(prev => ({
      ...prev,
      case_type: selected?.value || ""
    }));
    setHasChanges(true);
  };

  const handleAddRespondent = () => {
    if (additionalRespondentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        additional_respondent: [...prev.additional_respondent, additionalRespondentInput.trim()]
      }));
      setAdditionalRespondentInput("");
    }
  };

  const handleRemoveRespondent = (index) => {
    setFormData(prev => ({
      ...prev,
      additional_respondent: prev.additional_respondent.filter((_, i) => i !== index)
    }));
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setFormData({
      complainant_name: "",
      respondent_name: "",
      additional_respondent: [],
      complaint_details: "",
      relief_sought: "",
      case_type: "",
    });
    setErrors({});
    setHasChanges(false);
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};
    let toastMessage = '';
    
    // Required field validation
    if (!formData.complainant_name) {
      newErrors.complainant_name = 'Complainant name is required';
      toastMessage = 'Complainant name is required';
    }
    if (!formData.respondent_name) {
      newErrors.respondent_name = 'Respondent name is required';
      toastMessage = toastMessage || 'Respondent name is required';
    }
    if (!formData.complaint_details) {
      newErrors.complaint_details = 'Complaint details are required';
      toastMessage = toastMessage || 'Complaint details are required';
    }
    if (!formData.relief_sought) {
      newErrors.relief_sought = 'Relief sought is required';
      toastMessage = toastMessage || 'Relief sought is required';
    }
    if (!formData.case_type) {
      newErrors.case_type = 'Case type is required';
      toastMessage = toastMessage || 'Case type is required';
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
      setShowSaveModal(true);
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        title="Edit Sumbong"
        modalClass="max-w-2xl w-full mx-4 md:mx-auto"
        footer={
          <div className="flex justify-end gap-2 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="editBlotterForm"
              disabled={loading}
              className="px-3 py-1.5 text-xs sm:text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        <form id="editBlotterForm" onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            {/* Complainant Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Complainant Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Complainant Name"
                  name="complainant_name"
                  value={formData.complainant_name}
                  onChange={handleChange}
                  required
                  error={errors.complainant_name}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Respondent Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Respondent Information</h3>
              <div className="space-y-4">
                <InputField
                  label="Respondent Name"
                  name="respondent_name"
                  value={formData.respondent_name}
                  onChange={handleChange}
                  required
                  error={errors.respondent_name}
                  className="text-xs"
                />

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Additional Respondents (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={additionalRespondentInput}
                      onChange={(e) => setAdditionalRespondentInput(e.target.value)}
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
                    <div className="mt-2 space-y-2">
                      {formData.additional_respondent.map((respondent, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                        >
                          <span className="text-xs text-gray-700">{respondent}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRespondent(index)}
                            className="text-red-500 hover:text-red-700"
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
                <div>
                  <Select
                    label="Case Type"
                    value={caseTypes.find(type => type.value === formData.case_type)}
                    onChange={handleSelectChange}
                    options={caseTypes}
                    placeholder="Select Case Type"
                    required
                    error={errors.case_type}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Complaint Details
                  </label>
                  <textarea
                    name="complaint_details"
                    value={formData.complaint_details}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                  {errors.complaint_details && (
                    <span className="text-xs text-red-500">{errors.complaint_details}</span>
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
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                  {errors.relief_sought && (
                    <span className="text-xs text-red-500">{errors.relief_sought}</span>
                  )}
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
        onConfirm={() => {
          setShowDiscardModal(false);
          resetAndClose();
        }}
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
        onConfirm={async () => {
          setLoading(true);
          try {
            const response = await updateBlotter(data.case_number, formData);
            if (response.success) {
              showCustomToast("Blotter updated successfully", "success");
              onSuccess(response.data);
              setShowSaveModal(false);
              resetAndClose();
            }
          } catch (error) {
            showCustomToast(error.message || "Failed to update blotter", "error");
          } finally {
            setLoading(false);
          }
        }}
        title="Save Changes"
        message="Are you sure you want to save these changes?"
        confirmText="Save"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
};

export default EditBlotterModal;