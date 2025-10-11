import React from 'react';
import Modal from '../Modal/Modal';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      modalClass="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="p-4">
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
  