import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { FaFilePdf, FaEye } from 'react-icons/fa';

const ViewRequestModal = ({ isOpen, onClose, request }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  if (!request) return null;

  const handlePreviewPdf = (url) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${baseUrl}/storage/${url}`;
    setSelectedPdf(fullUrl);
    setShowPdfModal(true);
  };

  return (
    <>
      {/* Main View Modal */}
      <Modal isOpen={isOpen} onClose={onClose} title="Request Details">
        <div className="p-4 space-y-6">
          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Document Information</h3>
              <dl className="mt-2 space-y-1">
                <div className="flex text-sm">
                  <dt className="w-32 text-gray-500">Document Name:</dt>
                  <dd className="text-gray-900">{request.document_details.document_name}</dd>
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

            {/* Requirements section with updated PDF preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Uploaded Requirements</h3>
              <div className="mt-2 space-y-2">
                {request.uploaded_requirements.map((req) => (
                  <div key={req.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                    <FaFilePdf className="w-4 h-4 text-red-500" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-700">{req.requirement.name}</p>
                      <button
                        onClick={() => handlePreviewPdf(req.file_path)}
                        className="text-xs text-red-600 hover:text-red-700 inline-flex items-center gap-1 mt-1"
                      >
                        <FaEye className="w-3 h-3" />
                        View PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title="Document Preview"
        modalClass="max-w-[95vw] w-full h-[95vh]"
      >
        <div className="h-full w-full bg-gray-100">
          <iframe
            src={selectedPdf}
            className="w-full h-full border-0"
            title="PDF Preview"
            style={{ minHeight: 'calc(95vh - 80px)' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ViewRequestModal;
