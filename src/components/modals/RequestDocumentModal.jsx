import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { FaCloudUploadAlt } from 'react-icons/fa';

const RequestDocumentModal = ({ 
  isOpen, 
  onClose, 
  document,
  onSubmit,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    document: document?.id,
    requirements: [],
    purpose: ''
  });

  const handleFileUpload = (requirementId, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showCustomToast('File size should not exceed 5MB', 'error');
        return;
      }

      if (file.type !== 'application/pdf') {
        showCustomToast('Only PDF files are allowed', 'error');
        return;
      }

      setFormData(prev => ({
        ...prev,
        requirements: [
          ...prev.requirements.filter(req => req.requirement_id !== requirementId),
          { requirement_id: requirementId, file }
        ]
      }));
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('document', formData.document);
    formDataToSend.append('purpose', formData.purpose);
    
    formData.requirements.forEach((req, index) => {
      formDataToSend.append(`requirements[${index}][requirement_id]`, req.requirement_id);
      formDataToSend.append(`requirements[${index}][file]`, req.file);
    });

    onSubmit(formDataToSend);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Document"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.purpose || formData.requirements.length === 0 || isLoading}
            className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      }
    >
      <div className="p-4 space-y-6">
        {/* Document Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900">{document?.document_name}</h4>
          <p className="text-sm text-gray-600 mt-1">{document?.description}</p>
        </div>

        {/* Purpose Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Purpose *
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            rows={3}
            placeholder="State your purpose for requesting this document"
          />
        </div>

        {/* Requirements */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Requirements</h4>
          {document?.requirements?.map((req) => (
            <div key={req.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm text-gray-700 mb-2">
                {req.name} *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(req.id, e.target.files[0])}
                  className="hidden"
                  id={`req_${req.id}`}
                  accept=".pdf"
                />
                <label
                  htmlFor={`req_${req.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <FaCloudUploadAlt className="w-4 h-4" />
                  Choose PDF File
                </label>
                {formData.requirements.find(r => r.requirement_id === req.id) && (
                  <span className="text-xs text-green-600">✓ File selected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default RequestDocumentModal;
