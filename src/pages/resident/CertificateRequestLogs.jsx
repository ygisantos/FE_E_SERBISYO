import React from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CertificateRequestLogs = () => {
  const navigate = useNavigate();

  // This will be replaced with API data
  const requestLogs = [
    {
      id: 1,
      referenceNo: 'BC-2024-001',
      certificateType: 'Barangay Clearance',
      requestDate: '2024-01-15',
      processedDate: '2024-01-16',
      status: 'Completed',
      purpose: 'Employment',
      paymentStatus: 'Paid',
      amount: 100,
    },
    // Add more sample data
  ];

  const columns = [
    {
      label: 'Reference No.',
      accessor: 'referenceNo',
      sortable: true,
    },
    {
      label: 'Certificate',
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
      label: 'Processed Date',
      accessor: 'processedDate',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
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
              : value === 'Processing'
              ? 'bg-blue-50 text-blue-700'
              : value === 'Completed'
              ? 'bg-green-50 text-green-700'
              : value === 'Rejected'
              ? 'bg-red-50 text-red-700'
              : 'bg-gray-50 text-gray-700'
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
    {
      label: 'Payment',
      accessor: 'paymentStatus',
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className={`text-sm ${value === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
            {value}
          </span>
          <span className="text-xs text-gray-500">₱{row.amount}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Certificate Request History</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track and manage all your certificate requests
            </p>
          </div>

          <DataTable
            columns={columns}
            data={requestLogs}
            enableSearch={true}
            searchPlaceholder="Search by reference number, type..."
            enablePagination={true}
            itemsPerPage={10}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: 'View Details',
                onClick: (row) => navigate(`/resident/certificates/view/${row.id}`),
              },
              {
                icon: <FaDownload className="text-green-600" />,
                label: 'Download',
                onClick: (row) => console.log('Download', row),
                show: (row) => row.status === 'Completed',
              },
            ]}
          />

          {/* Status Legend */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status Legend:</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-sm text-gray-600">Pending - Request is being reviewed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-600">Processing - Document is being prepared</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600">Completed - Ready for pickup/download</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-600">Rejected - Request was denied</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateRequestLogs;
