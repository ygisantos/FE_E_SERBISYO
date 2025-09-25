import React, { useState } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { FaEye, FaTrash } from 'react-icons/fa';

const CertificateLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      certificate: 'Barangay Clearance',
      resident: 'Juan Dela Cruz',
      requestDate: '2024-07-25',
      status: 'Completed',
      processedBy: 'Admin User',
      completionDate: '2024-07-26',
    },

  ]);

  const columns = [
    {
      label: 'Certificate Type',
      accessor: 'certificate',
      sortable: true,
    },
    {
      label: 'Resident Name',
      accessor: 'resident',
      sortable: true,
    },
    {
      label: 'Request Date',
      accessor: 'requestDate',
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
            value === 'Completed'
              ? 'bg-green-50 text-green-700'
              : value === 'Pending'
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      label: 'Processed By',
      accessor: 'processedBy',
      sortable: true,
    },
    {
      label: 'Completion Date',
      accessor: 'completionDate',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Certificate Logs</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track all certificate requests and their status
            </p>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-4">
              <select className="border rounded-lg px-3 py-2">
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="date"
                className="border rounded-lg px-3 py-2"
                placeholder="Filter by date"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={logs}
            enableSearch={true}
            enablePagination={true}
            itemsPerPage={10}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: 'View Details',
                onClick: (row) => console.log('View', row),
              },
              {
                icon: <FaTrash className="text-red-600" />,
                label: 'Delete Log',
                onClick: (row) => console.log('Delete', row),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateLogs;
