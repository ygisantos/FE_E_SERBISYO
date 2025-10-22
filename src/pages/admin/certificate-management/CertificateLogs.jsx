import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { FaEye } from 'react-icons/fa';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import ViewRequestModal from '../../../components/modals/ViewRequestModal';

const CertificateLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    from_date: '',
    to_date: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetchCertificateLogs({ page, search, ...filters });
      // setLogs(response.data);
      // setTotal(response.total);
    } catch (error) {
      showCustomToast('Failed to fetch certificate logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, filters]);

  const handleView = (log) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  const columns = [
    {
      label: 'Certificate',
      accessor: 'certificate',
      sortable: true
    },
    {
      label: 'Resident',
      accessor: 'resident',
      sortable: true
    },
    {
      label: 'Request Date',
      accessor: 'requestDate',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      type: 'badge',
      badgeColors: {
        completed: 'green',
        pending: 'yellow',
        processing: 'blue',
        rejected: 'red'
      }
    },
    {
      label: 'Processed By',
      accessor: 'processedBy',
      sortable: true
    },
    {
      label: 'Completion Date',
      accessor: 'completionDate',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Certificate Logs</h3>
          <p className="mt-1 text-sm text-gray-500">View all certificate request history</p>
        </div>
        
        <div className="p-6">
          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            enableSearch={true}
            searchValue={search}
            onSearchChange={setSearch}
            enablePagination={true}
            onPageChange={setPage}
            totalItems={total}
            currentPage={page}
            searchPlaceholder="Search certificates..."
            comboBoxFilter={{
              label: "Status",
              value: filters.status,
              onChange: (value) => handleFilterChange("status", value),
              options: statusOptions
            }}
            dateFilter={{
              label: "Date Range",
              startDate: filters.from_date,
              endDate: filters.to_date,
              onStartDateChange: (value) => handleFilterChange("from_date", value),
              onEndDateChange: (value) => handleFilterChange("to_date", value)
            }}
            actions={[
              {
                icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                label: "View Details",
                onClick: handleView
              }
            ]}
          />
        </div>
      </div>

      {showViewModal && (
        <ViewRequestModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedLog(null);
          }}
          request={selectedLog}
        />
      )}
    </div>
  );
};

export default CertificateLogs;
