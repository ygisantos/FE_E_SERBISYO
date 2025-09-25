import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Modal from '../Modal/Modal';

const CreateAnnouncementModal = ({ isOpen, onClose, onSubmit, formData, setFormData, isLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  if (!isOpen) return null;

  // Check if form has content
  const hasContent = formData?.type || formData?.description;

  const handleClose = () => {
    if (hasContent) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-brightness-50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Announcement</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Announcement Type
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select a type</option>
                <option value="information">Information</option>
                <option value="problem">Problem</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter announcement description..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Confirmation Modal using shared Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Discard changes?"
        showCloseButton={false}
        footer={
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={handleDiscard}
            >
              Yes, Discard
            </button>
          </div>
        }
      >
        <div className="text-gray-700">Are you sure you want to discard your changes?</div>
      </Modal>
    </>
  );
};

export default CreateAnnouncementModal;
