import React, { useState } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye } from 'react-icons/fa';

const WorkerCertificateLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      certificateType: 'Barangay Clearance',
      residentName: 'Juan Dela Cruz',
      requestDate: '2024-07-25',
      status: 'Approved',
      actionDate: '2024-07-25',
      remarks: 'Approved and released'  ,
    },
   ]);

  const columns = [
    {
      label: 'Certificate Type',
      accessor: 'certificateType',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-800">{value}</span>
      ),
    },
    {
      label: 'Resident Name',
      accessor: 'residentName',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">{value}</span>
      ),
    },
    {
      label: 'Request Date',
      accessor: 'requestDate',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      type: 'badge',
      badgeColors: {
        Approved: 'green',
        Rejected: 'red',
        Pending: 'yellow'
      }
    },
    {
      label: 'Action Date',
      accessor: 'actionDate',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: 'Remarks',
      accessor: 'remarks',
      sortable: false,
      render: (value) => (
        <span className="text-xs text-gray-600">{value}</span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Certificate Logs
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            View history of processed certificates
          </p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={logs}
            enableSearch={true}
            enablePagination={true}
            itemsPerPage={10}
            searchPlaceholder="Search certificates..."
            comboBoxFilter={{
              label: "Status",
              options: [
                { value: '', label: 'All Status' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Pending', label: 'Pending' }
              ],
              value: '',
              onChange: () => {}
            }}
            dateFilter={{
              label: "Date Range",
              startDate: '',
              endDate: '',
              onStartDateChange: () => {},
              onEndDateChange: () => {}
            }}
            actions={[
              {
                icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                label: 'View Details',
                onClick: (row) => console.log('View', row),
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkerCertificateLogs;
