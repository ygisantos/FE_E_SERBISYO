import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import InputField from '../reusable/InputField';
import Select from '../reusable/Select';
import { FileText, Clock, DollarSign, ListChecks } from 'lucide-react';
import { createDocument } from '../../api/documentApi';
import { showCustomToast } from '../Toast/CustomToast';

const CreateCertificateModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    document_name: '',
    description: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.document_name) newErrors.document_name = 'Document name is required';
    if (!formData.description) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showCustomToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const response = await createDocument(formData);
      if (response.message && response.document) {
        // Format the document data to match your table structure
        const formattedDoc = {
          id: response.document.id,
          name: response.document.document_name,
          description: response.document.description,
          status: response.document.status,
          created_at: response.document.created_at,
          updated_at: response.document.updated_at
        };
        
        showCustomToast(response.message, 'success');
        onSubmit(formattedDoc); // Move this after success toast
        onClose();
      }
    } catch (error) {
      showCustomToast(error?.message || 'Failed to create document', 'error');
      throw error;  
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Document"
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
            className="px-4 py-2 text-sm font-medium text-white bg-red-900 border border-transparent rounded-md hover:bg-red-800"
          >
            Add Document
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6">
        <InputField
          label="Document Name"
          name="document_name"
          value={formData.document_name}
          onChange={handleChange}
          placeholder="e.g., Barangay Clearance"
          error={errors.document_name}
          icon={<FileText className="w-4 h-4" />}
          required
        />

        <InputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter document description"
          error={errors.description}
          icon={<ListChecks className="w-4 h-4" />}
          required
          multiline
          rows={3}
        />

        <Select
          label="Status"
          value={{ value: formData.status, label: formData.status.charAt(0).toUpperCase() + formData.status.slice(1) }}
          onChange={(option) => handleChange({ target: { name: 'status', value: option.value } })}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ]}
          required
        />
      </div>
    </Modal>
  );
};

export default CreateCertificateModal;
