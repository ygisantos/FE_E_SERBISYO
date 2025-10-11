import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { fetchAllRequests, updateRequestStatus, getRequestById } from '../../api/requestApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import ViewRequestModal from '../../components/modals/ViewRequestModal';

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
        status: filters.status || 'pending', 
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

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setLoading(true);
      const response = await updateRequestStatus(requestId, newStatus);
      showCustomToast(response.message || 'Status updated successfully', 'success');
      loadRequests(); // Reload the requests after update
    } catch (error) {
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
      badgeColors: STATUS_COLORS
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
      render: (requirements) => (
        <div className="space-y-1">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-600">
                {req.requirement.name}
                <a 
                  href={`/storage/${req.file_path}`} 
                  target="_blank" 
                  className="ml-2 text-blue-600 hover:underline"
                >
                  View
                </a>
              </span>
            </div>
          ))}
        </div>
      ),
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">Residence Certificate Requests</h3>
          <p className="text-xs text-gray-500 mt-1">
            Manage and process document requests from residents
          </p>
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
            onPageChange={setPage}
            totalItems={total}
            currentPage={page}
            searchPlaceholder="Search requests..."
            comboBoxFilter={{
              label: "Status",
              options: STATUS_OPTIONS,
              value: filters.status,
              onChange: (value) => setFilters(prev => ({ ...prev, status: value }))
            }}
            actions={[
              {
                icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                label: 'View Details',
                onClick: handleViewDetails,
              },
              {
                icon: <FaCheck className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Process',
                onClick: (row) => handleStatusUpdate(row.id, 'processing'),
                show: (row) => row.status === 'pending',
              },
              {
                icon: <FaCheck className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Ready for Pickup',
                onClick: (row) => handleStatusUpdate(row.id, 'ready to pickup'),
                show: (row) => row.status === 'processing',
              },
              {
                icon: <FaCheck className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Release',
                onClick: (row) => handleStatusUpdate(row.id, 'released'),
                show: (row) => row.status === 'ready to pickup',
              },
              {
                icon: <FaTimes className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Reject',
                onClick: (row) => handleStatusUpdate(row.id, 'rejected'),
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
    </div>
  );
};

export default RequestManagement;
