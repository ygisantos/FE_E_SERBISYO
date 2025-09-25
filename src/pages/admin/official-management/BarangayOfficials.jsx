import React, { useState } from "react";
import DataTable from "../../../components/reusable/DataTable";
import Button from "../../../components/reusable/Button";
import { FaEye, FaEdit } from "react-icons/fa";
import AddOfficialModal from "../../../components/modals/AddOfficialModal";
import { createOfficial } from "../../../api/adminApi";

const BarangayOfficials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

   const columns = [
    {
      label: "Official",
      accessor: "name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-base">
            {value.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{value}</p>
          </div>
        </div>
      ),
    },
    {
      label: "Position",
      accessor: "position",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>,
    },
    {
      label: "Term",
      accessor: "term_start",
      sortable: true,
      render: (value, row) => (
        <div className="text-sm text-gray-700">
          {new Date(value).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}{" "}
          -{" "}
          {new Date(row.term_end).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === "Active"
              ? "bg-green-50 text-green-700"
              : "bg-gray-50 text-red-600"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // Sample data
  const [data, setData] = useState([
    {
      id: 1,
      name: "Juan Dela Cruz",
      position: "Barangay Captain",
      term_start: "2022-07-01",
      term_end: "2025-06-30",
      status: "Active",
    },
    {
      id: 2,
      name: "Maria Santos",
      position: "Kagawad",
      term_start: "2022-07-01",
      term_end: "2025-06-30",
      status: "Active",
    },
    {
      id: 3,
      name: "Pedro Reyes",
      position: "Secretary",
      term_start: "2022-07-01",
      term_end: "2025-06-30",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Ana Garcia",
      position: "Treasurer",
      term_start: "2022-07-01",
      term_end: "2025-06-30",
      status: "Active",
    },
    {
      id: 5,
      name: "Jose Martinez",
      position: "Kagawad",
      term_start: "2022-07-01",
      term_end: "2025-06-30",
      status: "Active",
    },
  ]);

  // Add new official handler
  const handleAddOfficial = () => {
    setIsModalOpen(true);
  };

  const handleSubmitOfficial = async (officialData) => {
    try {
      const response = await createOfficial(officialData);
      const newOfficial = {
        id: response.official.id,
        name: response.official.full_name,
        position: response.official.position,
        term_start: response.official.term_start,
        term_end: response.official.term_end,
        status: response.official.status,
      };
      setData([...data, newOfficial]);
    } catch (error) {
      console.error("Error creating official:", error);
    }
  };

  // Active officials count
  const activeOfficials = data.filter(
    (official) => official.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-white border border-gray-200 rounded-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Barangay Officials
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {data.length} officials, {activeOfficials} currently active
              </p>
            </div>
            <Button
              onClick={handleAddOfficial}
              className="w-fit inline-flex items-center px-4 py-2 border shadow-sm text-sm font-med focus:outline-none"
            >
              Add Official
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-medium text-gray-900">
                Officials Directory
              </h3>
            </div>
          </div>
          <div className="px-6 py-4">
            <DataTable
              columns={columns}
              data={data}
              enableSearch={true}
              enablePagination={true}
              enableSelection={false}
              itemsPerPage={5}
              striped={false}
              hover={true}
              cellClassName="py-3"
              actions={[
                {
                  icon: <FaEye className="h-4 w-4 text-gray-400" />,
                  label: "View",
                  handler: (row) => console.log("View", row),
                },
                {
                  icon: <FaEdit className="h-4 w-4 text-gray-400" />,
                  label: "Edit",
                  handler: (row) => console.log("Edit", row),
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
    </div>
  );
};

export default BarangayOfficials;
