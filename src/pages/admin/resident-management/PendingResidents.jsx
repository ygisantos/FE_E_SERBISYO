import React, { useEffect, useState } from "react";
import { fetchPendingResidents } from "../../../api/adminApi";
import DataTable from "../../../components/reusable/DataTable";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";

const PendingResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetchPendingResidents(page, itemsPerPage)
      .then((data) => {
        const residentsWithName = (data.data || []).map((r) => ({
          ...r,
          name: `${r.first_name} ${r.last_name}`,
        }));
        setResidents(residentsWithName);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch pending residents.");
        setLoading(false);
      });
  }, [page]);

  const formattedDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

 const getProfilePicUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  return `${base}${path}`;
};
  const columns = [
    {
      label: "Name",
      accessor: "name",
      render: (value, row) => {
        const hasProfilePic = !!row.profile_picture_path;
        const initials = row.first_name && row.last_name
          ? `${row.first_name[0]}${row.last_name[0]}`
          : value?.[0] || '';
        const imgUrl = getProfilePicUrl(row.profile_picture_path);
        return (
          <div className="flex items-center space-x-2">
            {hasProfilePic ? (
              <img
                src={imgUrl}
                alt={value}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
                onError={e => { e.target.src = '/placeholder-avatar.png'; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-gray-200">
                {initials}
              </div>
            )}
            <span className="text-xs text-gray-800">{value}</span>
          </div>
        );
      }
    },
    { label: "Email", accessor: "email" },
    { label: "Contact No.", accessor: "contact_no" },
    { label: "House No.", accessor: "house_no" },
    { label: "Street", accessor: "street" },
    { label: "Municipality", accessor: "municipality" },
    { label: "Barangay", accessor: "barangay" },
    {
      label: "Requested Date",
      accessor: "created_at",
      render: (value) => <span>{formattedDate(value)}</span>,
    },
    {
      label: "Status",
      accessor: "status",
      type: "badge",
      badgeColors: { pending: "yellow" },
    },
  ];

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 rounded-md bg-white shadow-md border border-gray-200 h-screen">
      <h2 className="text-2xl font-semibold text-neutral-950 mb-4">
        Pending Resident Accounts
      </h2>
      <DataTable
        columns={columns}
        data={residents}
        loading={loading}
        enableSearch
        enablePagination
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        enableSelection={false}
        emptyMessage="No pending residents found."
        totalItems={total}
        currentPage={page}
        actions={[
          {
            label: "View",
            icon: <FaEye className="text-blue-600" />,
            onClick: (row) => {
              alert(`Viewing resident: ${row.name}`);
            },
            variant: "primary",
          },
          {
            label: "Approve",
            icon: <FaCheck className="text-green-600" />,
            onClick: (row) => {
              alert(`Approving resident: ${row.name}`);
            },
            variant: "success",
          },
          {
            label: "Reject",
            icon: <FaTimes className="text-red-600" />,
            onClick: (row) => {
              alert(`Rejecting resident: ${row.name}`);
            },
            variant: "danger",
          },
        ]}
      />
    </div>
  );
};

export default PendingResidents;
