import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import municipalSeal from "../../assets/logo/santol_logo.png";
import { updateBlotterStatus, getBlotterHistory } from "../../api/blotterApi";
import { showCustomToast } from "../Toast/CustomToast";
import { useUser } from "../../contexts/UserContext";
import Select from "../reusable/Select";
import ConfirmationModal from "./ConfirmationModal";
import { X, Clock } from "lucide-react";

const ViewBlotterModal = ({ isOpen, onClose, data = false }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { currentUser } = useUser();  

  const isUserStaff = currentUser?.type === 'staff' || currentUser?.type === 'admin';

  useEffect(() => {
    const fetchHistory = async () => {
      if (data?.case_number) {
        try {
          setLoadingHistory(true);
          const response = await getBlotterHistory(data.case_number);
          setHistory(response.data?.history || []);
        } catch (error) {
          showCustomToast("Failed to fetch case history", "error");
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    fetchHistory();
  }, [data?.case_number]);

  const statusOptions = [
    
    { value: "ongoing", label: "Ongoing" },
    { value: "settled", label: "Settled" },
    { value: "unsettled", label: "Unsettled" },
    { value: "reopen", label: "Reopen" }
  ];

  // Reset form when modal closes
  const resetForm = () => {
    setSelectedStatus("");
    setNotes("");
  };

  // Handle status modal close
  const handleStatusModalClose = () => {
    if (selectedStatus || notes) {
      setShowCancelModal(true);
    } else {
      setShowStatusModal(false);
      resetForm();
    }
  };

  // Handle status update submit
  const handleStatusSubmit = async () => {
    if (!selectedStatus || !notes) {
      showCustomToast("Please fill in all fields", "error");
      return;
    }
    setShowConfirmModal(true);
  };

  // Handle confirmed status update
  const handleConfirmedUpdate = async () => {
    try {
      setLoading(true);
      await updateBlotterStatus(data.case_number, {
        status: selectedStatus,
        notes: notes
      });
      showCustomToast("Status updated successfully", "success");
      setShowStatusModal(false);
      setShowConfirmModal(false);
      resetForm();
      onClose();
    } catch (error) {
      showCustomToast(error.message || "Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  };

  // Status Update Modal
  const renderStatusModal = () => (
    <Modal
      isOpen={showStatusModal}
      onClose={handleStatusModalClose}
      title="Update Status"
      size="sm"
    >
      <div className="p-4 space-y-4">
        <Select
          label="New Status"
          value={statusOptions.find(opt => opt.value === selectedStatus)}
          onChange={(option) => setSelectedStatus(option.value)}
          options={statusOptions}
          placeholder="Select status"
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
            rows={4}
            placeholder="Add notes about this status change..."
            style={{ lineHeight: '1.5' }}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleStatusModalClose}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusSubmit}
            disabled={!selectedStatus || !notes || loading}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Sumbong Details" size="xl">
        <div className="space-y-8 print:space-y-6">
          {/* Header Section */}
          <header className="relative bg-white print:shadow-none">
            {/* Government Header */}
            <div className="relative text-center font-serif p-4">
              <div className="absolute left-0 top-0 w-16 sm:w-20 md:w-24 p-2">
                <img
                  src={municipalSeal}
                  alt="Municipal Seal of Barangay Santol"
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="space-y-1 max-w-lg mx-auto px-16 sm:px-20">
                <h1 className="text-xs sm:text-sm font-bold">REPUBLIKA NG PILIPINAS</h1>
                <h2 className="text-xs sm:text-sm">LALAWIGAN NG BULACAN</h2>
                <h3 className="text-xs sm:text-sm">BAYAN NG BALAGTAS</h3>
                <h4 className="text-xs sm:text-sm font-bold">BARANGAY SANTOL</h4>
              </div>

              <div aria-hidden="true" className="absolute right-2 top-1/2 -translate-y-1/2 origin-right -rotate-90 text-gray-400 text-xs sm:text-sm tracking-widest hidden sm:block">
                KEEPING THE LEGACY
              </div>
            </div>

            {/* Status Section - Staff Only */}
            {isUserStaff && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200" role="region" aria-label="Status Management">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Current Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      {
                        'filed': 'bg-yellow-100 text-yellow-800',
                        'ongoing': 'bg-blue-100 text-blue-800',
                        'settled': 'bg-green-100 text-green-800',
                        'unsettled': 'bg-red-100 text-red-800',
                        'reopen': 'bg-purple-100 text-purple-800'
                      }[data?.status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {data?.status?.charAt(0).toUpperCase() + data?.status?.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <section className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-sm font-medium mb-3">Complainant Details</h2>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-xs text-gray-500">Name:</dt>
                        <dd className="text-xs font-medium">{data?.complainant_name}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-sm font-medium mb-3">Case Information</h2>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-xs text-gray-500">Case Number:</dt>
                        <dd className="text-xs font-medium">{data?.case_number}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-xs text-gray-500">Case Type:</dt>
                        <dd className="text-xs font-medium">{data?.case_type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-xs text-gray-500">Date Filed:</dt>
                        <dd className="text-xs font-medium">
                          {new Date(data?.date_filed).toLocaleDateString()}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-xs text-gray-500">Created By:</dt>
                        <dd className="text-xs font-medium">
                          {data?.created_by ? `${data.created_by.first_name} ${data.created_by.last_name}` : 'N/A'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-xs text-gray-500">Email:</dt>
                        <dd className="text-xs font-medium">
                          {data?.created_by?.email || 'N/A'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </section>

                {/* Right Column */}
                <section className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-sm font-medium mb-3">Respondent Details</h2>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-xs text-gray-500">Name:</dt>
                        <dd className="text-xs font-medium">{data?.respondent_name}</dd>
                      </div>
                      {data?.additional_respondent?.length > 0 && (
                        <div>
                          <dt className="text-xs text-gray-500">Additional Respondents:</dt>
                          <dd className="mt-1">
                            {data.additional_respondent.map((name, index) => (
                              <div key={index} className="text-xs font-medium">{name}</div>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-sm font-medium mb-3">Attached Proof</h2>
                    {data?.attached_proof_url ? (
                      <div className="space-y-2">
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={data.attached_proof_url}
                            alt="Attached Proof"
                            className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setShowImageModal(true)}
                          />
                        </div>
                        <div className="text-xs text-center text-gray-500">
                          Click image to view full size
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-4">
                        No proof attached
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* Full Width Sections */}
              <section className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-sm font-medium mb-3">Complaint Details</h2>
                  <p className="text-xs whitespace-pre-wrap">{data?.complaint_details}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-sm font-medium mb-3">Relief Sought</h2>
                  <p className="text-xs whitespace-pre-wrap">{data?.relief_sought}</p>
                </div>

                {/* Case History Timeline */}
                <section className="bg-white rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-medium text-gray-900">Case History</h4>
                    {history.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {history.length} {history.length === 1 ? 'entry' : 'entries'}
                      </span>
                    )}
                  </div>

                  {loadingHistory ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-6">
                      {history.map((item, index) => (
                        <div key={index} className="relative pl-6">
                          {/* Timeline line */}
                          <div className="absolute left-2.5 top-6 bottom-0 w-px bg-gray-200"
                               style={{ display: index === history.length - 1 ? 'none' : 'block' }}/>
                          
                          {/* Content */}
                          <div className="relative">
                            {/* Date */}
                            <time className="block text-xs text-gray-500 mb-2" dateTime={item.created_at}>
                              {new Date(item.created_at).toLocaleString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </time>

                            {/* Card Content */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              {/* Status Badge */}
                              <div className="flex items-center gap-2 mb-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                  {
                                    'filed': 'bg-yellow-500',
                                    'ongoing': 'bg-blue-500',
                                    'settled': 'bg-green-500',
                                    'unsettled': 'bg-red-500',
                                    'reopen': 'bg-purple-500'
                                  }[item.status] || 'bg-gray-400'
                                }`} />
                                <span className={`text-xs font-medium ${
                                  {
                                    'filed': 'text-yellow-800',
                                    'ongoing': 'text-blue-800',
                                    'settled': 'text-green-800',
                                    'unsettled': 'text-red-800',
                                    'reopen': 'text-purple-800'
                                  }[item.status] || 'text-gray-800'
                                }`}>
                                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                              </div>

                              {/* Notes */}
                              <p className="text-sm text-gray-600 mb-3">{item.notes}</p>

                              {/* User Info */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                  {/* <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600">
                                      {item.updated_by.first_name.charAt(0)}
                                    </span>
                                  </div> */}
                                  <span className="text-xs font-medium text-gray-900">
                                    {`${item.updated_by.first_name} ${item.updated_by.last_name}`}
                                  </span>
                                </div>
                                <span className="hidden sm:block text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{item.updated_by.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4 bg-gray-50 rounded-lg">
                      <Clock className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No history available</p>
                    </div>
                  )}
                </section>
              </section>
            </div>
          </header>
        </div>
      </Modal>

      {/* Status Update Modal */}
      {renderStatusModal()}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={data.attached_proof_url}
              alt="Full size proof"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmedUpdate}
        title="Confirm Status Update"
        message="Are you sure you want to update the status?"
        confirmText="Update"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          setShowStatusModal(false);
          resetForm();
        }}
        title="Cancel Update"
        message="Are you sure you want to cancel? Any changes will be lost."
        confirmText="Yes, Cancel"
        cancelText="No, Keep Editing"
        type="warning"
      />
    </>
  );
};

export default ViewBlotterModal;
