import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAllDocuments, createDocumentRequest, getAllRequests } from '../../api/documentApi';
import RequestDocumentModal from '../../components/modals/RequestDocumentModal';
import { showCustomToast } from '../../components/Toast/CustomToast';

const ResidentCertificates = () => {
  const { currentUser, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  // Define columns for certificates table
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

  // Define columns for requests table
  const requestColumns = [
    {
      label: 'Transaction ID',
      accessor: 'transaction_id',
      sortable: true,
    },
    {
      label: 'Document Name',
      accessor: 'document_details',
      sortable: true,
      render: (docDetails) => (
        <span className="text-sm font-medium text-gray-800">
          {docDetails?.document_name || 'N/A'}
        </span>
      ),
    },
    {
      label: 'Request Date',
      accessor: 'created_at',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          value === 'pending' ? 'bg-yellow-50 text-yellow-700' :
          value === 'approved' ? 'bg-green-50 text-green-700' :
          'bg-red-50 text-red-700'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    }
  ];

  const handleRequestDocument = (document) => {
    console.log('Selected document:', document); // Add this for debugging
    setSelectedDocument({
      id: document.id,
      document_name: document.document_name,
      description: document.description,
      requirements: document.requirements,
      contact_no: document.contact_no
    });
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (formData) => {
    try {
      setIsLoading(true);
      await createDocumentRequest(formData);
      showCustomToast('Request submitted successfully', 'success');
      setShowRequestModal(false);
      loadRequests(); // Reload requests after successful submission
    } catch (error) {
      showCustomToast(error.message || 'Failed to submit request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch certificates
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

  // Load requests
  const loadRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await getAllRequests({
        per_page: 10,
        page
      });
      
      // Filter requests for current user
      const userRequests = response.data.filter(
        request => request.requestor === currentUser?.id
      );
      
      setRequests(userRequests);
      setTotal(userRequests.length);
    } catch (error) {
      showCustomToast(error.message || 'Failed to load requests', 'error');
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch both certificates and requests on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCertificates(),
        loadRequests()
      ]);
    };

    if (currentUser) {
      loadData();
    }
  }, [currentUser, page]);

  return (
    <>
      {userLoading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user information...</p>
          </div>
        </div>
      ) : (
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
                loading={loading}
                enableSearch={true}
                searchPlaceholder="Search documents..."
                enablePagination={true}
                itemsPerPage={5}
                actions={[
                  {
                    icon: <FaPlus className="h-3.5 w-3.5 text-gray-400" />,
                    label: 'Request Document',
                    onClick: handleRequestDocument,
                  }
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
                loading={requestsLoading}
                enableSearch={true}
                enablePagination={true}
                totalItems={total}
                currentPage={page}
                onPageChange={setPage}
                itemsPerPage={10}
                actions={[
                  {
                    icon: <FaEye className="text-blue-600" />,
                    label: 'View Details',
                    onClick: (row) => navigate(`/resident/certificates/view/${row.id}`),
                  }
                ]}
              />
            </div>
          </div>

          {/* Request Document Modal */}
          <RequestDocumentModal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            document={selectedDocument}
            onSubmit={handleSubmitRequest}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
};

export default ResidentCertificates;
