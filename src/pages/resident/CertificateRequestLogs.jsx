import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye } from 'react-icons/fa';
import { getAllRequests } from '../../api/documentApi';
import { useUser } from '../../contexts/UserContext';
import ViewRequestModal from '../../components/modals/ViewRequestModal';
import { showCustomToast } from '../../components/Toast/CustomToast';

const CertificateRequestLogs = () => {
  const { currentUser } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc',
  });
  const [status, setStatus] = useState('');

  const columns = [
    {
      label: 'Transaction ID',
      accessor: 'transaction_id',
      sortable: true,
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
      label: 'Request Date',
      accessor: 'created_at',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === 'pending'
              ? 'bg-yellow-50 text-yellow-700'
              : value === 'processing'
              ? 'bg-blue-50 text-blue-700'
              : value === 'approved'
              ? 'bg-green-50 text-green-700'
              : value === 'ready to pickup'
              ? 'bg-indigo-50 text-indigo-700'
              : value === 'released'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const response = await getAllRequests({
          per_page: 10,
          page,
          ...sortConfig,
          requestor: currentUser?.id,
          status: status || undefined,
        });

        setRequests(response.data);
        setTotal(response.total || response.data.length);
      } catch (error) {
        showCustomToast(error.message || 'Failed to load requests', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadRequests();
    }
  }, [currentUser, page, sortConfig, status]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction,
    });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'approved', label: 'Approved' },
    { value: 'ready to pickup', label: 'Ready to Pickup' },
    { value: 'released', label: 'Released' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Status legend configuration
  const statusLegend = [
    {
      color: 'yellow',
      label: 'Pending',
      description: 'Your request is being reviewed',
    },
    {
      color: 'blue',
      label: 'Processing',
      description: 'Certificate is being prepared',
    },
    {
      color: 'green',
      label: 'Approved',
      description: 'Request has been approved',
    },
    {
      color: 'indigo',
      label: 'Ready to Pickup',
      description: 'Certificate is ready for pickup',
    },
    {
      color: 'emerald',
      label: 'Released',
      description: 'Certificate has been released',
    },
    {
      color: 'red',
      label: 'Rejected',
      description: 'Request was not approved',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Status Legend */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Certificate Request History
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Track your certificate requests
            </p>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Request Status Guide:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {statusLegend.map(({ color, label, description }) => (
                  <div key={label} className="flex items-start gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 bg-${color}-500 flex-shrink-0`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DataTable
            size='small'
            columns={columns}
            data={requests}
            loading={loading}
            enableSearch={false}
            enablePagination={true}
            enableSelection={false}
            totalItems={total}
            currentPage={page}
            onPageChange={setPage}
            itemsPerPage={10}
            comboBoxFilter={{
              label: 'Status',
              value: status,
              onChange: (value) => {
                setStatus(value);
                setPage(1);
              },
              options: statusOptions,
            }}
            actions={[
              {
                icon: <FaEye className="h-3.5 w-3.5 text-blue-600" />,
                label: 'View Details',
                onClick: handleViewRequest,
              },
            ]}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>
      </div>

      <ViewRequestModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
      />
    </div>
  );
};

export default CertificateRequestLogs;
