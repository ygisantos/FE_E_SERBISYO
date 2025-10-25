import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { FaFilePdf, FaEye, FaCheck, FaClock, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaBirthdayCake, FaTimes } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const ViewRequestModal = ({ 
  isOpen, 
  onClose, 
  request, 
  isStaff = false,
  getFileUrl,
  onUpdateStatus
}) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  if (!request) return null;

  // Support two shapes of the show API response:
  // 1) direct request object
  // 2) { request_document: { ... }, user_blotters: [...] }
  const req = request.request_document || request;
  const history = request.user_blotters || request.user_history || [];

  const handlePreviewPdf = (url) => {
    const fullUrl = getFileUrl(url);
    setSelectedPdf(fullUrl);
    setShowPdfModal(true);
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || 'N/A'}</span>
    </div>
  );

  const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-md text-xs font-medium
      ${status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
      status === 'processing' ? 'bg-blue-50 text-blue-700' :
      status === 'approved' ? 'bg-green-50 text-green-700' :
      status === 'ready to pickup' ? 'bg-purple-50 text-purple-700' :
      status === 'released' ? 'bg-emerald-50 text-emerald-700' :
      status === 'rejected' ? 'bg-red-50 text-red-700' :
      'bg-gray-50 text-gray-700'}`}
    >
      {status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );

  const DocumentRequirement = ({ requirement }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-md">
          <FaFilePdf className="w-4 h-4 text-red-500" />
        </div>
        <span className="text-sm text-gray-900">{requirement.requirement.name}</span>
      </div>
      <button
        onClick={() => handlePreviewPdf(requirement.file_path)}
        className="text-xs text-gray-600 hover:text-red-600 flex items-center gap-1.5"
      >
        <FaEye className="w-3.5 h-3.5" /> View
      </button>
    </div>
  );

  // Get timestamp for a specific status from certificate logs
  const getStatusTimestamp = (status) => {
  if (!req.certificate_logs?.length) return null;
    
    // Get the log that matches the status change
  const log = req.certificate_logs.find(log => {
      if (status === 'submitted') return log.remark.includes('request created');
      if (status === 'processing') return log.remark.includes('being processed');
      if (status === 'ready to pickup') return log.remark.includes('ready for pickup');
      if (status === 'released') return log.remark.includes('released to requestor');
      if (status === 'rejected') return log.remark.includes('has been rejected');
      return false;
    });

    return log?.created_at || null;
  };

  const requestSteps = [
    {
      status: 'submitted',
      label: 'Request Submitted',
    date: req.created_at, // Use request creation date for submitted status
      description: 'Request has been received and is awaiting review',
      icon: <FaClock className="w-4 h-4" />,
      color: 'yellow'
    },
    {
      status: 'processing',
      label: 'Processing',
    date: getStatusTimestamp('processing'),
      description: 'Documents are being prepared',
      icon: <FaClock className="w-4 h-4" />,
      color: 'blue'
    },
    {
      status: 'ready to pickup',
      label: 'Ready for Pickup',
    date: getStatusTimestamp('ready to pickup'),
      description: 'Documents are ready for collection',
      icon: <FaCheck className="w-4 h-4" />,
      color: 'purple'
    },
    {
      status: 'released',
      label: 'Released',
    date: getStatusTimestamp('released'),
      description: 'Documents have been collected',
      icon: <FaCheck className="w-4 h-4" />,
      color: 'green'
    },
    // Only show rejected step if status is rejected
    ...(req.status === 'rejected' ? [{
      status: 'rejected',
      label: 'Request Rejected',
      date: getStatusTimestamp('rejected'),
      description: 'Request has been rejected',
      icon: <FaTimes className="w-4 h-4" />,
      color: 'red'
    }] : [])
  ];

  const currentStepIndex = requestSteps.findIndex(step => {
    if (req.status === 'rejected') {
      // For rejected status, only show the submitted step as active
      return step.status === 'submitted';
    }
    return step.status === req.status || 
      (step.status === 'submitted' && req.status === 'pending');
  });

  const ActionButton = ({ label, onClick, variant = 'default' }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded transition-all duration-150
        ${variant === 'primary' ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800' : 
          variant === 'danger' ? 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200' :
          'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 active:bg-gray-100'}`}
    >
      {label}
    </button>
  );

  const DetailItem = ({ icon: Icon, label, value, isLongText }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {isLongText ? (
          <CollapsibleText text={value} />
        ) : (
    <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap wrap-break-word">
            {value || 'N/A'}
          </p>
        )}
      </div>
    </div>
  );

  const CollapsibleText = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldCollapse = text?.length > maxLength;

    if (!text) return <span className="text-sm text-gray-500">N/A</span>;
    if (!shouldCollapse) return <span className="text-sm text-gray-900">{text}</span>;

    return (
      <div className="space-y-1">
        <p className="text-sm text-gray-900">
          {isExpanded ? text : `${text.substring(0, maxLength)}...`}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
        >
          {isExpanded ? 'Show less' : 'Read more'}
          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    );
  };

  const TimelineItem = ({ step, isActive, isLast }) => (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${
          step.status === 'rejected'
            ? 'bg-red-50 text-red-600'
            : isActive 
              ? `bg-${step.color}-50 text-${step.color}-600` 
              : 'bg-gray-50 text-gray-400'
        }`}>
          {step.icon}
        </div>
        {!isLast && (
          <div className={`w-0.5 h-12 ${
            isActive ? `bg-${step.color}-200` : 'bg-gray-100'
          }`} />
        )}
      </div>
      
      <div className={`flex-1 pb-6 ${!isActive && step.status !== 'rejected' ? 'opacity-50' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${
              step.status === 'rejected'
                ? 'text-red-700'
                : isActive 
                  ? `text-${step.color}-700` 
                  : 'text-gray-900'
            }`}>
              {step.label}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
            {step.date && (
              <p className="text-xs text-gray-400 mt-1">
                {new Date(step.date).toLocaleString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const RequestorDetails = () => (
    <div className="bg-white rounded-lg border p-4">
      <h4 className="text-xs font-medium text-gray-900 mb-4">Requestor Information</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem
          icon={FaUser}
          label="Full Name"
          value={`${req.account?.first_name || ''} ${req.account?.middle_name || ''} ${req.account?.last_name || ''} ${req.account?.suffix || ''}`}
        />
        <DetailItem
          icon={FaBirthdayCake}
          label="Birth Date"
          value={formatDate(req.account?.birthday)}
        />
        <DetailItem
          icon={FaUser}
          label="Age"
          value={`${req.account?.age || 'N/A'} `}
        />
        <DetailItem
          icon={FaUser}
          label="Civil Status"
          value={req.account?.civil_status}
        />
        <DetailItem
          icon={FaUser}
          label="Nationality"
          value={req.account?.nationality}
        />
        <DetailItem
          icon={FaPhone}
          label="Contact Number"
          value={req.account?.contact_no}
        />
        <DetailItem
          icon={FaEnvelope}
          label="Email Address"
          value={req.account?.email}
        />
        <DetailItem
          icon={FaIdCard}
          label="ID Type"
          value={req.account?.id_type || 'Not provided'}
        />
        <DetailItem
          icon={FaIdCard}
          label="ID Number"
          value={req.account?.id_number || 'Not provided'}
        />
        <div className="sm:col-span-2">
          <DetailItem
            icon={FaMapMarkerAlt}
            label="Complete Address"
            value={`${req.account?.house_no || ''} ${req.account?.street || ''}, ${req.account?.barangay || ''}, ${req.account?.municipality || ''}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="3xl"
      title="Request Details"
    >
      <div className="flex flex-col">
        {/* Document Info Header - Fixed */}
        <div className="px-4 sm:px-6 py-3 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {req.document_details?.document_name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Reference No: {req.transaction_id}</p>
            </div>
            <StatusBadge status={req.status} />
          </div>
        </div>


        <div className="px-4 sm:px-6 py-4 space-y-4">
          {/* Timeline Section */}
          <section className="bg-white rounded-lg border p-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-4">
              Request Timeline
            </h4>
            <div className="space-y-2">
              {requestSteps.map((step, index) => (
                <TimelineItem
                  key={step.status}
                  step={step}
                  isActive={index <= currentStepIndex}
                  isLast={index === requestSteps.length - 1}
                />
              ))}
            </div>
          </section>

          {/* Request Details Section */}
          <section className="bg-white rounded-lg border p-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">Request Details</h4>
            <div className="space-y-3">
              <DetailItem
                icon={FaFilePdf}
                label="Document Type"
                value={req.document_details?.document_name}
              />
              <DetailItem
                icon={FaUser}
                label="Purpose"
                value={req.purpose}
                isLongText={true}
              />
            </div>
          </section>

          {/* Requestor Info Section */}
          <RequestorDetails />

          {/* Requirements Section */}
          <section className="bg-white rounded-lg border p-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">Requirements</h4>
            <div className="space-y-2">
              {req.uploaded_requirements?.length > 0 ? (
                req.uploaded_requirements.map((r) => (
                  <div key={r.id} className="flex items-start gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaFilePdf className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 wrap-break-word">
                        {r.requirement.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePreviewPdf(r.file_path)}
                      className="shrink-0 flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 hover:text-red-600"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 px-4 text-center bg-gray-50 rounded-lg">
                  <FaFilePdf className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">No uploaded requirements</p>
                  <p className="text-xs text-gray-400">No documents have been uploaded yet</p>
                </div>
              )}
            </div>
          </section>

          {/* User History Section (from show API: user_blotters) */}
          <section className="bg-white rounded-lg border p-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">User History</h4>
            <div className="space-y-3">
              {history?.length > 0 ? (
                history.map((h) => (
                  <div key={h.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{h.case_number} • {h.case_type}</p>
                      <p className="text-xs text-gray-500 mt-1">Status: <span className="font-medium text-gray-700">{h.status}</span></p>
                      <p className="text-xs text-gray-400 mt-1">Filed: {h.date_filed}</p>
                      {h.complaint_details && (
                        <p className="text-xs text-gray-500 mt-1">{h.complaint_details}</p>
                      )}
                    </div>
                    {h.attached_proof_url ? (
                      <a href={h.attached_proof_url} target="_blank" rel="noreferrer" className="text-xs text-red-600 hover:underline">View proof</a>
                    ) : (
                      <span className="text-xs text-gray-400">No proof</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-6 px-4 text-center bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">No history available for this user</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer - Fixed */}
        {isStaff && (
          <div className="px-4 sm:px-6 py-3 border-t bg-gray-50 mt-auto">
            <div className="flex justify-end gap-2">
              {req.status === 'pending' && (
                <ActionButton
                  label="Process Request"
                  onClick={() => onUpdateStatus(req.id, 'processing')}
                  variant="primary"
                />
              )}
              {req.status === 'processing' && (
                <ActionButton
                  label="Mark as Ready"
                  onClick={() => onUpdateStatus(req.id, 'ready to pickup')}
                  variant="primary"
                />
              )}
              {req.status === 'ready to pickup' && (
                <ActionButton
                  label="Release"
                  onClick={() => onUpdateStatus(req.id, 'released')}
                  variant="primary"
                />
              )}
              {['pending', 'processing'].includes(req.status) && (
                <ActionButton
                  label="Reject"
                  onClick={() => onUpdateStatus(req.id, 'rejected')}
                  variant="danger"
                />
              )}
              <ActionButton
                label="Close"
                onClick={onClose}
              />
            </div>
          </div>
        )}

        {/* PDF Preview Modal - Full screen on mobile */}
        <Modal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          title="Document Preview"
          modalClass="w-full h-full sm:max-w-[95vw] sm:w-full sm:h-[95vh]"
        >
          <iframe
            src={selectedPdf}
            className="w-full h-full sm:h-[calc(95vh-4rem)] border-0"
            title="PDF Preview"
          />
        </Modal>
      </div>
    </Modal>
  );
};

export default ViewRequestModal;
