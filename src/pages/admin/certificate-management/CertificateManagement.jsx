import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { FileText, Clock } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import CertificateTemplate from '../../../components/certificates/CertificateTemplate';
import CreateCertificateModal from '../../../components/modals/CreateCertificateModal';
import EditDocumentModal from '../../../components/modals/EditDocumentModal';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import { getAllDocuments } from '../../../api/documentApi';

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
  const [selectedDocument, setSelectedDocument] = useState(null);

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
    }
  ];

  // Data fetching
  useEffect(() => {
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

    const debounceTimer = setTimeout(fetchDocuments, 500);
    return () => clearTimeout(debounceTimer);
  }, [currentPage, filters.status, search, sortConfig]);

  // Event handlers
  const handleSort = ({ column, direction }) => {
    setSortConfig({ sort_by: column, order: direction });
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setShowEditModal(true);
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  return (
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
            actions={[
              {
                icon: <FileText className="h-3.5 w-3.5 text-gray-400" />,
                label: "View Template",
                onClick: handlePreview,
              },
              {
                icon: <Clock className="h-3.5 w-3.5 text-gray-400" />,
                label: "Edit",
                onClick: handleEdit,
              },
            ]}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateCertificateModal
        isOpen={showNewCertModal}
        onClose={() => setShowNewCertModal(false)}
        onSuccess={() => {
          setShowNewCertModal(false);
          // Refresh data
        }}
      />

      <EditDocumentModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedDocument(null);
          // Refresh data
        }}
      />
    </div>
  );
};

export default CertificateManagement;
         