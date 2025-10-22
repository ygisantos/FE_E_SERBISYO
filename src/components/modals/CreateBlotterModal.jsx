import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { createBlotter } from "../../api/blotterApi";
import { toast } from "react-toastify";
import { Upload, X } from 'lucide-react';

const initialFormState = {
  complainant_name: "",
  respondent_name: "",
  additional_respondent: [],
  complaint_details: "",
  relief_sought: "",
  date_created: new Date().toISOString().split("T")[0],
  date_filed: new Date().toISOString().split("T")[0],
  received_by: "Barangay Secretary",
  case_type: "",
  status: "filed",
  created_by: null,
  proofs: [] // Add proofs array for attachments
};

const caseTypes = [
  "Utang",
  "Away Pamilya",
  "Noise Complaint",
  "Property Dispute",
  "Physical Injury",
  "Theft",
  "Harassment",
  "Other",
];

const CreateBlotterModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [additionalRespondent, setAdditionalRespondent] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRespondent = () => {
    if (additionalRespondent.trim()) {
      setFormData((prev) => ({
        ...prev,
        additional_respondent: [...prev.additional_respondent, additionalRespondent.trim()],
      }));
      setAdditionalRespondent("");
    }
  };

  const handleRemoveRespondent = (index) => {
    setFormData((prev) => ({
      ...prev,
      additional_respondent: prev.additional_respondent.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      // Append basic fields
      Object.keys(formData).forEach(key => {
        if (key !== 'proofs' && key !== 'additional_respondent') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append additional respondents as JSON
      formDataToSend.append('additional_respondent', JSON.stringify(formData.additional_respondent));

      // Append proof files
      files.forEach(file => {
        formDataToSend.append('proofs[]', file);
      });

      const response = await createBlotter(formDataToSend);
      toast.success("Sumbong created successfully");
      setFormData(initialFormState);
      setFiles([]);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || "Failed to create sumbong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Magsumbong"
      modalClass="max-w-3xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Case Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Case Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Complainant Name</label>
              <input
                type="text"
                value={formData.complainant_name}
                onChange={(e) => setFormData({ ...formData, complainant_name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Case Type</label>
              <select
                value={formData.case_type}
                onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                required
              >
                <option value="">Select Case Type</option>
                {caseTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Respondent Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Respondent Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Main Respondent</label>
            <input
              type="text"
              value={formData.respondent_name}
              onChange={(e) => setFormData({ ...formData, respondent_name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          {/* Additional Respondents Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Additional Respondents</label>
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
            <div className="flex gap-2">
              <input
                type="text"
                value={additionalRespondent}
                onChange={(e) => setAdditionalRespondent(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Add another respondent"
              />
              <button
                onClick={handleAddRespondent}
                className="px-3 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Complaint Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Complaint Details</h3>
          <textarea
            value={formData.complaint_details}
            onChange={(e) => setFormData({ ...formData, complaint_details: e.target.value })}
            rows={4}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Describe the complaint in detail..."
            required
          />
        </div>

        {/* Relief Sought */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Relief Sought</h3>
          <textarea
            value={formData.relief_sought}
            onChange={(e) => setFormData({ ...formData, relief_sought: e.target.value })}
            rows={3}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="What resolution are you seeking?"
            required
          />
        </div>

        {/* File Attachments */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Proof Attachments (Optional)</h3>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Image files only (Max. 5MB each)</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 ml-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateBlotterModal;