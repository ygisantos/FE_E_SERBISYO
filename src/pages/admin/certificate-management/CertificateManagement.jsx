import React, { useState } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import StatCard from '../../../components/reusable/StatCard';
import Modal from '../../../components/Modal/Modal';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import CertificateTemplate from '../../../components/certificates/CertificateTemplate';

 const initialFormState = {
  name: '',
  requirements: '',
  price: '',
  processing_time: '',
  status: 'Active'
};

const CertificateManagement = () => {
  const [showNewCertModal, setShowNewCertModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'Barangay Clearance',
      requirements: ['Valid ID', 'Proof of Residence'],
      price: 100,
      processing_time: '1-2 days',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Certificate of Indigency',
      requirements: ['Valid ID'],
      price: 50,
      processing_time: '1 day',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Business Permit',
      requirements: ['Valid ID', 'DTI Registration', 'Business Location Photo'],
      price: 200,
      processing_time: '3-5 days',
      status: 'Active',
    },
  ]);

  const columns = [
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
      accessor: 'processing_time',
      sortable: true,
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Active'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the requirements string into an array
    const newCertificate = {
      ...formData,
      id: certificates.length + 1,
      requirements: formData.requirements.split(',').map(req => req.trim()),
      price: parseFloat(formData.price)
    };
    setCertificates([...certificates, newCertificate]);
    setShowNewCertModal(false);
    setFormData(initialFormState);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Certificate Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNewCertModal(true)}
              className="inline-flex items-center px-5 py-2.5 bg-red-900 text-white rounded-lg text-sm font-medium hover:bg-red-800 cursor-pointer transition-all shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Certificate
            </button>
            <button className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Export List
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FileText className="text-blue-600" />}
          label="Total Certificates"
          value={certificates.length}
          color="bg-white border-gray-200"
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          label="Active Certificates"
          value={certificates.filter(cert => cert.status === 'Active').length}
          color="bg-white border-gray-200"
        />
        <StatCard
          icon={<Clock className="text-yellow-600" />}
          label="Standard Processing"
          value="1-3 Days"
          color="bg-white border-gray-200"
        />
        <StatCard
          icon={<AlertTriangle className="text-red-600" />}
          label="Inactive Certificates"
          value={certificates.filter(cert => cert.status !== 'Active').length}
          color="bg-white border-gray-200"
        />
      </div>

          {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-medium text-gray-800">Certificate List</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage all available certificates and their requirements
          </p>
        </div>
        <div className="p-6">
          <DataTable
            columns={columns}
            data={certificates}
            enableSearch={true}
            enableSelection={false}
            enablePagination={true}
            itemsPerPage={5}
            striped={true}
            hover={true}
            cellClassName="py-3"
            actions={[
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ),
                label: "View Template",
                onClick: (row) => {
                  setSelectedCertificate(row);
                  setShowPreviewModal(true);
                },
              },
              {
                icon: (
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                ),
                label: "Edit",
                onClick: (row) => console.log('Edit:', row),
              },
            ]}
          />
        </div>
      </div>

      {/* New Certificate Modal */}
      <Modal
        isOpen={showNewCertModal}
        onClose={() => {
          setShowNewCertModal(false);
          setFormData(initialFormState);
        }}
        title="Add New Certificate"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowNewCertModal(false);
                setFormData(initialFormState);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-red-900 border border-transparent rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Certificate
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Certificate Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Barangay Clearance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Requirements (comma-separated)
            </label>
            <input
              type="text"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Valid ID, Proof of Residence"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (₱)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Processing Time
            </label>
            <input
              type="text"
              value={formData.processing_time}
              onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., 1-2 days"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Certificate Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedCertificate(null);
        }}
        title={`${selectedCertificate?.name || ''} Template Preview`}
        size="lg"
      >
        <div className="w-full h-[800px]">
          <PDFViewer width="100%" height="100%" className="rounded">
            <CertificateTemplate 
              type={selectedCertificate?.name?.toLowerCase().includes('clearance') ? 'clearance' : 
                    selectedCertificate?.name?.toLowerCase().includes('indigency') ? 'indigency' : 
                    selectedCertificate?.name?.toLowerCase().includes('business') ? 'business' : 'clearance'}
              data={{
                first_name: "Juan",
                last_name: "Dela Cruz",
                age: "30",
                civil_status: "Single",
                nationality: "Filipino",
                house_no: "123",
                street: "Sample Street",
                barangay: "Sample Barangay",
                purpose: "Sample Purpose",
                barangay_captain: "Pedro Santos"
              }}
            />
          </PDFViewer>
        </div>
      </Modal>
    </div>
  );
};

export default CertificateManagement;
