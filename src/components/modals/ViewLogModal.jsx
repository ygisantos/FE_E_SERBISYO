import React from 'react';
import Modal from '../Modal/Modal';
import { FaUser, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const ViewLogModal = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Certificate Log Details"
      modalClass="max-w-2xl"
    >
      <div className="p-6 space-y-6">
        {/* Document Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaFileAlt className="w-4 h-4 text-gray-500" />
            Document Information
          </h3>
          <div className="space-y-2">
            <InfoRow label="Certificate Type" value={log.certificateType} />
            <InfoRow label="Transaction ID" value={log.transactionId} />
            <InfoRow label="Status" value={log.status} type="badge" />
          </div>
        </div>

        {/* Resident Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaUser className="w-4 h-4 text-gray-500" />
            Resident Information
          </h3>
          <div className="space-y-2">
            <InfoRow label="Name" value={log.residentName} />
            <InfoRow label="Contact" value={log.residentContact} />
          </div>
        </div>

        {/* Action Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="w-4 h-4 text-gray-500" />
            Action Details
          </h3>
          <div className="space-y-2">
            <InfoRow label="Action By" value={log.actionBy} />
            <InfoRow label="Action Date" value={new Date(log.actionDate).toLocaleString()} />
            <InfoRow label="Remarks" value={log.remarks} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

const InfoRow = ({ label, value, type }) => {
  if (!value) return null;

  const renderValue = () => {
    if (type === 'badge') {
      const colorMap = {
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800'
      };

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      );
    }
    
    return <span className="text-gray-800">{value}</span>;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center text-xs">
      <span className="font-medium text-gray-500 sm:w-1/3">{label}:</span>
      <div className="sm:w-2/3">{renderValue()}</div>
    </div>
  );
};

export default ViewLogModal;
