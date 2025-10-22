import React from 'react';
import Modal from '../Modal/Modal';

const TermsModal = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  showAcceptButton = true,
  isAccepted = false 
}) => {
  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title="Terms & Conditions"
      modalClass="max-w-2xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {showAcceptButton && !isAccepted && (
            <button
              onClick={onAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Accept Terms
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <section className="space-y-3">
          <h4 className="font-medium text-gray-900">User Agreement</h4>
          <p className="text-sm text-gray-600">
            By accessing and using the E-Serbisyo platform, you agree to provide accurate and truthful information for verification and account creation purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h4 className="font-medium text-gray-900">Data Privacy & Protection</h4>
          <p className="text-sm text-gray-600">Your personal information will be processed and stored securely in accordance with data privacy laws. Access is restricted to authorized barangay personnel only.</p>
          <p className="text-sm text-gray-600">Information collected will be used solely for official barangay services and administrative purposes.</p>
        </section>

        {/* ...existing sections... */}

        <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
          By using this service, you acknowledge that you have read, understood, and agree to be bound by all the conditions stated above.
        </div>
      </div>
    </Modal>
  );
};

export default TermsModal;
