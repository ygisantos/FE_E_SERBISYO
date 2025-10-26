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
  const [search, setSearch] = useState('');

  const { user } = useAuth();  

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction.toLowerCase()
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);  
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getAllCertificateLogs({
        page: currentPage,
        per_page: 10,
        staff: user?.id, // Filter by staff ID for worker view
        sort_by: sortConfig.sort_by,
        order: sortConfig.order,
        search: search
      });

      if (response?.success && Array.isArray(response.data)) {
        setLogs(response.data);
        setTotalItems(response.total || 0);
      } else {
        console.error('Invalid response format:', response);
        setLogs([]);
        setTotalItems(0);
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
    if (user?.id) {
      fetchLogs();
    }
  }, [currentPage, user?.id, sortConfig, search]);  

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
      label: 'Document Type',  // Changed label
      accessor: 'document_request.document_details',  // Changed accessor
      sortable: true,
      render: (_, row) => (
        <span className="text-sm font-medium text-gray-800">
          {row.document_request?.document_details?.document_name || 'N/A'}
        </span>
      )
    },
    {
      label: 'Requestor',
      accessor: 'document_request.requestor_details',  // Changed accessor
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
    // {
    //   label: 'Status',
    //   accessor: 'document_request.status',
    //   sortable: true,
    //   render: (_, row) => (
    //     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
    //       ${row.document_request?.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
    //       row.document_request?.status === 'processing' ? 'bg-blue-50 text-blue-700' :
    //       row.document_request?.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
    //       row.document_request?.status === 'ready to pickup' ? 'bg-purple-50 text-purple-700' :
    //       row.document_request?.status === 'released' ? 'bg-green-50 text-green-700' :
    //       row.document_request?.status === 'rejected' ? 'bg-red-50 text-red-700' :
    //       'bg-gray-50 text-gray-700'}`}
    //     >
    //       {row.document_request?.status ? 
    //         row.document_request.status.split(' ').map(word => 
    //           word.charAt(0).toUpperCase() + word.slice(1)
    //         ).join(' ') 
    //         : 'N/A'}
    //     </span>
    //   )
    // },
    {
      label: 'Remark',
      accessor: 'remark',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value || 'N/A'}
        </span>
      )
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
            enableSelection={false}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={10}
            enableSearch={true}
            searchValue={search}
            onSearchChange={handleSearch}
            searchPlaceholder="Search by remark,transaction id, document type..."
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

export default WorkerCertificateLogs;
