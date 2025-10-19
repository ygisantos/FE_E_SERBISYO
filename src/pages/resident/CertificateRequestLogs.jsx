import React, { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchAllRequests } from '../../api/requestApi';
import { useUser } from '../../contexts/UserContext';

const CertificateRequestLogs = () => {
  const navigate = useNavigate();

  // API state
  const { currentUser, loading: userLoading } = useUser();
  const [requestLogs, setRequestLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('pending');
  const perPage = 10;

  const fetchRequests = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAllRequests({
        status,
        requestor: currentUser.id,
        per_page: perPage,
        page,
        sort_by: 'document',
        order: 'desc',
        search,
      });
      // Map API data to DataTable fields
      const mapped = (res.data || []).map((item) => ({
        id: item.id,
        referenceNo: item.transaction_id,
        certificateType: item.document_details?.document_name || '',
        requestDate: item.created_at,
        processedDate: item.updated_at !== item.created_at ? item.updated_at : null,
        status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '',
        purpose: item.information?.purpose || '',
        paymentStatus: item.payment_status ? (item.payment_status === 'paid' ? 'Paid' : 'Unpaid') : 'Unpaid',
        amount: item.amount || '',
      }));
      setRequestLogs(mapped);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err?.toString() || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [currentUser, page, status, search]);

  useEffect(() => {
    if (!userLoading && currentUser?.id) {
      fetchRequests();
    }
  }, [userLoading, currentUser, fetchRequests]);

  // Handle search from DataTable
  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const columns = [
    {
      label: 'Reference No.',
      accessor: 'referenceNo',
      sortable: true,
    },
    {
      label: 'Certificate',
      accessor: 'certificateType',
      sortable: true,
    },
    {
      label: 'Request Date',
      accessor: 'requestDate',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      label: 'Processed Date',
      accessor: 'processedDate',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Pending'
              ? 'bg-yellow-50 text-yellow-700'
              : value === 'Processing'
              ? 'bg-blue-50 text-blue-700'
              : value === 'Completed'
              ? 'bg-green-50 text-green-700'
              : value === 'Rejected'
              ? 'bg-red-50 text-red-700'
              : 'bg-gray-50 text-gray-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      label: 'Purpose',
      accessor: 'purpose',
      sortable: true,
    },
    {
      label: 'Payment',
      accessor: 'paymentStatus',
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className={`text-sm ${value === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
            {value}
          </span>
          <span className="text-xs text-gray-500">₱{row.amount}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Certificate Request History</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track and manage all your certificate requests
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <div>
              <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 mr-2">Status:</label>
              <select
                id="statusFilter"
                value={status}
                onChange={handleStatusChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="released">Released</option>
                <option value="rejected">Rejected</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="ready to pickup">Ready to Pickup</option>
              </select>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={requestLogs}
            enableSearch={false}
            searchPlaceholder="Search by reference number, type..."
            onSearch={handleSearch}
            searchValue={search}
            enablePagination={true}
            itemsPerPage={perPage}
            loading={loading || userLoading}
            totalItems={total}
            currentPage={page}
            onPageChange={setPage}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: 'View Details',
                onClick: (row) => navigate(`/resident/certificates/view/${row.id}`),
              },
              {
                icon: <FaDownload className="text-green-600" />,
                label: 'Download',
                onClick: (row) => console.log('Download', row),
                show: (row) => row.status === 'Completed',
              },
            ]}
          />

          {/* Status Legend */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status Legend:</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-sm text-gray-600">Pending - Request is being reviewed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-600">Processing - Document is being prepared</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600">Completed - Ready for pickup/download</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-600">Rejected - Request was denied</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateRequestLogs;
