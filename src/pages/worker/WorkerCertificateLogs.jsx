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
      remarks: 'Approved and released',
    },
   ]);

  const columns = [
    {
      label: 'Certificate Type',
      accessor: 'certificateType',
      sortable: true,
    },
    {
      label: 'Resident Name',
      accessor: 'residentName',
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
            value === 'Approved'
              ? 'bg-green-50 text-green-700'
              : value === 'Rejected'
              ? 'bg-red-50 text-red-700'
              : 'bg-yellow-50 text-yellow-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      label: 'Action Date',
      accessor: 'actionDate',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      label: 'Remarks',
      accessor: 'remarks',
      sortable: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Certificate Logs</h1>
            <p className="mt-2 text-sm text-gray-600">
              View history of your processed certificates
            </p>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-4">
              <select className="border rounded-lg px-3 py-2">
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="date"
                className="border rounded-lg px-3 py-2"
                placeholder="Filter by date"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Export Logs
            </button>
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
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkerCertificateLogs;
