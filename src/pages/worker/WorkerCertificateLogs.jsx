import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { getAllCertificateLogs } from '../../api/certificateLogApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import { useAuth } from '../../contexts/AuthContext';

const WorkerCertificateLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });

  const { user } = useAuth(); // Get current logged in user

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await getAllCertificateLogs({
          page: currentPage,
          per_page: 10,
          staff: user?.id, // Filter by current staff ID
          sort_by: sortConfig.sort_by,
          order: sortConfig.order
        });

        if (response?.data) {
          setLogs(response.data);
          setTotalItems(response.pagination?.total || 0);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        showCustomToast('Failed to fetch logs', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) { // Only fetch if we have user ID
      fetchLogs();
    }
  }, [currentPage, user?.id, sortConfig]);

  const columns = [
    {
      label: 'Document Request',
      accessor: 'document_request',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-800">
          {value?.document?.document_name || 'N/A'}
        </span>
      )
    },
    {
      label: 'Requestor',
      accessor: 'document_request.account',
      sortable: true,
      render: (account) => (
        <div className="text-xs">
          <p className="font-medium text-gray-800">
            {account ? `${account.first_name} ${account.last_name}` : 'N/A'}
          </p>
          <p className="text-gray-600">{account?.email || ''}</p>
        </div>
      )
    },
    {
      label: 'Status',
      accessor: 'document_request.status',
      sortable: true,
      type: 'badge',
      badgeColors: {
        pending: 'yellow',
        processing: 'blue',
        approved: 'green',
        rejected: 'red'
      }
    },
    {
      label: 'Remark',
      accessor: 'remark',
      sortable: true,
    },
    {
      label: 'Date',
      accessor: 'created_at',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">My Certificate Logs</h3>
          <p className="mt-1 text-sm text-gray-500">View history of certificates you have processed</p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            enablePagination={true}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkerCertificateLogs;
