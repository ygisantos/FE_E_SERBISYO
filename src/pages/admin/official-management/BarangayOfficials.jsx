import React, { useState, useEffect } from "react";
import DataTable from "../../../components/reusable/DataTable";
import Button from "../../../components/reusable/Button";
import { FaEye, FaEdit, FaArchive } from "react-icons/fa";
import { UserPlus } from 'lucide-react';
import AddOfficialModal from "../../../components/modals/AddOfficialModal";
import EditOfficialModal from "../../../components/modals/EditOfficialModal";
import ViewOfficialModal from "../../../components/modals/ViewOfficialModal";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import {
  createOfficial,
  fetchOfficials,
  updateOfficial,
  updateOfficialStatus,
  getOfficialById,
} from "../../../api/adminApi";
import { showCustomToast } from "../../../components/Toast/CustomToast";
import { Link } from "react-router-dom";

const BarangayOfficials = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    sort_by: "full_name",
    order: "desc",
  });
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOfficials();
  }, [page, sortConfig, search]);

  const loadOfficials = async () => {
    try {
      setLoading(true);
      const response = await fetchOfficials({
        page,
        status: "active", // Always fetch active officials only
        search: search,
        ...sortConfig,
      });
      setData(response.data); // Response data contains paginated results
      setTotal(response.total); // Total from backend pagination
    } catch (error) {
      setError(error.message);
      showCustomToast("Failed to load officials", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOfficial = () => {
    setIsModalOpen(true);
  };

  const handleView = async (official) => {
    try {
      const officialDetails = await getOfficialById(official.id);
      setSelectedOfficial(officialDetails);
      setShowViewModal(true);
    } catch (error) {
      showCustomToast("Failed to fetch official details", "error");
    }
  };

  const handleEdit = async (official) => {
    try {
      const officialDetails = await getOfficialById(official.id);
      if (officialDetails) {
        setSelectedOfficial(officialDetails);
        setShowEditModal(true);
      }
    } catch (error) {
      showCustomToast("Failed to fetch official details", "error");
    }
  };

  const handleArchive = (official) => {
    setSelectedOfficial(official);
    setShowArchiveModal(true);
  };

  const handleSubmitOfficial = async (officialData) => {
    try {
      await createOfficial(officialData);
      await loadOfficials(); // Reload list only after successful creation
      setIsModalOpen(false); // Close modal only on success
    } catch (error) {
      throw error; // Re-throw error to be handled by modal
    }
  };

  const handleUpdateOfficial = async (officialData) => {
    try {
      await updateOfficial(selectedOfficial.id, officialData);
      await loadOfficials();
      setShowEditModal(false);
      showCustomToast("Official updated successfully", "success");
    } catch (error) {
      showCustomToast(error.message || "Failed to update official", "error");
    }
  };

  const confirmArchive = async () => {
    try {
      // Change status to 'inactive' for API
      await updateOfficialStatus(selectedOfficial.id, "inactive");
      await loadOfficials();
      setShowArchiveModal(false);
      setSelectedOfficial(null);
      showCustomToast("Official archived successfully", "success");
    } catch (error) {
      showCustomToast(error.message || "Failed to archive official", "error");
    }
  };

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      sort_by: column,
      order: prev.sort_by === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    // Remove /storage prefix and use storage URL
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^\/storage\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  //Table Columns
  const columns = [
    {
      label: "Profile Picture",
      accessor: "image_path",
      render: (value, row) => {
        const hasProfilePic = !!value;
        const initials = row.account
          ? `${row.account.first_name[0]}${row.account.last_name[0]}`
          : "";
        const imgUrl = getProfilePicUrl(value);

        return (
          <div className="w-10 h-10">
            {hasProfilePic ? (
              <img
                src={imgUrl}
                alt={`${row.account?.first_name}'s profile`}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
                onError={(e) => {
                  e.target.src = "/placeholder-avatar.png";
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-gray-200">
                {initials}
              </div>
            )}
          </div>
        );
      },
    },
    {
      label: "Name",
      accessor: "account",
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-xs text-gray-800">N/A</span>;
        const fullName = `${value.first_name} ${
          value.middle_name ? value.middle_name + " " : ""
        }${value.last_name} ${value.suffix || ""}`.trim();
        return <span className="text-xs text-gray-800">{fullName}</span>;
      },
    },
    {
      label: "Position",
      accessor: "position",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>,
    },
    {
      label: "Term Start",
      accessor: "term_start",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">{formatDate(value)}</span>
      ),
    },
    {
      label: "Term End",
      accessor: "term_end",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">{formatDate(value)}</span>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === "active"
              ? "bg-green-50 text-green-700"
              : "bg-gray-50 text-red-600"
          }`}
        >
          {/* Display 'archived' instead of 'inactive' */}
          {value === "inactive" ? "archived" : value}
        </span>
      ),
    },
  ];

  // Active officials count
  const activeOfficials = data.filter(
    (official) => official.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Active Officials
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage and oversee barangay officials
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4">
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              enableSearch={true}
              enablePagination={true}
              totalItems={total} // Total items from backend
              currentPage={page}
              onPageChange={setPage}
              enableSelection={false}
              striped={false}
              hover={true}
              cellClassName="py-2.5 text-xs"
              headerClassName="text-xs font-medium text-gray-500 bg-gray-50/50"
              tableClassName="border-none"
              searchPlaceholder="Search by name or position..."
              searchValue={search}
              onSearchChange={handleSearch}
              actionButton={{
                label: "Add Official",
                icon: <UserPlus className="w-3.5 h-3.5" />,
                onClick: handleAddOfficial,
                className: "bg-red-900 text-white hover:bg-red-800",
              }}
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: "View",
                  onClick: handleView,
                },
                {
                  icon: <FaEdit className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Edit",
                  onClick: handleEdit,
                },
                {
                  icon: <FaArchive className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Archive",
                  onClick: handleArchive,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <AddOfficialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitOfficial}
      />
      <EditOfficialModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateOfficial}
        official={selectedOfficial}
      />
      {showViewModal && (
        <ViewOfficialModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedOfficial(null);
          }}
          official={selectedOfficial}
        />
      )}
      <ConfirmationModal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setSelectedOfficial(null);
        }}
        onConfirm={confirmArchive}
        title="Archive Official"
        message={`Are you sure you want to archive ${selectedOfficial?.full_name}? This action cannot be undone.`}
        confirmText="Archive"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default BarangayOfficials;
