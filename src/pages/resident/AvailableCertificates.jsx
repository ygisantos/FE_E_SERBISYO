import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import DataTable from "../../components/reusable/DataTable";
import { FaPlus } from "react-icons/fa";
import { getAllDocuments, createDocumentRequest } from "../../api/documentApi"; // Changed import
import RequestDocumentModal from "../../components/modals/RequestDocumentModal";
import { showCustomToast } from "../../components/Toast/CustomToast";

const AvailableCertificates = () => {
  const { currentUser } = useUser();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    per_page: 10,
  });
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    sort_by: "created_at",
    order: "desc",
  });

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction,
    });
  };

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await getAllDocuments({
        page: currentPage,
        per_page: filters.per_page,
        status: "active",
        sort_by: sortConfig.sort_by,
        order: sortConfig.order,
        search,
      });

      setCertificates(response.data);
      setTotalItems(response.total || response.data.length);
    } catch (error) {
      console.error("Error:", error);
      showCustomToast("Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [currentPage, search, sortConfig.sort_by, sortConfig.order]);

  const handleSubmitRequest = async (formData) => {
    try {
      setIsLoading(true);
      await createDocumentRequest(formData);
      showCustomToast("Document request submitted successfully", "success");
      setShowRequestModal(false);
      await loadCertificates(); // Now this will work
    } catch (error) {
      showCustomToast(error.message || "Failed to submit request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDocument = (document) => {
    setSelectedDocument(document);
    setShowRequestModal(true);
  };

  const certificateColumns = [
    {
      label: "Document Name",
      accessor: "document_name",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-800">{value}</span>
      ),
    },
    {
      label: "Description",
      accessor: "description",
      sortable: true,
      render: (value) => (
        <p className="text-xs text-gray-600 max-w-md line-clamp-2">{value}</p>
      ),
    },
    {
      label: "Requirements",
      accessor: "requirements",
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
            <span className="text-xs text-gray-400 pl-3">
              +{requirements.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Created At",
      accessor: "created_at",
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      label: "Updated At",
      accessor: "updated_at",
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Available Certificates
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View and request barangay certificates
            </p>
          </div>

          <DataTable
            columns={certificateColumns}
            data={certificates}
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
            onSort={handleSort}
            sortConfig={sortConfig}
            actions={[
              {
                icon: <FaPlus className="h-3.5 w-3.5 text-gray-400" />,
                label: "Request Document",
                onClick: handleRequestDocument,
              },
            ]}
          />
        </div>
      </div>

      <RequestDocumentModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        document={selectedDocument}
        onSubmit={handleSubmitRequest}
        isLoading={loading}
      />
    </div>
  );
};

export default AvailableCertificates;
