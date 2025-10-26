import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { getAllCertificateLogs } from '../../../api/certificateLogApi';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import { useAuth } from '../../../contexts/AuthContext';

const CertificateLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });
  const [search, setSearch] = useState('');
  const { user } = useAuth(); // Get current logged in user

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getAllCertificateLogs({
        page: currentPage,
        per_page: 10,
        // No staff filter for admin to get all logs
        sort_by: sortConfig.sort_by,
        order: sortConfig.order,
        search: search
      });

      if (response?.success && Array.isArray(response.data)) {
        setLogs(response.data);
        setTotalItems(response.total || 0);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      showCustomToast('Failed to fetch logs', 'error');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, sortConfig, search]); 

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction.toLowerCase()
    });
  };

  const columns = [
    {
      label: 'Transaction ID',
      accessor: 'document_request.transaction_id',
      sortable: true,
      render: (_, row) => (
        <span className="text-sm font-medium text-gray-800">
          {row.document_request?.transaction_id || 'N/A'}
        </span>
      )
    },
    {
      label: 'Staff',
      accessor: 'staff_account',
      sortable: true,
      render: (staff) => (
        <div className="text-xs">
          <p className="font-medium text-gray-800">
            {staff ? `${staff.first_name} ${staff.last_name}` : 'N/A'}
          </p>
          <p className="text-gray-600">{staff?.type || ''}</p>
        </div>
      )
    },
    {
      label: 'Requestor',
      accessor: 'document_request.account',
      sortable: true,
      render: (_, row) => (
        <div className="text-xs">
          <p className="font-medium text-gray-800">
            {row.document_request?.account ? 
              `${row.document_request.account.first_name} ${row.document_request.account.last_name}` 
              : 'N/A'}
          </p>
          <p className="text-gray-600">{row.document_request?.account?.email || ''}</p>
        </div>
      )
    },
    {
      label: 'Document',
      accessor: 'document_request',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-800">
          {value?.document_details?.document_name || 'N/A'}
        </span>
      )
    },
    {
      label: 'Action',
      accessor: 'remark',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value || 'N/A'}
        </span>
      )
    },
    {
      label: 'Date & Time',
      accessor: 'created_at',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Certificate Processing Logs</h3>
          <p className="mt-1 text-sm text-gray-500">
            View complete history of all certificate processing activities
          </p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            enablePagination={true}
            enableSelection={false}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
            enableSearch={true}
            searchValue={search}
            onSearchChange={handleSearch}
            searchPlaceholder="Search by transaction ID, staff, or action..."
            onSort={handleSort}
            sortConfig={{
              field: sortConfig.sort_by,
              direction: sortConfig.order
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateLogs;
