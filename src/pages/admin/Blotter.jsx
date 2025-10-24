import React, { useState, useEffect } from "react";
import DataTable from "../../components/reusable/DataTable";
import { FaEye } from "react-icons/fa";
import { getAllBlotters, showBlotterByCase } from "../../api/blotterApi";
import { showCustomToast } from "../../components/Toast/CustomToast";
import { useUser } from "../../contexts/UserContext";
import ViewBlotterModal from "../../components/modals/ViewBlotterModal";

import { formatDate, isDateInRange } from '../../utils/dateUtils';

const Blotter = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(10);
  const { currentUser } = useUser();
  const [selectedBlotter, setSelectedBlotter] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [search, setSearch] = useState("");

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
    { value: "ongoing", label: "Ongoing" },
    { value: "settled", label: "Settled" },
   ];

  // Fetch blotters without date range params
  const fetchBlotters = async () => {
    try {
      setLoading(true);
      const response = await getAllBlotters({
        page: currentPage,
        status: filters.status,
        ...sortConfig,
        search: search,
        per_page: 10
      });

      if (response.success) {
        // Filter data by date range if dates are provided
        let filteredData = response.data.data; // Access the nested data array
        if (filters.from_date || filters.to_date) {
          filteredData = filteredData.filter(item => 
            isDateInRange(
              item.date_filed,
              filters.from_date,
              filters.to_date
            )
          );
        }

        setData(filteredData);
        setTotalItems(response.data.total); // Update to access total from the correct path
      }
    } catch (error) {
      showCustomToast("Failed to fetch sumbong cases", "error");
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

  const handleView = async (blotter) => {
    try {
      setLoading(true);
      const response = await showBlotterByCase(blotter.case_number);
      setSelectedBlotter(response.data); // Access the data property from response
      setShowViewModal(true);
    } catch (error) {
      showCustomToast(error.message || "Failed to fetch blotter details", "error");
    } finally {
      setLoading(false);
    }
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
      render: (value) => formatDate(value)
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
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Sumbong Case List
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            View and manage reported sumbong cases
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
            enablePagination={true}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={perPage}
            searchPlaceholder="Search sumbong cases..."
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
            onSort={handleSort}
          />
        </div>
      </div>

      {/* View Blotter Modal */}
      {showViewModal && (
        <ViewBlotterModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBlotter(null);
          }}
          data={selectedBlotter} // This now contains the correct data structure
         />
      )}
    </div>
  );
};
 

export default Blotter;
