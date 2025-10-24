import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaFilePdf, FaDownload, FaFileWord } from 'react-icons/fa';
import { fetchAllRequests, updateRequestStatus, getRequestById } from '../../api/requestApi';
import { generateFilledDocument } from '../../api/documentApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import ViewRequestModal from '../../components/modals/ViewRequestModal';
import { createCertificateLog } from '../../api/certificateLogApi';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Modal/Modal';
import { ChevronDown } from 'lucide-react';

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
  const [expandedRequirements, setExpandedRequirements] = useState(null);
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
    'ready to pickup': 'purple',
    released: 'green',
    rejected: 'red'
  };

  const loadRequests = async (params = {}) => {
    try {
      setLoading(true);
      const response = await fetchAllRequests({
        page: params.page || page,
        per_page: params.per_page || 10,
        search: params.search || search,
        status: params.status,  
        sort_by: params.sort_by || sortConfig.sort_by,
        order: params.order || sortConfig.order
      });
      
      if (response?.data) {
        setRequests(response.data);
        setTotal(response.total || 0);
      } else {
        setRequests([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Load requests error:', error);
      setRequests([]);
      setTotal(0);
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

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // Update request status
      await updateRequestStatus(requestId, newStatus);

      // Create certificate log
      await createCertificateLog({
        document_request: requestId,
        staff: user.id,
        remark: `Status changed to ${newStatus}`
      });

      // After status update, refresh the specific request
      const updatedRequest = await getRequestById(requestId);
      setSelectedRequest(updatedRequest); // Update modal data
      loadRequests(); // Refresh the table

    } catch (error) {
      showCustomToast(error.message || 'Failed to update status', 'error');
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

  // Keep the getFileUrl function
  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    

    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^requirements\//, '');
    return `${storageUrl}/requirements/${cleanPath}`;
  };

  const handlePreviewPdf = (url) => {
    const fullUrl = getFileUrl(url);
    setSelectedPdf(fullUrl);
    setShowPdfModal(true);
  };

  const handleDownloadFilledDocument = async (requestId) => {
    try {
      setLoading(true);
      showCustomToast('Generating filled document...', 'info');
      
      const response = await generateFilledDocument(requestId);
      
      // Construct the correct URL using environment variable
      const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
      const fileUrl = `${storageUrl}/${response.file_path}`;
      
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
      console.error('Download error:', error);
      showCustomToast(error.message || 'Failed to download document', 'error');
    } finally {
      setLoading(false);
    }
  };


  const sortFieldMap = {
    'transaction_id': 'transaction_id',
    'document_details': 'document',  
    'created_at': 'created_at'
  };

  useEffect(() => {
    loadRequests({
      page,
      per_page: 10,
      search,
      status: filters.status,
      sort_by: sortConfig.sort_by,
      order: sortConfig.order
    });
  }, [page, search, filters.status, sortConfig.sort_by, sortConfig.order]);

  const handleStatusFilter = (value) => {
    setFilters(prev => ({ ...prev, status: value }));
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = ({ column, direction }) => {
    const backendField = sortFieldMap[column] || column;
    setSortConfig({
      sort_by: backendField,
      order: direction.toLowerCase()
    });
    setPage(1);
  };

  const toggleRequirements = (rowId) => {
    setExpandedRequirements(expandedRequirements === rowId ? null : rowId);
  };

  const columns = [
    {
      label: 'Transaction ID',
      accessor: 'transaction_id',
      sortable: true,
      sortField: 'transaction_id',
      render: (value) => (
        <span className="text-sm font-medium text-gray-800">{value}</span>
      ),
    },
    {
      label: 'Document Name',
      accessor: 'document_details',
      sortable: true,
      sortField: 'document',
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
      accessor: 'account.address',  
      sortable: false,
      render: (_, row) => (  
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
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
          ${value === 'pending' ? 'bg-yellow-50 text-yellow-700' :
          value === 'processing' ? 'bg-blue-50 text-blue-700' :
          value === 'approved' ? 'bg-emerald-50 text-emerald-700' :
          value === 'ready to pickup' ? 'bg-purple-50 text-purple-700' :
          value === 'released' ? 'bg-green-50 text-green-700' :
          value === 'rejected' ? 'bg-red-50 text-red-700' :
          'bg-gray-50 text-gray-700'}`}
        >
          {value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      )
    },
    {
      label: 'Date Requested',
      accessor: 'created_at',
      sortable: true,
      sortField: 'created_at',
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
        const requestRequirements = requirements.filter(req => 
          req.document === row.document
        );

        if (!requestRequirements || requestRequirements.length === 0) {
          return <span className="text-xs text-gray-500">No requirements</span>;
        }

        return (
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => toggleRequirements(row.id)}
            >
              <span className="text-xs font-medium text-gray-700">
                {requestRequirements.length} {requestRequirements.length === 1 ? 'Requirement' : 'Requirements'}
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedRequirements === row.id ? 'rotate-180' : ''
                }`}
              />
            </div>
            
            {expandedRequirements === row.id && (
              <div className="mt-2 space-y-2 pl-2">
                {requestRequirements.map((req) => (
                  <div 
                    key={req.id} 
                    className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FaFilePdf className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-xs text-gray-600">{req.requirement?.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewPdf(req.file_path);
                      }}
                      className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <FaEye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              onSearchChange={handleSearch}
              enablePagination={true}
              enableSelection={false}
              onPageChange={setPage}
              totalItems={total}
              currentPage={page}
              searchPlaceholder="Search requests..."
              comboBoxFilter={{
                label: "Status",
                value: filters.status,
                onChange: handleStatusFilter,
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
                }
              ]}
              onSort={handleSort}
              sortConfig={{
                field: sortConfig.sort_by,
                direction: sortConfig.order
              }}
            />
          </div>
        </div>

        <ViewRequestModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          request={selectedRequest}
          isStaff={true}
          onUpdateStatus={handleStatusUpdate}
          onStatusUpdate={async (requestId) => {
            // Refresh request data after status update
            const updatedRequest = await getRequestById(requestId);
            setSelectedRequest(updatedRequest);
          }}
          getFileUrl={getFileUrl}  
        />

        {/* Add Remark Modal */}
        <ConfirmationModal
          isOpen={showRemarkModal}
          onClose={() => setShowRemarkModal(false)}
          onConfirm={handleStatusUpdate}
          title="Update Request Status"
          confirmText="Update"
        />
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
