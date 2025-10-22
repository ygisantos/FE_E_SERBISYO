import React, { useState, useEffect } from "react";
import DataTable from "../../components/reusable/DataTable";
import { getAllActivityLogs } from "../../api/activityLogApi";
import { showCustomToast } from "../../components/Toast/CustomToast";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    sort_by: "created_at",
    order: "desc",
  });

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await getAllActivityLogs({
        page: pagination.currentPage,
        sort_by: sortConfig.sort_by,
        order: sortConfig.order,
        search: search,
      });

      setLogs(response.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.current_page,
        totalItems: response.total,
        lastPage: response.last_page,
      }));
    } catch (error) {
      showCustomToast(error || "Failed to fetch activity logs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, [pagination.currentPage, sortConfig, search]);

  const columns = [
    {
      label: "Module",
      accessor: "module",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      label: "User",
      accessor: "account",
      sortable: true,
      render: (account) =>
        account ? (
          <div>
            <div className="font-medium text-gray-900">
              {`${account.first_name || ""} ${account.last_name || ""}`}
            </div>
            <div className="text-sm text-gray-500">
              {account.email || "N/A"}
            </div>
          </div>
        ) : (
          <div>N/A</div>
        ),
    },
    {
      label: "User Type",
      accessor: "account.type",
      sortable: true,
      render: (value, row) => {
        const type = row?.account?.type || "N/A";
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              type === "admin"
                ? "bg-purple-50 text-purple-700"
                : type === "staff"
                ? "bg-blue-50 text-blue-700"
                : type === "residence"
                ? "bg-green-50 text-green-700"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {type === "N/A"
              ? type
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        );
      },
    },
    {
      label: "Action",
      accessor: "remark",
      sortable: true,
      render: (value) => <span className="text-gray-900">{value}</span>,
    },
    {
      label: "Timestamp",
      accessor: "created_at",
      sortable: true,
      render: (value) => (
        <span className="text-gray-500">
          {new Date(value).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Activity Log List
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all user activities and system actions
          </p>
        </div>
        <div className="p-6">
          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            enableSearch={true}
            searchValue={search}
            onSearchChange={setSearch}
            enableSelection={false}
            enablePagination={true}
            currentPage={pagination.currentPage}
            totalItems={pagination.totalItems}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, currentPage: page }))
            }
            onSort={({ column, direction }) => {
              setSortConfig({
                sort_by: column,
                order: direction,
              });
            }}
            searchPlaceholder="Search by module or remark..."
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
