import React, { useState } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const RequestManagement = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      residentName: 'Juan Dela Cruz',
      certificateType: 'Barangay Clearance',
      requestDate: '2024-07-25',
      status: 'Pending',
      purpose: 'Employment',
    },
   ]);

  const columns = [
    {
      label: 'Resident Name',
      accessor: 'residentName',
      sortable: true,
    },
    {
      label: 'Certificate Type',
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
      label: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Pending'
              ? 'bg-yellow-50 text-yellow-700'
              : value === 'Approved'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
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
  ];

  const handleApprove = (row) => {
    // Add logic for approving request
    console.log('Approve', row);
  };

  const handleReject = (row) => {
    // Add logic for rejecting request
    console.log('Reject', row);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Process and manage certificate requests
            </p>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-4">
              <select className="border rounded-lg px-3 py-2">
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select className="border rounded-lg px-3 py-2">
                <option value="">All Certificate Types</option>
                <option value="Barangay Clearance">Barangay Clearance</option>
                <option value="Certificate of Indigency">Certificate of Indigency</option>
              </select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={requests}
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
                icon: <FaCheck className="text-green-600" />,
                label: 'Approve',
                onClick: handleApprove,
                show: (row) => row.status === 'Pending',
              },
              {
                icon: <FaTimes className="text-red-600" />,
                label: 'Reject',
                onClick: handleReject,
                show: (row) => row.status === 'Pending',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestManagement;
