import React, { useState, useEffect } from "react";
import DataTable from "../../components/reusable/DataTable";
import StatCard from "../../components/reusable/StatCard";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { getAllBlotters } from "../../api/blotterApi";
import { toast } from "react-toastify";
import CreateBlotterModal from "../../components/modals/CreateBlotterModal";

// Sample data for demonstration
const blotterData = [
  {
    id: 1,
    blotter_number: "20001",
    incidents: "Car Accident",
    location: "Main Street Crossing",
    incident_date: "2025-08-30",
    status: "pending",
    remarks: "Two vehicles involved in collision",
    reporter: "1",
  },
  {
    id: 2,
    blotter_number: "20002",
    incidents: "Noise Complaint",
    location: "Residential Area Block 4",
    incident_date: "2025-08-31",
    status: "resolved",
    remarks: "Loud music during quiet hours",
    reporter: "2",
  },
  {
    id: 3,
    blotter_number: "20003",
    incidents: "Property Dispute",
    location: "Lot 23 Green Valley",
    incident_date: "2025-09-01",
    status: "unresolved",
    remarks: "Boundary dispute between neighbors",
    reporter: "3",
  },
];

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700",
  resolved: "bg-green-50 text-green-700",
  unresolved: "bg-red-50 text-red-700",
};

// Status options removed as we're using the filter section instead

const Blotter = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    from_date: "",
    to_date: "",
    per_page: 10
  });

  // Fetch blotters
  const fetchBlotters = async () => {
    try {
      setLoading(true);
      const response = await getAllBlotters({
        ...filters,
        page: currentPage
      });
      setData(response.data.data);
      setTotalItems(response.data.total);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch blotters");
      setLoading(false);
    }
  };

   useEffect(() => {
    fetchBlotters();
  }, [filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);  
  };

  const handleBulkAction = (action, selectedIds) => {
    switch (action) {
      case "resolve":
        console.log("Resolving cases:", selectedIds);
        // Implement bulk resolve logic
        break;
      case "print":
        console.log("Printing cases:", selectedIds);
        // Implement bulk print logic
        break;
      case "delete":
        console.log("Deleting cases:", selectedIds);
        // Implement bulk delete logic
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      label: "Blotter No.",
      accessor: "blotter_number",
      sortable: true,
    },
    {
      label: "Incident Type",
      accessor: "incidents",
      sortable: true,
    },
    {
      label: "Location",
      accessor: "location",
      sortable: true,
    },
    {
      label: "Incident Date",
      accessor: "incident_date",
      sortable: true,
      render: (value) =>
        new Date(value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      label: "Reporter ID",
      accessor: "reporter",
      sortable: true,
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[value] || "bg-gray-50 text-gray-700"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      label: "Remarks",
      accessor: "remarks",
      sortable: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
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
        </div>
      </div>{" "}
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FileText className="text-blue-600" />}
          label="All recorded cases in the system"
          value={data.length}
          color="bg-white border-gray-200"
        />

        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          label="Successfully resolved cases"
          value={data.filter((c) => c.status === "Closed").length}
          color="bg-white border-gray-200"
        />

        <StatCard
          icon={<Clock className="text-yellow-600" />}
          label="Cases awaiting resolution"
          value={data.filter((c) => c.status === "Open").length}
          color="bg-white border-gray-200"
        />

        <StatCard
          icon={<AlertTriangle className="text-red-600" />}
          label="High-priority cases requiring immediate attention"
          value={data.filter((c) => c.severity === "Serious").length}
          color="bg-white border-gray-200"
        />
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-medium text-gray-800">
              Blotter Case List
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all reported cases
            </p>
          </div>
          
        </div>
        <div className="p-6">
          {/* Filter Section */}
          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="unresolved">Unresolved</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) => handleFilterChange("from_date", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) => handleFilterChange("to_date", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-base py-2 px-3"
                />
              </div>


            </div>
          </div>

          <DataTable
            columns={columns}
            data={data}
            enableSearch={true}
            enablePagination={true}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={filters.per_page}
            onPageChange={setCurrentPage}
            loading={loading}
            striped={true}
            hover={true}
            cellClassName="py-3"
            enableSelection={false}
             bulkActions={[
              {
                label: "Resolve Selected",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ),
                handler: (selectedIds) =>
                  handleBulkAction("resolve", selectedIds),
              },
              {
                label: "Print Selected",
                icon: (
                  <svg
                    className="w-4 h-4"
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
                ),
                handler: (selectedIds) =>
                  handleBulkAction("print", selectedIds),
              },
            ]}
            // Removed combobox filter since we now have a dedicated filter section
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
                label: "View",
                handler: (row) => alert(`Details: ${row.details}`),
              },
            ]}
          />
        </div>
      </div>
    
      {/* Create Blotter Modal */}
      <CreateBlotterModal
        isOpen={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        onSuccess={fetchBlotters}
      />
    </div>
  );
};

export default Blotter;
