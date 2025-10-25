import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import InputField from '../Input/InputField';
import { showCustomToast } from '../Toast/CustomToast';
import ConfirmationModal from './ConfirmationModal';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import { extractPlaceholders } from '../../api/documentApi';
import { isSystemKeyword, SYSTEM_KEYWORDS, CHECKBOX_GROUPS, TITLE_OPTIONS } from '../../utils/documentKeywords';
import Select from '../reusable/Select';

const RequestDocumentModal = ({ 
  isOpen, 
  onClose, 
  document,
  onSubmit,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    document: '',
    requirements: [],
    placeholders: {}
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
        
        const initialPlaceholders = {};
        response.placeholders.forEach(placeholder => {
          initialPlaceholders[placeholder] = placeholder.startsWith('CHECK_') ? 'false' : '';
        });
        
         setFormData(prev => ({
          ...prev,
          placeholders: initialPlaceholders
        }));
      }
    } catch (error) {
      console.error('Error fetching placeholders:', error);
    } finally {
      setLoadingPlaceholders(false);
    }
  };

  const handlePlaceholderChange = (placeholder, event) => {
    if (placeholder === 'DATE_TODAY') {
      return;
    }

    if (event?.target?.type === 'checkbox') {
      const group = Object.entries(CHECKBOX_GROUPS).find(([_, g]) => 
        Object.keys(g.checkboxes).includes(placeholder)
      );

      if (group) {
        const [groupKey] = group;
        const groupCheckboxes = Object.keys(CHECKBOX_GROUPS[groupKey].checkboxes);
        
        setFormData(prev => {
          const newPlaceholders = { ...prev.placeholders };
          // Clear all checkboxes in this group
          groupCheckboxes.forEach(key => {
            newPlaceholders[key] = '';
          });
          // Set the selected checkbox
          newPlaceholders[placeholder] = event.target.checked ? '✓' : '';
          return {
            ...prev,
            placeholders: newPlaceholders
          };
        });
      }
    } else {
      // Handle regular input fields
      const newValue = event?.target?.value || event;
      setFormData(prev => ({
        ...prev,
        placeholders: {
          ...prev.placeholders,
          [placeholder]: newValue
        }
      }));
    }
    
    setHasChanges(true);
  };

  const formatPlaceholderLabel = (placeholder) => {
    // Hide _TL suffix from labels
    const baseName = placeholder.replace('_TL', '');
    
    return baseName
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
    // Add birth date validation
    const birthDateFields = Object.entries(formData.placeholders)
      .filter(([key]) => key.includes('BIRTH_DATE'));

    for (const [key, value] of birthDateFields) {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();

      if (date > today) {
        showCustomToast('Birth date cannot be in the future', 'error');
        return false;
      }

      if (age > 120) {
        showCustomToast('Please enter a valid birth date', 'error');
        return false;
      }
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

    // Only check non-system placeholders
    const emptyPlaceholders = placeholders.filter(
      placeholder => {
        if (isSystemKeyword(placeholder)) return false;
        if (placeholder.startsWith('CHECK_')) return false;
        return !formData.placeholders[placeholder]?.trim();
      }
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

    try {
      const requestFormData = new FormData();
      requestFormData.append('document', document.id);

      const processedPlaceholders = {};
      for (const [key, value] of Object.entries(formData.placeholders)) {
        if (key.includes('BIRTH_DATE')) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            processedPlaceholders[key] = key.endsWith('_TL') 
              ? SYSTEM_KEYWORDS['BIRTH_DATE_TL'](value)
              : SYSTEM_KEYWORDS['BIRTH_DATE'](value);
              
            // Set age when processing birth date
            const agePlaceholder = key.endsWith('_TL') ? 'AGE_TL' : 'AGE';
            processedPlaceholders[agePlaceholder] = key.endsWith('_TL') 
              ? SYSTEM_KEYWORDS['AGE_TL'](null, { BIRTH_DATE: value })
              : SYSTEM_KEYWORDS['AGE'](null, { BIRTH_DATE: value });
          }
        } else if (!key.startsWith('AGE')) { // Skip AGE fields as they're handled with BIRTH_DATE
          processedPlaceholders[key] = isSystemKeyword(key) 
            ? SYSTEM_KEYWORDS[key]()
            : value;
        }
      }

      console.log('Submitting with placeholders:', processedPlaceholders); // Debug log

      requestFormData.append('information', JSON.stringify(processedPlaceholders));

      // Add requirements
      formData.requirements.forEach((req, index) => {
        requestFormData.append(`requirements[${index}][requirement_id]`, req.requirement_id);
        requestFormData.append(`requirements[${index}][file]`, req.file);
      });

      setPendingFormData(requestFormData);
      setShowConfirmSubmit(true);
    } catch (error) {
      showCustomToast(error?.message || 'Failed to submit request', 'error');
    }
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

  useEffect(() => {
    if (document?.template) {
      const placeholders = {};
      // Initialize placeholders, auto-filling system keywords
      document.placeholders.forEach(key => {
        placeholders[key] = isSystemKeyword(key) ? SYSTEM_KEYWORDS[key]() : '';
      });
      setFormData(prev => ({
        ...prev,
        placeholders
      }));
    }
  }, [document]);

  const groupPlaceholders = (placeholders) => {
    const groups = {};
    const ungrouped = [];

    placeholders.forEach(placeholder => {
      if (placeholder.startsWith('CHECK_')) {
        // Find which group this checkbox belongs to
        const groupEntry = Object.entries(CHECKBOX_GROUPS).find(([_, group]) => 
          Object.keys(group.checkboxes).includes(placeholder)
        );
        
        if (groupEntry) {
          const [groupKey] = groupEntry;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(placeholder);
        } else {
          ungrouped.push(placeholder);
        }
      } else {
        ungrouped.push(placeholder);
      }
    });

    return { groups, ungrouped };
  };

  const renderPlaceholderInput = (placeholder) => {
    if (placeholder === 'SELECT_TITLE') {
      return (
        <div key={placeholder} className="space-y-1">
          <Select
            label={formatPlaceholderLabel(placeholder)}
            options={TITLE_OPTIONS}
            value={TITLE_OPTIONS.find(opt => opt.value === formData.placeholders[placeholder])}
            onChange={(selected) => handlePlaceholderChange(placeholder, selected?.value || '')}
            placeholder="Select title"
            isClearable={false}
            className="w-full"
          />
        </div>
      );
    }

    if (placeholder.includes('BIRTH_DATE')) {
      // Calculate date limits
      const today = new Date();
      const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1); // Yesterday
      const minDate = new Date(today.getFullYear() - 75, today.getMonth(), today.getDate()); // 75 years ago
      const minAgeDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // 1 month ago

      const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        
        if (selectedDate > maxDate) {
          showCustomToast('Birth date cannot be in the future or today', 'error');
          return;
        }

        if (selectedDate > minAgeDate) {
          showCustomToast('Age must be at least 1 month old', 'error');
          return;
        }

        if (selectedDate < minDate) {
          showCustomToast('Birth date cannot be more than 75 years ago', 'error');
          return;
        }

        // Set birth date
        handlePlaceholderChange(placeholder, e.target.value);
        
        // Also update AGE fields with computed age value
        if (placeholder.includes('BIRTH_DATE')) {
          const age = placeholder.endsWith('_TL') 
            ? SYSTEM_KEYWORDS['AGE_TL'](null, { BIRTH_DATE: e.target.value })
            : SYSTEM_KEYWORDS['AGE'](null, { BIRTH_DATE: e.target.value });
          
          const agePlaceholder = placeholder.endsWith('_TL') ? 'AGE_TL' : 'AGE';
          if (formData.placeholders.hasOwnProperty(agePlaceholder)) {
            handlePlaceholderChange(agePlaceholder, age);
          }
        }
      };

      return (
        <div key={placeholder} className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {formatPlaceholderLabel(placeholder)}
          </label>
          <div className="relative flex items-center">
            <input
              type="date"
              className="w-full pl-3 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white cursor-pointer"
              value={formData.placeholders[placeholder] || ''}
              onChange={handleDateChange}
              max={maxDate.toISOString().split('T')[0]}
              min={minDate.toISOString().split('T')[0]}
              onKeyDown={(e) => e.preventDefault()}
              placeholder="Select birth date"
            />
          </div>
          {formData.placeholders[placeholder] && (
            <div className="mt-1.5 space-y-1 p-2 bg-gray-50 rounded-md border border-gray-100">
              <p className="text-xs text-gray-600">
                Date: {placeholder.endsWith('_TL') 
                  ? SYSTEM_KEYWORDS['BIRTH_DATE_TL'](formData.placeholders[placeholder])
                  : SYSTEM_KEYWORDS['BIRTH_DATE'](formData.placeholders[placeholder])}
              </p>
              <p className="text-xs text-gray-600 font-medium">
                Age: {placeholder.endsWith('_TL') 
                  ? SYSTEM_KEYWORDS['AGE_TL'](null, { BIRTH_DATE: formData.placeholders[placeholder] })
                  : SYSTEM_KEYWORDS['AGE'](null, { BIRTH_DATE: formData.placeholders[placeholder] })}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (placeholder.startsWith('AGE')) {
      // For AGE fields, show preview and store value from birthdate
      return (
        <div key={placeholder} className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {formatPlaceholderLabel(placeholder)}
          </label>
          <div className="mt-1.5 p-2 bg-gray-50 rounded-md border border-gray-100">
            <input 
              type="hidden" 
              value={formData.placeholders[placeholder] || ''}
            />
            <p className="text-xs text-gray-600">
              {formData.placeholders['BIRTH_DATE'] ? 
                (placeholder.endsWith('_TL') 
                  ? SYSTEM_KEYWORDS['AGE_TL'](null, { BIRTH_DATE: formData.placeholders['BIRTH_DATE'] })
                  : SYSTEM_KEYWORDS['AGE'](null, { BIRTH_DATE: formData.placeholders['BIRTH_DATE'] }))
                : 'Will be calculated from birth date'
              }
            </p>
          </div>
        </div>
      );
    }

    if (placeholder.startsWith('CHECK_')) {
      const group = Object.entries(CHECKBOX_GROUPS).find(([_, g]) => 
        Object.keys(g.checkboxes).includes(placeholder)
      );
      
      const isChecked = formData.placeholders[placeholder] === '✓';
      
      return (
        <div key={placeholder} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id={placeholder}
            checked={isChecked}
            onChange={e => handlePlaceholderChange(placeholder, e)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor={placeholder} className="text-sm text-gray-700 cursor-pointer select-none">
            {group ? group[1].checkboxes[placeholder] : formatPlaceholderLabel(placeholder.replace('CHECK_', ''))}
          </label>
        </div>
      );
    }

    // If it's a system keyword (like DATE_TODAY)
    if (isSystemKeyword(placeholder)) {
      return (
        <InputField
          key={placeholder}
          label={formatPlaceholderLabel(placeholder)}
          value={SYSTEM_KEYWORDS[placeholder]()}
          disabled={true}
          className="w-full bg-gray-50"
          readOnly
        />
      );
    }

    // Regular input fields
    return (
      <InputField
        key={placeholder}
        label={formatPlaceholderLabel(placeholder)}
        value={formData.placeholders[placeholder] || ''}
        onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
        className="w-full"
        required
      />
    );
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
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Document Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900">{document?.document_name}</h4>
              <p className="text-sm text-gray-600 mt-1">{document?.description}</p>
              {document?.contact_no && (
                <p className="text-xs text-gray-500 mt-2">
                  Contact: {document.contact_no}
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Placeholder Fields */}
          {loadingPlaceholders && (
            <div className="flex items-center justify-center py-4">
              <FaSpinner className="animate-spin mr-2" />
              <span className="text-sm text-gray-600">Loading document fields...</span>
            </div>
          )}

          {placeholders.length > 0 && !loadingPlaceholders && (
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">Document Information</h4>
              
              {/* Render grouped checkboxes */}
              {Object.entries(groupPlaceholders(placeholders).groups).map(([groupKey, groupPlaceholders]) => (
                <div key={groupKey} className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">{CHECKBOX_GROUPS[groupKey].label}</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {groupPlaceholders.map(placeholder => renderPlaceholderInput(placeholder))}
                  </div>
                </div>
              ))}
              
              {/* Render ungrouped placeholders */}
              <div className="grid grid-cols-1 gap-4">
                {groupPlaceholders(placeholders).ungrouped.map(placeholder => 
                  renderPlaceholderInput(placeholder)
                )}
              </div>
            </div>
          )}

          {/* Requirements Section */}
          {document?.requirements?.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Required Documents</h4>
              <div className="grid grid-cols-1 gap-4">
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
          )}
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
