import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { fetchAllRequests } from '../../api/requestApi';
import { showCustomToast } from '../../components/Toast/CustomToast';

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

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchAllRequests({
        page,
        search,
        ...sortConfig,
        ...filters
      });
      
      setRequests(response.data);
      setTotal(response.total);
    } catch (error) {
      showCustomToast(error.message || 'Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [page, search, sortConfig, filters]);

  const columns = [
    {
      label: 'Document Name',
      accessor: 'document.document_name',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-800">{value}</span>
      ),
    },
    {
      label: 'Requestor',
      accessor: 'account',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {`${value.first_name} ${value.last_name}`}
        </span>
      ),
    },
    {
      label: 'Requirements',
      accessor: 'uploaded_requirements',
      sortable: false,
      render: (value) => (
        <div className="space-y-1">
          {value.slice(0, 2).map((req, idx) => (
            <span key={idx} className="text-xs text-gray-600 block">
              {req.requirement.name}
            </span>
          ))}
          {value.length > 2 && (
            <span className="text-xs text-gray-400">
              +{value.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      type: 'badge',
      badgeColors: {
        pending: 'yellow',
        approved: 'emerald',
        rejected: 'gray'
      }
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
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Certificate Requests
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Process and manage certificate requests
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
              options: [
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ],
              value: filters.status,
              onChange: (value) => setFilters(prev => ({ ...prev, status: value }))
            }}
            actions={[
              {
                icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                label: 'View Details',
                onClick: (row) => console.log('View', row),
              },
              {
                icon: <FaCheck className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Approve',
                onClick: (row) => console.log('Approve', row),
                show: (row) => row.status === 'pending',
              },
              {
                icon: <FaTimes className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Reject',
                onClick: (row) => console.log('Reject', row),
                show: (row) => row.status === 'pending',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestManagement;
