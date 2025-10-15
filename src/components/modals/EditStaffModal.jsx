import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import FormInput from '../reusable/InputField';
import Select from '../reusable/Select';
import { updateAccountInformation} from '../../api/accountApi';
import { showCustomToast } from '../Toast/CustomToast';

const EditStaffModal = ({ isOpen, onClose, staff, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: staff?.first_name || '',
    last_name: staff?.last_name || '',
    email: staff?.email || '',
    contact_no: staff?.contact_no || '',
    type: staff?.type || 'staff'
  });

  const handleSubmit = async () => {
    try {
      await updateAccountInformation(staff.id, formData);
      showCustomToast('Staff updated successfully', 'success');
      onSuccess();
    } catch (error) {
      showCustomToast(error.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Staff"
      modalClass="max-w-2xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Form fields */}
        </div>
      </div>
    </Modal>
  );
};

export default EditStaffModal;
