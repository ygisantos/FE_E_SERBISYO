import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import DataTable from '../../components/reusable/DataTable';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAllRequests } from '../../api/documentApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import ViewRequestModal from '../../components/modals/ViewRequestModal';

const MyRequests = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });

  const requestColumns = [
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
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          value === 'pending' ? 'bg-yellow-50 text-yellow-700' :
          value === 'processing' ? 'bg-blue-50 text-blue-700' :
          value === 'approved' ? 'bg-green-50 text-green-700' :
          value === 'ready to pickup' ? 'bg-indigo-50 text-indigo-700' :
          value === 'released' ? 'bg-emerald-50 text-emerald-700' :
          'bg-red-50 text-red-700'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    }
  ];

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const response = await getAllRequests({
          per_page: 10,
          page,
          ...sortConfig, // Add sort parameters to API call
          requestor: currentUser?.id
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
  }, [currentUser, page, sortConfig]); // Add sortConfig to dependencies

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track your certificate requests
            </p>
          </div>

          <DataTable
            columns={requestColumns}
            data={requests}
            loading={loading}
            enableSearch={true}
            enablePagination={true}
            enableSelection={false}
            totalItems={total}
            currentPage={page}
            onPageChange={setPage}
            itemsPerPage={10}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: 'View Details',
                onClick: handleViewRequest,
              }
            ]}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>
      </div>

      {/* View Request Modal */}
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

export default MyRequests;
