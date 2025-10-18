import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { updateDocument, getDocumentById } from '../../api/documentApi';
import { showCustomToast } from '../Toast/CustomToast';
import { FaPlus, FaTrash} from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal'; // Add this import

const EditDocumentModal = ({ isOpen, onClose, documentId, onSuccess }) => {
  const [formData, setFormData] = useState({
    document_name: '',
    description: '',
    status: 'active',
    requirements: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add originalData state to track changes
  const [originalData, setOriginalData] = useState(null);

  const loadDocument = async () => {
    if (!documentId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getDocumentById(documentId);
      const documentData = {
        document_name: response.document_name || '',
        description: response.description || '',
        status: response.status || 'active',
        requirements: response.requirements?.map(req => ({
          id: req.id,
          name: req.name,
          description: req.description
        })) || []
      };
      setFormData(documentData);
      setOriginalData(documentData); // Save original data for comparison
    } catch (err) {
      setError(err.message || 'Failed to load document');
      showCustomToast(err.message || 'Failed to load document', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load document details when modal opens
  useEffect(() => {
    if (isOpen && documentId) {
      loadDocument();
    }
  }, [isOpen, documentId]);

  useEffect(() => {
    if (documentId) {
      setLoading(false);
    }
  }, [documentId]);

  // Update hasChanges to compare with originalData
  const hasChanges = () => {
    if (!originalData) return false;
    
    return JSON.stringify({
      document_name: originalData.document_name,
      description: originalData.description,
      status: originalData.status,
      requirements: originalData.requirements
    }) !== JSON.stringify({
      document_name: formData.document_name,
      description: formData.description,
      status: formData.status,
      requirements: formData.requirements
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Validate form data
    if (!formData.document_name || !formData.description) {
      showCustomToast('Please fill in all required fields', 'error');
      return;
    }

    if (!hasChanges()) {
      showCustomToast('No changes to save', 'info');
      onClose();
      return;
    }

    setShowSubmitConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsLoading(true);
      await updateDocument(documentId, formData);
      showCustomToast('Document updated successfully', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showCustomToast(error.message || 'Failed to update document', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (hasChanges()) {
      setShowDiscardConfirmation(true);
    } else {
      onClose();
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, { name: '', description: '' }]
    }));
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Document">
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
        </div>
      </Modal>
    );
  }

  // Show error state
  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Error">
        <div className="p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 text-sm text-white bg-red-900 rounded-lg hover:bg-red-800"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Document"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !hasChanges()}
              className={`px-4 py-2 text-sm text-white rounded-lg ${
                hasChanges() 
                  ? 'bg-red-900 hover:bg-red-800' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="p-6 space-y-6">
          {/* Main Document Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Document Name</label>
              <input
                type="text"
                value={formData.document_name}
                onChange={(e) => setFormData(prev => ({ ...prev, document_name: e.target.value }))}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter document name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder="Enter document description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Requirements</h3>
              <button
                type="button"
                onClick={addRequirement}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaPlus className="w-3 h-3 mr-1.5" />
                Add Requirement
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div 
                  key={index} 
                  className="group p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <input
                        value={req.name}
                        onChange={(e) => {
                          const newReqs = [...formData.requirements];
                          newReqs[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, requirements: newReqs }));
                        }}
                        placeholder="Requirement name"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                      <input
                        value={req.description || ''}
                        onChange={(e) => {
                          const newReqs = [...formData.requirements];
                          newReqs[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, requirements: newReqs }));
                        }}
                        placeholder="Brief description (optional)"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {formData.requirements.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">No requirements added yet</p>
                  <button
                    onClick={addRequirement}
                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                  >
                    Add your first requirement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Only render confirmation modals if there are changes */}
      {hasChanges() && (
        <>
          <ConfirmationModal
            isOpen={showSubmitConfirmation}
            onClose={() => setShowSubmitConfirmation(false)}
            onConfirm={handleConfirmSubmit}
            title="Submit Changes"
            message="Are you sure you want to save these changes?"
            confirmText="Save Changes"
            type="warning"
          />

          <ConfirmationModal
            isOpen={showDiscardConfirmation}
            onClose={() => setShowDiscardConfirmation(false)}
            onConfirm={() => {
              setShowDiscardConfirmation(false);
              onClose();
            }}
            title="Discard Changes"
            message="You have unsaved changes. Are you sure you want to discard them?"
            confirmText="Discard Changes"
            type="danger"
          />
        </>
      )}
    </>
  );
};

export default EditDocumentModal;
