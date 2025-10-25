import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { FileText, Clock } from 'lucide-react';
import CreateCertificateModal from '../../../components/modals/CreateCertificateModal';
import EditDocumentModal from '../../../components/modals/EditDocumentModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import ViewDocumentModal from '../../../components/modals/ViewDocumentModal';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import { getAllDocuments, deleteDocument, getDocumentById, uploadDocumentTemplate, getDocumentTemplate } from '../../../api/documentApi';
import { FaTrash, FaFileWord, FaUpload, FaDownload } from 'react-icons/fa';
import Modal from '../../../components/Modal/Modal'; 


const CertificateManagement = () => {
  // Base states
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Search and sort states 
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'document_name',
    order: 'desc'
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: 'active',
    per_page: 10
  });

  // Modal states
  const [showNewCertModal, setShowNewCertModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [templateUrl, setTemplateUrl] = useState(null);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);

  // Table columns configuration
  const columns = [
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
        <p className="text-xs text-gray-600 max-w-md line-clamp-2">{value}</p>
      )
    },
    {
      label: 'Requirements',
      accessor: 'requirements',
      sortable: false,
      render: (requirements) => (
        <div className="space-y-1">
          {requirements?.slice(0, 2).map((req) => (
            <div key={req.id} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-red-600"></div>
              <span className="text-xs text-gray-600">{req.name}</span>
            </div>
          ))}
          {requirements?.length > 2 && (
            <span className="text-xs text-gray-400 pl-3">+{requirements.length - 2} more</span>
          )}
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
    },
    {
      label: 'Created At',
      accessor: 'created_at',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )
    },
    {
      label: 'Updated At',
      accessor: 'updated_at',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )
    }
  ];

  // Extract fetchDocuments as a named function
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getAllDocuments({
        page: currentPage,
        per_page: filters.per_page,
        ...filters,
        ...sortConfig,
        search
      });

      if (response.success) {
        setDocuments(response.data);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showCustomToast('Failed to fetch documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to wait for filters and search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDocuments();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, filters.status, search, sortConfig]);

  // Event handlers
  const handleSort = ({ column, direction }) => {
    setSortConfig({ sort_by: column, order: direction });
  };

  const handleEdit = async (document) => {
    try {
      setSelectedDocument(document);
      setShowEditModal(true);
    } catch (error) {
      showCustomToast('Failed to load document details', 'error');
    }
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  const handleCreateSuccess = (newDocument) => {
    // Refresh documents list
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await getAllDocuments({
          page: currentPage,
          ...filters,
          ...sortConfig,
          search
        });

        if (response.success) {
          setDocuments(response.data);
          setTotalItems(response.pagination.totalItems);
        }
      } catch (error) {
        showCustomToast('Failed to fetch documents', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
    setShowNewCertModal(false);
  };

  const handleDelete = (document) => {
    // Check if document has active requests
    if (document.hasActiveRequests) {
      showCustomToast(
        'Cannot delete document with active requests. Please process all pending requests first.',
        'error'
      );
      return;
    }
    setSelectedDocument(document);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteDocument(selectedDocument.id);
      showCustomToast('Document deleted successfully', 'success');
      const newResponse = await getAllDocuments({
        page: currentPage,
        ...filters,
        ...sortConfig,
        search
      });
      if (newResponse.success) {
        setDocuments(newResponse.data);
        setTotalItems(newResponse.pagination.totalItems);
      }
    } catch (error) {
      showCustomToast(error || 'Failed to delete document', 'error');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedDocument(null);
    }
  };

  const handleView = async (document) => {
    try {
      const documentDetails = await getDocumentById(document.id);
      setSelectedDocument(documentDetails);
      setShowViewModal(true);
    } catch (error) {
      showCustomToast('Failed to fetch document details', 'error');
    }
  };

  const handleViewTemplate = async (document) => {
    if (document.template_path) {
      try {
        const { blob, filename } = await getDocumentTemplate(document.id);
        // Create download link with original filename
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // Use original filename
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        showCustomToast('Downloading template...', 'info');
      } catch (error) {
        console.error('Template download error:', error);
        showCustomToast('Failed to download template', 'error');
      }
    } else {
      handleUploadTemplate(document);
    }
  };

  const handleUploadTemplate = async (doc) => {
    if (doc.template_path) {
      setSelectedUpload(doc);
      setShowUploadConfirm(true);
      return;
    }

    // If no template exists, proceed with upload
    openFileUpload(doc);
  };

  const openFileUpload = (doc) => {
    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.doc';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('template', file);
          formData.append('document_id', doc.id);
          
          await uploadDocumentTemplate(doc.id, file);
          showCustomToast(
            doc.template_path ? 'Template updated successfully' : 'Template uploaded successfully', 
            'success'
          );
          fetchDocuments();
        } catch (error) {
          console.error('Upload error:', error);
          showCustomToast(error.response?.data?.message || 'Failed to upload template', 'error');
        }
      }
    };
    input.click();
  };

  const actions = [
    {
      icon: <FileText className="h-3.5 w-3.5 text-gray-500" />,
      label: "View Details",
      onClick: handleView,
    },
    {
      icon: <Clock className="h-3.5 w-3.5 text-gray-500" />,
      label: "Edit",
      onClick: handleEdit,
    },
    {
      icon: <FaUpload className="h-3.5 w-3.5 text-gray-500" />,
      label: "Upload/Update", // Simplified label
      onClick: handleUploadTemplate,
    }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">Document List</h3>
            <p className="text-xs text-gray-500 mt-1">Manage available documents and their requirements</p>
          </div>

          <div className="p-6">
            <DataTable
              columns={columns}
              data={documents}
              loading={loading}
              enableSearch={true}
              searchValue={search}
              onSearchChange={setSearch}
              enablePagination={true}
              enableSelection={false}
              itemsPerPage={filters.per_page}
              totalItems={totalItems}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              searchPlaceholder="Search documents..."
              comboBoxFilter={{
                label: "Status",
                options: [
                  { label: 'All', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' }
                ],
                value: filters.status || '',
                onChange: (value) => setFilters(prev => ({ ...prev, status: value }))
              }}
              onSort={handleSort}
              actionButton={{
                label: "New Document",
                icon: <FileText className="w-3.5 h-3.5" />,
                onClick: () => setShowNewCertModal(true),
                className: "bg-red-900 text-white hover:bg-red-800"
              }}
              actions={actions}
            />
          </div>
        </div>

        {/* Modals */}
        <CreateCertificateModal
          isOpen={showNewCertModal}
          onClose={() => setShowNewCertModal(false)}
          onSuccess={handleCreateSuccess} // Changed from onSubmit to onSuccess
        />

        <EditDocumentModal 
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDocument(null);
          }}
          documentId={selectedDocument?.id}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedDocument(null);
            fetchDocuments(); // Now fetchDocuments is defined
          }}
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Document"
          message={`Are you sure you want to delete ${selectedDocument?.document_name}? This action cannot be undone.`}
          confirmText="Delete"
          type="danger"
        />

        <ViewDocumentModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
        />

        {/* Template Preview Modal */}
        <Modal
          isOpen={showTemplateModal}
          onClose={() => {
            setShowTemplateModal(false);
            if (templateUrl) {
              URL.revokeObjectURL(templateUrl);
              setTemplateUrl(null);
            }
          }}
          title="Document Template Preview"
          modalClass="max-w-4xl"
        >
          <div className="h-[70vh] w-full">
            {templateUrl ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(templateUrl)}&embedded=true`}
                className="w-full h-full border-0"
                title="Document Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-600">Loading template...</p>
              </div>
            )}
          </div>
        </Modal>

        <ConfirmationModal
          isOpen={showUploadConfirm}
          onClose={() => {
            setShowUploadConfirm(false);
            setSelectedUpload(null);
          }}
          onConfirm={() => {
            openFileUpload(selectedUpload);
            setShowUploadConfirm(false);
            setSelectedUpload(null);
          }}
          title="Update Template"
          message="This document already has a template. Do you want to update it?"
          confirmText="Update"
          cancelText="Cancel"
          type="warning"
        />
      </div>
    </>
  );
};

export default CertificateManagement;
