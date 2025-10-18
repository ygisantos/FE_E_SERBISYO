import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import InputField from '../Input/InputField';
import { showCustomToast } from '../Toast/CustomToast';
import ConfirmationModal from './ConfirmationModal';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import { extractPlaceholders } from '../../api/documentApi';

const RequestDocumentModal = ({ 
  isOpen, 
  onClose, 
  document,
  onSubmit,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    document: '',
    purpose: '',
    requirements: [],
    placeholders: {} // Add placeholders to form data
  });
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [placeholders, setPlaceholders] = useState([]);
  const [loadingPlaceholders, setLoadingPlaceholders] = useState(false);

  // Reset form when modal opens or document changes
  useEffect(() => {
    if (document) {
      setFormData({
        document: document.id,
        purpose: '',
        requirements: [],
        placeholders: {}
      });
      setPlaceholders([]);
      
      // Fetch placeholders if document has template
      if (document.template_path) {
        fetchPlaceholders(document.id);
      }
    }
    setHasChanges(false);
  }, [document, isOpen]);

  const fetchPlaceholders = async (documentId) => {
    try {
      setLoadingPlaceholders(true);
      const response = await extractPlaceholders(documentId);
      
      if (response.placeholders && response.placeholders.length > 0) {
        setPlaceholders(response.placeholders);
        
        // Initialize placeholder values in form data
        const initialPlaceholders = {};
        response.placeholders.forEach(placeholder => {
          initialPlaceholders[placeholder] = '';
        });
        
        setFormData(prev => ({
          ...prev,
          placeholders: initialPlaceholders
        }));
      }
    } catch (error) {
      console.error('Error fetching placeholders:', error);
      // Don't show error toast as placeholders are optional
    } finally {
      setLoadingPlaceholders(false);
    }
  };

  const handlePurposeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      purpose: e.target.value 
    }));
    setHasChanges(true);
  };

  const handlePlaceholderChange = (placeholder, value) => {
    setFormData(prev => ({
      ...prev,
      placeholders: {
        ...prev.placeholders,
        [placeholder]: value
      }
    }));
    setHasChanges(true);
  };

  const formatPlaceholderLabel = (placeholder) => {
    // Convert snake_case to Title Case
    return placeholder
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleFileUpload = (requirementId, file) => {
    if (!file) return;

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
        ...prev.requirements.filter(r => r.requirement_id !== requirementId),
        { requirement_id: requirementId, file }
      ]
    }));
    setHasChanges(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmDiscard(true);
    } else {
      onClose();
    }
  };

  const validateForm = () => {
    // Check if purpose is provided
    if (!formData.purpose?.trim()) {
      showCustomToast('Please enter a purpose', 'error');
      return false;
    }

    // Check if all required documents are uploaded
    const missingRequirements = document?.requirements?.filter(
      req => !formData.requirements.find(r => r.requirement_id === req.id)
    );

    if (missingRequirements?.length > 0) {
      showCustomToast(
        `Please upload all required documents: ${missingRequirements.map(r => r.name).join(', ')}`, 
        'error'
      );
      return false;
    }

    // Check if all placeholders are filled (if any exist)
    const emptyPlaceholders = placeholders.filter(
      placeholder => !formData.placeholders[placeholder]?.trim()
    );

    if (emptyPlaceholders.length > 0) {
      showCustomToast(
        `Please fill in all required fields: ${emptyPlaceholders.map(formatPlaceholderLabel).join(', ')}`,
        'error'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const requestFormData = new FormData();
    requestFormData.append('document', document.id);
    requestFormData.append('purpose', formData.purpose);

    // Add placeholder data as "information" object
    if (placeholders.length > 0) {
      requestFormData.append('information', JSON.stringify(formData.placeholders));
    }

    // Add requirements
    formData.requirements.forEach((req, index) => {
      requestFormData.append(`requirements[${index}][requirement_id]`, req.requirement_id);
      requestFormData.append(`requirements[${index}][file]`, req.file);
    });

    setPendingFormData(requestFormData);
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = async () => {
    try {
      await onSubmit(pendingFormData);
      setShowConfirmSubmit(false);
      onClose();
    } catch (error) {
      showCustomToast(error.message || 'Failed to submit request', 'error');
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={`Request ${document?.document_name || 'Document'}`}
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || loadingPlaceholders}
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
            {document?.contact_no && (
              <p className="text-xs text-gray-500 mt-2">
                Contact: {document.contact_no}
              </p>
            )}
          </div>

          {/* Purpose Field*/}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Request Purpose</h4>
            <InputField
              label="Purpose"
              placeholder="Enter the purpose for requesting this document"
              value={formData.purpose}
              onChange={handlePurposeChange}
              className="w-full"
              required
            />
          </div>

          {/* Dynamic Placeholder Fields */}
          {loadingPlaceholders && (
            <div className="flex items-center justify-center py-4">
              <FaSpinner className="animate-spin mr-2" />
              <span className="text-sm text-gray-600">Loading document fields...</span>
            </div>
          )}

          {placeholders.length > 0 && !loadingPlaceholders && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Document Information</h4>
              <div className="space-y-3">
                {placeholders.map((placeholder) => (
                  <div key={placeholder}>
                    <InputField
                      label={formatPlaceholderLabel(placeholder)}
                      placeholder={`Enter ${formatPlaceholderLabel(placeholder).toLowerCase()}`}
                      value={formData.placeholders[placeholder] || ''}
                      onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

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
                    className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    <FaUpload className="w-4 h-4" />
                    {formData.requirements.find(r => r.requirement_id === req.id) 
                      ? 'Change File' 
                      : 'Upload File'
                    }
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

      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        onConfirm={confirmSubmit}
        title="Submit Request"
        message="Are you sure you want to submit this document request?"
        confirmText="Submit"
        cancelText="Cancel"
        type="warning"
      />

      {/* Discard Changes Modal */}
      <ConfirmationModal
        isOpen={showConfirmDiscard}
        onClose={() => setShowConfirmDiscard(false)}
        onConfirm={() => {
          setShowConfirmDiscard(false);
          setHasChanges(false);
          onClose();
        }}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        cancelText="Keep Editing"
        type="warning"
      />
    </>
  );
};

export default RequestDocumentModal;
