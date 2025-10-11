import React, { useState, useEffect } from "react";
import DataTable from "../../components/reusable/DataTable";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { FaEye, FaPlus } from "react-icons/fa"; // Add this import
import { getAllBlotters } from "../../api/blotterApi";
import { toast } from "react-toastify";
import CreateBlotterModal from "../../components/modals/CreateBlotterModal";
import ViewBlotterModal from "../../components/modals/ViewBlotterModal";
import { useDebounce } from "../../hooks/useDebounce";

const Blotter = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [selectedBlotter, setSelectedBlotter] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    from_date: "",
    to_date: "",
   });

  // Add this status options array
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "filed", label: "Filed" },
    { value: "scheduled", label: "Scheduled" },
    { value: "resolved", label: "Resolved" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Fetch blotters
  const fetchBlotters = async () => {
    try {
      setLoading(true);
      const response = await getAllBlotters({
        page: currentPage,
        status: filters.status,
        from_date: filters.from_date,
        to_date: filters.to_date,
        ...sortConfig,
        search: search
      });

      if (response.success) {
        setData(response.data);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (error) {
      toast.error("Failed to fetch blotters");
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to handle the new response format
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBlotters();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, filters.status, filters.from_date, filters.to_date, search, sortConfig]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleView = (blotter) => {
    setSelectedBlotter(blotter);
    setShowViewModal(true);
  };

  const columns = [
    {
      label: "Case No.",
      accessor: "case_number",
      sortable: true
    },
    {
      label: "Complainant",
      accessor: "complainant_name",
      sortable: true
    },
    {
      label: "Respondent",
      accessor: "respondent_name",
      sortable: true,
      render: (value, row) => (
        <div>
          <div>{value}</div>
          {row.additional_respondent?.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              +{row.additional_respondent.length} more
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Case Type",
      accessor: "case_type",
      sortable: true
    },
    {
      label: "Filing Date",
      accessor: "date_filed",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      type: "badge",
      badgeColors: {
        filed: "yellow",
        resolved: "green",
        scheduled: "blue",
        cancelled: "red",
      },
    },
  ];

//SORT
  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction
    });
  };


  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Blotter Reports
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNewCaseModal(true)}
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
              New Case
            </button>
             
          </div>
        </div> */}
      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Blotter Case List
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all reported cases
          </p>
        </div>
        <div className="p-6">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            enableSearch
            searchValue={search}
            onSearchChange={setSearch}
            enablePagination
            itemsPerPage={filters.per_page}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            searchPlaceholder="Search blotter cases..."
            enableSelection={false}
            comboBoxFilter={{
              label: "Status",
              value: filters.status,
              onChange: (value) => handleFilterChange("status", value),
              options: statusOptions
            }}
            dateFilter={{
              label: "Date Range",
              startDate: filters.from_date,
              endDate: filters.to_date,
              onStartDateChange: (value) => handleFilterChange("from_date", value),
              onEndDateChange: (value) => handleFilterChange("to_date", value)
            }}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: "View Details",
                onClick: handleView,
              },
            ]}
            actionButton={{
              label: "New Case",
              icon: <FaPlus />,
              onClick: () => setShowNewCaseModal(true),
              className: "bg-red-900 text-white hover:bg-red-800",
            }}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Create Blotter Modal */}
      <CreateBlotterModal
        isOpen={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        onSuccess={fetchBlotters}
      />

      {/* View Blotter Modal */}
      {showViewModal && (
        <ViewBlotterModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBlotter(null);
          }}
          data={selectedBlotter}
        />
      )}
    </div>
  );
};
 

export default Blotter;
        