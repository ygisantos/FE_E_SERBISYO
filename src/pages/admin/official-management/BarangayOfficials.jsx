import React, { useState, useEffect } from "react";
import DataTable from "../../../components/reusable/DataTable";
import Button from "../../../components/reusable/Button";
import { FaEye, FaEdit, FaToggleOn } from "react-icons/fa";
import AddOfficialModal from "../../../components/modals/AddOfficialModal";
import EditOfficialModal from "../../../components/modals/EditOfficialModal";
import { createOfficial, fetchOfficials, updateOfficial, updateOfficialStatus } from "../../../api/adminApi";
import { showCustomToast } from "../../../components/Toast/CustomToast";

const BarangayOfficials = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    sort_by: "full_name",
    order: "desc",
  });
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadOfficials();
  }, [page, sortConfig, statusFilter, search]);

  const loadOfficials = async () => {
    try {
      setLoading(true);
      const response = await fetchOfficials({
        page,
        status: statusFilter,
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

  const handleView = (official) => {
    console.log("View", official);
    // Add your view logic here
  };

  const handleEdit = (official) => {
    console.log("Edit", official);
    setSelectedOfficial(official);
    setShowEditModal(true);
  };

  const handleSubmitOfficial = async (officialData) => {
    try {
      const response = await createOfficial(officialData);
      await loadOfficials(); // Reload the list after adding
      setIsModalOpen(false);
      showCustomToast("Official added successfully", "success");
    } catch (error) {
      showCustomToast(error.message || "Failed to add official", "error");
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

  const handleUpdateStatus = async (official) => {
    try {
      const newStatus = official.status === 'active' ? 'inactive' : 'active';
      await updateOfficialStatus(official.id, newStatus);
      await loadOfficials();
      showCustomToast(`Official status updated to ${newStatus}`, 'success');
    } catch (error) {
      showCustomToast(error.message || 'Failed to update status', 'error');
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
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_BASE_URL;
    return `${base}${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };

  // Table columns configuration
  const columns = [
    {
      label: "Profile Picture",
      accessor: "image_path",
      render: (value, row) => {
        const hasProfilePic = !!value;
        const initials = row.full_name
          ? row.full_name.charAt(0)
          : '';
        const imgUrl = getProfilePicUrl(value);
        
        return (
          <div className="w-10 h-10">
            {hasProfilePic ? (
              <img
                src={imgUrl}
                alt={`${row.full_name}'s profile`}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
                onError={e => { e.target.src = '/placeholder-avatar.png'; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-gray-200">
                {initials}
              </div>
            )}
          </div>
        );
      }
    },
    {
      label: "Name",
      accessor: "full_name",
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-800">{value}</span>
      )
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
        <span className="text-sm text-gray-700">
          {formatDate(value)}
        </span>
      ),
    },
    {
      label: "Term End",
      accessor: "term_end",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">
          {formatDate(value)}
        </span>
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
          {value}
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
        {/* Header Section - Without Add Button */}
        <div className="mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Barangay Officials
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
              comboBoxFilter={{
                label: "Status",
                value: statusFilter,
                onChange: (value) => setStatusFilter(value),
                options: [
                  { value: "active", label: "Active Officials" },
                  { value: "inactive", label: "Inactive Officials" },
                ]
              }}
              searchValue={search}
              onSearchChange={handleSearch}
              actionButton={{
                label: "Add Official",
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
                  icon: <FaToggleOn className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Toggle Status",
                  onClick: handleUpdateStatus,
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
    </div>
  );
};

export default BarangayOfficials;


