import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import DataTable from '../../components/reusable/DataTable';
import { FaPlus } from 'react-icons/fa';
import { getAllDocuments, createDocumentRequest } from '../../api/documentApi';
import RequestDocumentModal from '../../components/modals/RequestDocumentModal';
import { showCustomToast } from '../../components/Toast/CustomToast';

const AvailableCertificates = () => {
  const { currentUser } = useUser();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const certificateColumns = [
    {
      label: 'Document Name',
      accessor: 'document_name',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-800">{value}</span>
      )
    },
    {
      label: 'Description',
      accessor: 'description',
      sortable: true,
      render: (value) => (
        <p className="text-xs text-gray-600 max-w-md">{value}</p>
      )
    },
    {
      label: 'Requirements',
      accessor: 'requirements',
      sortable: false,
      render: (requirements) => (
        <div className="space-y-1">
          {requirements?.map((req, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-600"></div>
              <span className="text-xs text-gray-600">{req.name}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      type: 'badge',
      badgeColors: {
        active: 'green',
        inactive: 'gray'
      }
    }
  ];

  const handleRequestDocument = (document) => {
    setSelectedDocument({
      id: document.id,
      document_name: document.document_name,
      description: document.description,
      requirements: document.requirements
    });
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (formData) => {
    try {
      setIsLoading(true);
      await createDocumentRequest(formData);
      showCustomToast('Request submitted successfully', 'success');
      setShowRequestModal(false);
    } catch (error) {
      showCustomToast(error.message || 'Failed to submit request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        const response = await getAllDocuments();
        setCertificates(response.data || []);
      } catch (error) {
        showCustomToast(error.message || 'Failed to load certificates', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
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
            loading={loading}
            enableSearch={true}
            searchPlaceholder="Search documents..."
            enablePagination={true}
            itemsPerPage={10}
            actions={[
              {
                icon: <FaPlus className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Request Document',
                onClick: handleRequestDocument,
              }
            ]}
          />
        </div>
      </div>

      <RequestDocumentModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        document={selectedDocument}
        onSubmit={handleSubmitRequest}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AvailableCertificates;
