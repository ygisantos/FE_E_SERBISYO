import React, { useState } from 'react';
import DataTable from '../../components/reusable/DataTable';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 4,
      account: {
        id: 1,
        email: "admin@example.com",
        type: "admin",
        first_name: "System",
        last_name: "Administrator",
      },
      module: "Auth",
      remark: "Logged in",
      created_at: "2025-08-30T11:56:55.000000Z",
    },
    // Add more mock data here if needed
  ]);

  const columns = [
    {
      label: 'Module',
      accessor: 'module',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      label: 'User',
      accessor: 'account',
      sortable: true,
      render: (account) => account ? (
        <div>
          <div className="font-medium text-gray-900">
            {`${account.first_name || ''} ${account.last_name || ''}`}
          </div>
          <div className="text-sm text-gray-500">{account.email || 'N/A'}</div>
        </div>
      ) : (
        <div>N/A</div>
      ),
    },
    {
      label: 'User Type',
      accessor: 'account.type',
      sortable: true,
      render: (value) => {
        const type = value || 'N/A';
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              type === 'admin'
                ? 'bg-purple-50 text-purple-700'
                : type === 'worker'
                ? 'bg-blue-50 text-blue-700'
                : type === 'resident'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-600'
            }`}
          >
            {type === 'N/A' ? type : type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        );
      },
    },
    {
      label: 'Action',
      accessor: 'remark',
      sortable: true,
      render: (value) => (
        <span className="text-gray-900">{value}</span>
      ),
    },
    {
      label: 'Timestamp',
      accessor: 'created_at',
      sortable: true,
      render: (value) => (
        <span className="text-gray-500">
          {new Date(value).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track all system activities and user actions
            </p>
          </div>

          <DataTable
            columns={columns}
            data={logs}
            enableSearch={true}
            enableSelection={false}
            enablePagination={true}
            itemsPerPage={10}
            searchPlaceholder="Search by module or action..."
            filterOptions={{
              module: {
                label: 'Module',
                options: [
                  { value: '', label: 'All Modules' },
                  { value: 'Auth', label: 'Authentication' },
                  { value: 'User', label: 'User Management' },
                  { value: 'Certificate', label: 'Certificates' }
                ]
              },
              'account.type': {
                label: 'User Type',
                options: [
                  { value: '', label: 'All User Types' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'worker', label: 'Worker' },
                  { value: 'resident', label: 'Resident' }
                ]
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
