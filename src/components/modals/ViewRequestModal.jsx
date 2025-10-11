import React from 'react';
import Modal from '../Modal/Modal';

const ViewRequestModal = ({ isOpen, onClose, request }) => {
  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Details"
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="p-4 space-y-6">
        {/* Transaction Details */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Document Information</h3>
            <dl className="mt-2 space-y-1">
              <div className="flex text-sm">
                <dt className="w-32 text-gray-500">Document Name:</dt>
                <dd className="text-gray-900">{request.document.document_name}</dd>
              </div>
              <div className="flex text-sm">
                <dt className="w-32 text-gray-500">Status:</dt>
                <dd className="text-gray-900 capitalize">{request.status}</dd>
              </div>
              <div className="flex text-sm">
                <dt className="w-32 text-gray-500">Request Date:</dt>
                <dd className="text-gray-900">
                  {new Date(request.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Requestor Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Requestor Information</h3>
            <dl className="mt-2 space-y-1">
              <div className="flex text-sm">
                <dt className="w-32 text-gray-500">Name:</dt>
                <dd className="text-gray-900">
                  {`${request.account.first_name} ${request.account.last_name}`}
                </dd>
              </div>
              <div className="flex text-sm">
                <dt className="w-32 text-gray-500">Contact:</dt>
                <dd className="text-gray-900">{request.account.contact_no}</dd>
              </div>
              <div className="flex text-sm">
                <dt className="w-32 text-gray-500">Address:</dt>
                <dd className="text-gray-900">
                  {`${request.account.house_no} ${request.account.street}, ${request.account.barangay}`}
                </dd>
              </div>
            </dl>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Uploaded Requirements</h3>
            <div className="mt-2 space-y-2">
              {request.uploaded_requirements.map((req) => (
                <div key={req.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{req.requirement.name}</span>
                  <a
                    href={`/storage/${req.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewRequestModal;
