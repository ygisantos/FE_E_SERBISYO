import React, { useState } from "react";
import DataTable from "../../../components/reusable/DataTable";

const officialsData = [
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
    term_end: "2024-06-30",
    status: "Ended",
  },
  {
    id: 4,
    name: "Ana Garcia",
    position: "Treasurer",
    term_start: "2022-07-01",
    term_end: "2023-06-30",
    status: "Ended",
  },
  {
    id: 5,
    name: "Jose Martinez",
    position: "Kagawad",
    term_start: "2022-07-01",
    term_end: "2025-06-30",
    status: "Active",
  },
];

const EndTermOfficials = () => {
  // Filter officials whose term has ended (status === 'Ended' or term_end < today)
  const today = new Date();
  const data = officialsData.filter(
    (o) =>
      o.status === "Ended" ||
      new Date(o.term_end) < today
  );

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
      label: "Term Start",
      accessor: "term_start",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">
          {new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      label: "Term End",
      accessor: "term_end",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">
          {new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          value === "Ended"
            ? "bg-red-50 text-red-700"
            : "bg-green-50 text-green-700"
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Barangay Officials - End Term</h1>
          <p className="mt-1 text-sm text-gray-500">
            List of officials whose term has ended or is about to end.
          </p>
        </div>
           <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900">Official End Term List</h3>
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
                  icon: (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ),
                  label: "View",
                  handler: (row) => console.log("View", row),
                },
                {
                  icon: (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                  label: "Archive",
                  handler: (row) => console.log("Archive", row),
                },
              ]}
            />
          </div>
        </div>
      </div>
   );
};

export default EndTermOfficials;
