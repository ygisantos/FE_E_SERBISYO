import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaCheck, FaTimes, FaFilePdf, FaDownload, FaFileWord } from 'react-icons/fa';
import { fetchAllRequests, updateRequestStatus, getRequestById } from '../../api/requestApi';
import { generateFilledDocument } from '../../api/documentApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import ViewRequestModal from '../../components/modals/ViewRequestModal';
import { createCertificateLog } from '../../api/certificateLogApi';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Modal/Modal';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });
  const [filters, setFilters] = useState({
    status: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const { user } = useAuth(); // Add this to get current staff info

  const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'approved', label: 'Approved' },
    { value: 'ready to pickup', label: 'Ready to Pickup' },
    { value: 'released', label: 'Released' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const STATUS_COLORS = {
    pending: 'yellow',
    processing: 'blue',
    approved: 'emerald',
    'ready to pickup': 'indigo',
    released: 'green',
    rejected: 'red'
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchAllRequests({
        page,
        per_page: 10,
        search,
        status: filters.status,
        sort_by: sortConfig.sort_by,
        order: sortConfig.order
      });
      
      setRequests(response.data);
      setTotal(response.total);
    } catch (error) {
      showCustomToast(error.message || 'Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdateClick = (requestId, newStatus) => {
    setSelectedRequestId(requestId);
    setSelectedStatus(newStatus);
    setRemark('');
    setShowRemarkModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      
      // 1. Update request status with remark
      const response = await updateRequestStatus(selectedRequestId, selectedStatus, remark);

      // 2. Create certificate log
      await createCertificateLog({
        document_request: selectedRequestId,
        staff: user.id,
        remark: `Status changed to ${selectedStatus}. ${remark ? `Remarks: ${remark}` : ''}`
      });

      showCustomToast('Status updated successfully', 'success');
      loadRequests();
      setShowRemarkModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      showCustomToast(error.message || 'Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (row) => {
    try {
      setLoading(true);
      const response = await getRequestById(row.id);
      setSelectedRequest(response);
      setViewModalOpen(true);
    } catch (error) {
      showCustomToast(error.message || 'Failed to fetch request details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPdf = (url) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const fullUrl = `${baseUrl}/storage/${url}`;
    setSelectedPdf(fullUrl);
    setShowPdfModal(true);
  };

  const handleDownloadFilledDocument = async (requestId) => {
    try {
      setLoading(true);
      showCustomToast('Generating filled document...', 'info');
      
      const response = await generateFilledDocument(requestId);
      
      // Get the file URL from response
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const fileUrl = `${baseUrl}${response.file_url}`;
      
      // Extract filename from file_path
      const filename = response.file_path.split('/').pop();
      
      // Create download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      link.target = '_blank'; // Open in new tab as fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showCustomToast('Document downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading filled document:', error);
      showCustomToast(error.message || 'Failed to download filled document', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [page, search, sortConfig, filters]);

  // Enhanced columns with more details
  const columns = [
    {
      label: 'Transaction ID',
      accessor: 'transaction_id',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-800">{value}</span>
      ),
    },
    {
      label: 'Document Name',
      accessor: 'document_details',
      sortable: true,
      render: (docDetails) => (
        <span className="text-sm font-medium text-gray-800">
          {docDetails?.document_name || 'N/A'}
        </span>
      ),
    },
    {
      label: 'Requestor Info',
      accessor: 'account',
      sortable: true,
      render: (account) => (
        <div className="text-xs space-y-1">
          <p className="font-medium text-gray-800">
            {`${account?.first_name || ''} ${account?.last_name || ''}`}
          </p>
          <p className="text-gray-600">{account?.contact_no || 'No contact'}</p>
        </div>
      ),
    },
    {
      label: 'Address',
      accessor: 'account.address', // Changed from just 'account'
      sortable: false,
      render: (_, row) => ( // Using row parameter to access full account object
        <div className="text-xs text-gray-600">
          <p>{`${row.account.house_no} ${row.account.street}`}</p>
          <p>{`${row.account.barangay}, ${row.account.municipality}`}</p>
        </div>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      type: 'badge',
      badgeColors: STATUS_COLORS,
      render: (value) => (
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${STATUS_COLORS[value] ? `bg-${STATUS_COLORS[value]}-100 text-${STATUS_COLORS[value]}-800` : 'bg-gray-100 text-gray-800'}`}
          >
            {value}
          </span>
         
        </div>
      )
    },
    {
      label: 'Date Requested',
      accessor: 'created_at',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: 'Requirements',
      accessor: 'uploaded_requirements',
      sortable: false,
      render: (requirements, row) => {
        // Only show requirements that belong to this specific request
        const requestRequirements = requirements.filter(req => 
          req.document === row.document
        );

        if (!requestRequirements || requestRequirements.length === 0) {
          return <span className="text-xs text-gray-500">No requirements uploaded</span>;
        }

        return (
          <div className="space-y-2">
            {requestRequirements.map((req) => (
              <div key={req.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <FaFilePdf className="w-4 h-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-700">{req.requirement?.name}</p>
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
        );
      }
    }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">Request Management</h3>
            <p className="text-sm text-gray-500 mt-1">View and manage all certificate requests</p>
          </div>

          <div className="p-6">
            <DataTable
              columns={columns}
              data={requests}
              loading={loading}
              enableSearch={true}
              searchValue={search}
              onSearchChange={setSearch}
              enablePagination={true}
              enableSelection={false}
              onPageChange={setPage}
              totalItems={total}
              currentPage={page}
              searchPlaceholder="Search requests..."
              comboBoxFilter={{
                label: "Status",
                value: filters.status,
                onChange: (value) => setFilters(prev => ({ ...prev, status: value })),
                options: STATUS_OPTIONS
              }}
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: 'View Details',
                  onClick: handleViewDetails,
                },
                {
                  icon: <FaFileWord className="h-3.5 w-3.5 text-blue-400" />,
                  label: 'Download Filled Document',
                  onClick: (row) => handleDownloadFilledDocument(row.id),
                  show: (row) => row.document_details?.template_path && ['processing', 'ready to pickup', 'released'].includes(row.status),
                },
                {
                  icon: <FaCheck className="h-3.5 w-3.5 text-gray-400" />,
                  label: 'Process',
                  onClick: (row) => handleStatusUpdateClick(row.id, 'processing'),
                  show: (row) => row.status === 'pending',
                },
                {
                  icon: <FaCheck className="h-3.5 w-3.5 text-gray-400" />,
                  label: 'Ready for Pickup',
                  onClick: (row) => handleStatusUpdateClick(row.id, 'ready to pickup'),
                  show: (row) => row.status === 'processing',
                },
                {
                  icon: <FaCheck className="h-3.5 w-3.5 text-gray-400" />,
                  label: 'Release',
                  onClick: (row) => handleStatusUpdateClick(row.id, 'released'),
                  show: (row) => row.status === 'ready to pickup',
                },
                {
                  icon: <FaTimes className="h-3.5 w-3.5 text-gray-400" />,
                  label: 'Reject',
                  onClick: (row) => handleStatusUpdateClick(row.id, 'rejected'),
                  show: (row) => ['pending', 'processing'].includes(row.status),
                },
              ]}
            />
          </div>
        </div>

        <ViewRequestModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          request={selectedRequest}
        />

        {/* Add Remark Modal */}
        <ConfirmationModal
          isOpen={showRemarkModal}
          onClose={() => setShowRemarkModal(false)}
          onConfirm={handleStatusUpdate}
          title="Update Request Status"
          confirmText="Update"
          cancelText="Cancel"
        >
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to change the status to <span className="font-medium">{selectedStatus}</span>?
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Remarks (Optional)
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                rows={3}
                placeholder="Enter any additional remarks..."
              />
            </div>
          </div>
        </ConfirmationModal>

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
      </div>
    </>
  );
};

export default RequestManagement;
