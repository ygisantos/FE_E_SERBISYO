import React from 'react';
import Modal from '../Modal/Modal';
import { FileText, File } from 'lucide-react';

const ViewDocumentModal = ({ isOpen, onClose, document }) => {
  const hasTemplate = document?.template_path;
  const templateUrl = hasTemplate 
    ? `${import.meta.env.VITE_API_STORAGE_URL}/${document.template_path}`
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View Document Details"
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Document Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {document?.document_name}
          </h3>
          <p className="text-sm text-gray-600">{document?.description}</p>
        </div>

        {/* Requirements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Requirements</h4>
          {document?.requirements?.length > 0 ? (
            <ul className="space-y-2">
              {document.requirements.map((req) => (
                <li key={req.id} className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{req.name}</p>
                    <p className="text-xs text-gray-600">{req.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No requirements specified</p>
          )}
        </div>

        {/* Template Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Document Template</h4>
          {hasTemplate ? (
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">Template File</p>
                <a 
                  href={templateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  View Template
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No template uploaded</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewDocumentModal;
