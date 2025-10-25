import React, { useState, useEffect } from "react";
import DataTable from "../../../components/reusable/DataTable";
import InputField from "../../../components/reusable/InputField";
import Select from "../../../components/reusable/Select";
import { fetchAllResidents } from "../../../api/adminApi";
import { getUserById } from "../../../api/userApi";
import { FaEye, FaEdit, FaArchive } from "react-icons/fa";
import { showCustomToast } from "../../../components/Toast/CustomToast";
import ViewResidentModal from "../../../components/modals/ViewResidentModal";
import EditResidentModal from "../../../components/modals/EditResidentModal";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

const AllResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const [selectedResident, setSelectedResident] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [residentToArchive, setResidentToArchive] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({
    sort_by: "created_at",
    order: "desc",
  });

  const [filters, setFilters] = useState({
    min_age: "",
    max_age: "",
    pwd: "", // '', '1' => has PWD, '0' => no PWD
    single_parent: "", // '', '1' => has single parent, '0' => no
  });

  const ageRangeOptions = [
    { value: "", label: "All Ages" },
    { value: "13-17", label: "13-17 years" },
    { value: "18-25", label: "18-25 years" },
    { value: "26-35", label: "26-35 years" },
    { value: "36-45", label: "36-45 years" },
    { value: "46-59", label: "46-59 years" },
    { value: "60-up", label: "60+ years" },
  ];

  const pwdOptions = [
    { value: "", label: "All" },
    { value: "1", label: "With PWD" },
    { value: "0", label: "Without PWD" },
  ];

  const singleParentOptions = [
    { value: "", label: "All" },
    { value: "1", label: "With Single Parent" },
    { value: "0", label: "Without Single Parent" },
  ];

  const getProfilePicUrl = (path) => {
    if (!path) return "/placeholder-avatar.png";
    if (path.startsWith("http")) return path;

    // Remove /storage prefix and use storage URL
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^\/storage\//, "");
    return `${storageUrl}/${cleanPath}`;
  };

  const confirmArchive = async () => {
    try {
      showCustomToast("Resident archived successfully", "success");
      fetchAllResidents(page, itemsPerPage);
    } catch (error) {
      showCustomToast("Failed to archive resident", "error");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAllResidents({
      page,
      per_page: itemsPerPage,
      search,
      sort_by: sortConfig.sort_by,
      order: sortConfig.order,
      min_age: filters.min_age || undefined,
      max_age: filters.max_age || undefined,
      pwd: filters.pwd !== "" ? filters.pwd : undefined,
      single_parent: filters.single_parent !== "" ? filters.single_parent : undefined,
    })
      .then((response) => {
        const residentsWithName = response.data.map((r) => ({
          ...r,
          name: `${r.first_name} ${r.last_name}`,
        }));
        setResidents(residentsWithName);
        setTotal(response.total || 0);
      })
      .catch((error) => {
        console.error("Error fetching residents:", error);
        showCustomToast("Failed to fetch residents", "error");
        setResidents([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, search, sortConfig, filters.min_age, filters.max_age, filters.pwd, filters.single_parent]);

  // Debounce search input to avoid too many requests while typing
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction.toLowerCase(),
    });
    setPage(1);
  };

  const handleView = async (resident) => {
    try {
      const userDetails = await getUserById(resident.id);
      setSelectedResident(userDetails);
      setShowViewModal(true);
    } catch (error) {
      showCustomToast("Failed to fetch resident details", "error");
    }
  };

  const handleEdit = (resident) => {
    setSelectedResident(resident);
    setShowEditModal(true);
  };

  const handleArchive = (resident) => {
    setResidentToArchive(resident);
    setShowConfirmModal(true);
  };

  const handleAgeRangeChange = (selectedRange) => {
    if (!selectedRange) {
      setFilters({ min_age: "", max_age: "" });
    } else {
      const [min, max] = selectedRange.split("-");
      setFilters({
        min_age: min,
        max_age: max === "up" ? "150" : max, // Use 150 as max age when "60+" is selected
      });
    }
    setPage(1);
  };

  const handlePwdChange = (val) => {
    setFilters((prev) => ({ ...prev, pwd: val }));
    setPage(1);
  };

  const handleSingleParentChange = (val) => {
    setFilters((prev) => ({ ...prev, single_parent: val }));
    setPage(1);
  };

  const columns = [
    {
      label: "Profile Picture",
      accessor: "profile_picture_path",
      render: (value, row) => {
        const hasProfilePic = !!value;
        const initials =
          row.first_name && row.last_name
            ? `${row.first_name[0]}${row.last_name[0]}`.toUpperCase()
            : "";
        const imgUrl = getProfilePicUrl(value);

        return (
          <div className="w-10 h-10">
            {hasProfilePic ? (
              <img
                src={imgUrl}
                alt={`${row.first_name}'s profile`}
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
      accessor: "name",
      render: (value) => <span className="text-xs text-gray-800">{value}</span>,
    },
    { label: "Email", accessor: "email" },
    { label: "Contact No.", accessor: "contact_no" },
    { label: "House No.", accessor: "house_no" },
    { label: "Street", accessor: "street" },
    { label: "Municipality", accessor: "municipality" },
    { label: "Barangay", accessor: "barangay" },
    {
      label: "Status",
      accessor: "status",
      type: "badge",
      badgeColors: {
        active: "green",
        inactive: "gray",
        pending: "yellow",
        rejected: "red",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Simplified */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                Residence List
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage and monitor registered residents
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 space-y-4">
            {/* Filters toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
                <div className="w-full sm:w-80">
                  <InputField
                    label={null}
                    placeholder="Search by name, email, or contact number..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    icon={null}
                    className=""
                  />
                </div>

                <div className="w-44">
                  <Select
                    label={null}
                    options={ageRangeOptions}
                    value={
                      (() => {
                        const combined = filters.min_age
                          ? `${filters.min_age}-${
                              filters.max_age === "150" ? "up" : filters.max_age
                            }`
                          : "";
                        return ageRangeOptions.find((o) => o.value === combined) || null;
                      })()
                    }
                    onChange={(opt) => handleAgeRangeChange(opt ? opt.value : "")}
                    placeholder="Age Range"
                  />
                </div>

                <div className="w-44">
                  <Select
                    label={null}
                    options={pwdOptions}
                    value={pwdOptions.find((o) => o.value === filters.pwd) || null}
                    onChange={(opt) => handlePwdChange(opt ? opt.value : "")}
                    placeholder="PWD"
                  />
                </div>

                <div className="w-44">
                  <Select
                    label={null}
                    options={singleParentOptions}
                    value={
                      singleParentOptions.find((o) => o.value === filters.single_parent) || null
                    }
                    onChange={(opt) => handleSingleParentChange(opt ? opt.value : "")}
                    placeholder="Single Parent"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      // reset filters
                      setSearchInput("");
                      setSearch("");
                      setFilters({ min_age: "", max_age: "", pwd: "", single_parent: "" });
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={residents}
              loading={loading}
              enableSearch={false}
              enablePagination={true}
              onPageChange={setPage}
              totalItems={total}
              currentPage={page}
              enableSelection={false}
              striped={false}
              hover={true}
              cellClassName="py-2.5 text-xs"
              headerClassName="text-xs font-medium text-gray-500 bg-gray-50/50"
              tableClassName="border-none"
              searchValue={search}
              onSearchChange={handleSearch}
              searchPlaceholder="Search by name, email, or contact number..."
              onSort={handleSort}
              sortConfig={{
                field: sortConfig.sort_by,
                direction: sortConfig.order,
              }}
              emptyMessage="No residents found"
              
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: "View Details",
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

      {/* View Resident Modal */}
      {showViewModal && (
        <ViewResidentModal
          resident={selectedResident}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedResident(null);
          }}
        />
      )}

      {/* Edit Resident Modal */}
      {showEditModal && (
        <EditResidentModal
          resident={selectedResident}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedResident(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedResident(null);
            fetchAllResidents(page, itemsPerPage);
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmArchive}
        title="Archive Resident"
        message={`Are you sure you want to archive ${residentToArchive?.name}? This action cannot be undone.`}
        type="danger"
        confirmText="Archive"
      />
    </div>
  );
};

export default AllResidents;
