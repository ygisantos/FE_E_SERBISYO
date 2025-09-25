import React, { useState } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaDownload, FaPlus } from 'react-icons/fa';
import Modal from '../../components/Modal/Modal';

const ResidentCertificates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');

  const purposeCategories = [
    { value: 'employment', label: 'Employment Requirement' },
    { value: 'business', label: 'Business Permit Application' },
    { value: 'scholarship', label: 'Scholarship Application' },
    { value: 'loan', label: 'Bank/Loan Requirement' },
    { value: 'school', label: 'School Requirement' },
    { value: 'police', label: 'Police Clearance Requirement' },
    { value: 'travel', label: 'Travel Requirement' },
    { value: 'other', label: 'Other Purpose' },
  ];

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'Barangay Clearance',
      requirements: ['Valid ID', 'Proof of Residence'],
      price: 100,
      processingTime: '1-2 days',
      description: 'General clearance for employment, loans, etc.',
    },

  ]);

  const [requests, setRequests] = useState([
    {
      id: 1,
      certificateType: 'Barangay Clearance',
      requestDate: '2024-07-25',
      status: 'Pending',
      purpose: 'Employment',
    },

   ]);

  const certificateColumns = [
    {
      label: 'Certificate Name',
      accessor: 'name',
      sortable: true,
    },
    {
      label: 'Requirements',
      accessor: 'requirements',
      sortable: false,
      render: (value) => (
        <ul className="list-disc list-inside">
          {value.map((req, index) => (
            <li key={index} className="text-sm">{req}</li>
          ))}
        </ul>
      ),
    },
    {
      label: 'Price',
      accessor: 'price',
      sortable: true,
      render: (value) => `₱${value.toFixed(2)}`,
    },
    {
      label: 'Processing Time',
      accessor: 'processingTime',
      sortable: true,
    },
  ];

  const requestColumns = [
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Available Certificates Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Available Certificates</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and request barangay certificates
            </p>
          </div>

          <DataTable
            columns={certificateColumns}
            data={certificates}
            enableSearch={true}
            enablePagination={true}
            itemsPerPage={5}
            enableSelection={false}
            actionButton={{
              label: "Request Certificate",
              icon: <FaPlus />,
              onClick: () => setIsModalOpen(true),
              className: "bg-red-900 text-white hover:bg-red-800"
            }}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: 'View Details',
                onClick: (row) => console.log('View', row),
              },
            ]}
          />
        </div>

        {/* My Requests Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Requests</h2>
            <p className="mt-2 text-sm text-gray-600">
              Track your certificate requests
            </p>
          </div>

          <DataTable
            columns={requestColumns}
            data={requests}
            enableSearch={true}
            enablePagination={true}
            itemsPerPage={5}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: 'View Details',
                onClick: (row) => console.log('View', row),
              },
              {
                icon: <FaDownload className="text-green-600" />,
                label: 'Download',
                onClick: (row) => console.log('Download', row),
                show: (row) => row.status === 'Approved',
              },
            ]}
          />
        </div>
      </div>

      {/* Request Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCertificate(null);
          setPurpose('');
        }}
        title="Request Certificate"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedCertificate(null);
                setSelectedPurpose('');
                setOtherPurpose('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Here will make an API call to submit the request
                const finalPurpose = selectedPurpose === 'other' 
                  ? otherPurpose 
                  : purposeCategories.find(cat => cat.value === selectedPurpose)?.label;

                const newRequest = {
                  id: requests.length + 1,
                  certificateType: selectedCertificate.name,
                  requestDate: new Date().toISOString(),
                  status: 'Pending',
                  purpose: finalPurpose,
                };
                setRequests([...requests, newRequest]);
                setIsModalOpen(false);
                setSelectedCertificate(null);
                setSelectedPurpose('');
                setOtherPurpose('');
              }}
              disabled={!selectedCertificate || !selectedPurpose || (selectedPurpose === 'other' && !otherPurpose.trim())}
              className="px-4 py-2 bg-red-900 text-white rounded-md text-sm font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Certificate
            </label>
            <select
              value={selectedCertificate?.id || ''}
              onChange={(e) => {
                const cert = certificates.find(c => c.id === Number(e.target.value));
                setSelectedCertificate(cert);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a certificate...</option>
              {certificates.map((cert) => (
                <option key={cert.id} value={cert.id}>
                  {cert.name} - ₱{cert.price}
                </option>
              ))}
            </select>
          </div>

          {selectedCertificate && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Requirements:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                {selectedCertificate.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-600">
                <p>Processing Time: {selectedCertificate.processingTime}</p>
                <p>Price: ₱{selectedCertificate.price}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose Category
              </label>
              <select
                value={selectedPurpose}
                onChange={(e) => {
                  setSelectedPurpose(e.target.value);
                  if (e.target.value !== 'other') {
                    setOtherPurpose('');
                  }
                }}
                className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select purpose category...</option>
                {purposeCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedPurpose === 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specify Other Purpose
                </label>
                <textarea
                  value={otherPurpose}
                  onChange={(e) => setOtherPurpose(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please specify your purpose..."
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResidentCertificates;
