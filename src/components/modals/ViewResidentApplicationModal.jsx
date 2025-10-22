import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { acceptAccount, rejectAccount } from '../../api/ApproveRejectApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import { FaUser, FaIdCard, FaTimes, FaFileAlt, FaDownload, FaEye } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';

const ViewResidentApplicationModal = ({ 
  isOpen, 
  onClose, 
  resident, 
  onSuccess,
  showActions = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [showCancelRejectModal, setShowCancelRejectModal] = useState(false);

  const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    // Remove /storage prefix and use storage URL
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^\/storage\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
  };

  const renderField = (label, value) => (
    <div className="mb-3">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <p className="text-sm text-gray-900 mt-0.5">{value || '-'}</p>
    </div>
  );

  const renderSection = (title, content) => (
    <div className="mb-4">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
      <div className="bg-white rounded-lg border border-gray-100 p-4">{content}</div>
    </div>
  );

  const ImagePreviewModal = ({ src, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="fixed top-0 right-0 p-4">
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-300 p-2 rounded-full bg-black bg-opacity-50"
          aria-label="Close preview"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>
      <div className="h-full w-full flex items-center justify-center p-4">
        <img 
          src={src} 
          alt="Document Preview" 
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );

  const renderProofImage = (src, label) => (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div 
        onClick={() => src && setSelectedImage(getProfilePicUrl(src))}
        className={`relative aspect-[3/2] rounded-lg overflow-hidden ${src ? 'cursor-zoom-in' : ''}`}
      >
        {src ? (
          <img
            src={getProfilePicUrl(src)}
            alt={label}
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <FaIdCard className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );

  const renderFiledDocument = (document, label) => {
    if (!document) return null;
    
    const handleViewDocument = () => {
      const url = getProfilePicUrl(document);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    const handleDownloadDocument = () => {
      const url = getProfilePicUrl(document);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${label}_${resident?.name || 'document'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FaFileAlt className="w-8 h-8 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {label}
                </p>
                <p className="text-xs text-gray-500">
                  Filed document
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleViewDocument}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaEye className="w-3 h-3 mr-1" />
                View
              </button>
              <button
                onClick={handleDownloadDocument}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <FaDownload className="w-3 h-3 mr-1" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await acceptAccount(resident.id);
      showCustomToast("Account has been accepted successfully!", "success");
      onSuccess?.();
      resetStates();
    } catch (error) {
      showCustomToast(error.message || "Failed to accept account", "error");
    } finally {
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showCustomToast("Please provide a reason for rejection", "error");
      return;
    }

    try {
      setIsProcessing(true);
      await rejectAccount(resident.id, rejectReason);
      showCustomToast("Account rejected successfully", "success");
      onSuccess?.();
      resetStates();
    } catch (error) {
      showCustomToast(error.message || "Failed to reject account", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // reset function
  const resetStates = () => {
    setSelectedImage(null);
    setIsProcessing(false);
    setRejectReason('');
    setShowRejectInput(false);
    setShowConfirmModal(false);
    setConfirmationType('');
    setShowCancelRejectModal(false);
  };

  // onClose handler
  const handleClose = () => {
    setSelectedImage(null);
    setIsProcessing(false);
    setRejectReason('');
    setShowRejectInput(false);
    setShowConfirmModal(false);
    setConfirmationType('');
    onClose();
  };

  // handleActionClick function
  const handleActionClick = (type) => {
    setConfirmationType(type);
    setShowConfirmModal(true);
  };

  // handle cancel reject confirmation
  const renderFooter = () => {
    if (!showActions) {
      return (
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      );
    }

    if (showRejectInput) {
      return (
        <div className="space-y-4">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCancelRejectModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={() => handleActionClick('reject')}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={isProcessing || !rejectReason.trim()}
            >
              {isProcessing ? 'Processing...' : 'Confirm Reject'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-end items-center gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
        <button
          onClick={() => setShowRejectInput(true)}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          disabled={isProcessing}
        >
          Reject
        </button>
        <button
          onClick={() => handleActionClick('approve')}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Approve'}
        </button>
      </div>
    );
  };

  // cancelRejection handler
  const handleCancelRejection = () => {
    setRejectReason('');
    setShowRejectInput(false);
    setShowCancelRejectModal(false);
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        title="Application Details" 
        size="lg"
        footer={renderFooter()}
      >
        <div className="h-full">   
          {/* Profile Section */}
          <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100">
            <div className="w-16 h-16 flex-shrink-0">
              {resident?.profile_picture_path ? (
                <img
                  src={getProfilePicUrl(resident.profile_picture_path)}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center">
                  <FaUser className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">{resident?.name}</h3>
              <p className="text-sm text-gray-500">{resident?.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Applied: {formattedDate(resident?.created_at)}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {renderSection("Personal Details",
              <div className="space-y-2">
                {renderField("Name", `${resident?.first_name} ${resident?.middle_name || ''} ${resident?.last_name} ${resident?.suffix || ''}`)}
                {renderField("Gender", resident?.sex === 'M' ? 'Male' : 'Female')}
                {renderField("Birthday", formattedDate(resident?.birthday))}
                {renderField("Civil Status", resident?.civil_status)}
              </div>
            )}
            {renderSection("Contact Details",
              <div className="space-y-2">
                {renderField("Phone", resident?.contact_no)}
                {renderField("Birth Place", resident?.birth_place)}
                {renderField("Address", `${resident?.house_no} ${resident?.street}, ${resident?.barangay}`)}
              </div>
            )}
          </div>

          {/* Proof of Identity */}
          {renderSection("Proof of Identity",
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {resident?.account_proof && [
                { src: resident.account_proof.front_id_card, label: "ID Front" },
                { src: resident.account_proof.back_id_card, label: "ID Back" },
                { src: resident.account_proof.selfie_id_card, label: "Selfie with ID" }
              ].map((item, index) => (
                <div key={index}>
                  {renderProofImage(item.src, item.label)}
                </div>
              ))}
            </div>
          )}

          {/* Filed Documents Section */}
          {(resident?.filed_documents || resident?.supporting_documents || resident?.registration_document) && 
            renderSection("Filed Documents",
              <div className="space-y-4">
                {resident?.registration_document && renderFiledDocument(resident.registration_document, "Registration Document")}
                {resident?.filed_documents && renderFiledDocument(resident.filed_documents, "Filed Document")}
                {resident?.supporting_documents && renderFiledDocument(resident.supporting_documents, "Supporting Documents")}
                {resident?.birth_certificate && renderFiledDocument(resident.birth_certificate, "Birth Certificate")}
                {resident?.marriage_certificate && renderFiledDocument(resident.marriage_certificate, "Marriage Certificate")}
                {resident?.proof_of_residency && renderFiledDocument(resident.proof_of_residency, "Proof of Residency")}
                
                {/* Handle array of documents if they exist */}
                {Array.isArray(resident?.documents) && resident.documents.map((doc, index) => 
                  renderFiledDocument(doc.file_path || doc.document_path, doc.document_type || `Document ${index + 1}`)
                )}
                
                {/* If no documents found, show message */}
                {!resident?.registration_document && 
                 !resident?.filed_documents && 
                 !resident?.supporting_documents && 
                 !resident?.birth_certificate && 
                 !resident?.marriage_certificate && 
                 !resident?.proof_of_residency && 
                 (!resident?.documents || resident.documents.length === 0) && (
                  <div className="text-center py-6">
                    <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No filed documents available</p>
                  </div>
                )}
              </div>
            )
          }
        </div>
      </Modal>

      {/* Add Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmationType === 'approve' ? handleApprove : handleReject}
        title={`Confirm ${confirmationType === 'approve' ? 'Approval' : 'Rejection'}`}
        message={
          confirmationType === 'approve' 
            ? "Are you sure you want to approve this resident application?"
            : "Are you sure you want to reject this application with the provided reason?"
        }
        confirmText={confirmationType === 'approve' ? 'Approve' : 'Reject'}
        type={confirmationType === 'approve' ? 'success' : 'danger'}
      />

      {/* Fullscreen Image Preview */}
      {selectedImage && (
        <ImagePreviewModal 
          src={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}

      {/* Cancel Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelRejectModal}
        onClose={() => setShowCancelRejectModal(false)}
        onConfirm={handleCancelRejection}
        title="Cancel Rejection"
        message="Are you sure you want to cancel the rejection? Your entered reason will be discarded."
        confirmText="Yes, Cancel"
        cancelText="No, Keep Editing"
        type="warning"
      />
    </>
  );
};

export default ViewResidentApplicationModal;
