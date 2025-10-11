import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import { fetchPendingResidents } from "../../../api/adminApi";
import { acceptAccount, rejectAccount } from "../../../api/ApproveRejectApi";
import { showCustomToast } from "../../../components/Toast/CustomToast";
import DataTable from "../../../components/reusable/DataTable";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { Clock, Users, UserCheck } from "lucide-react"; // Changed UserClock to Clock
import StatCard from "../../../components/reusable/StatCard";

const PendingResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPendingResidents(page, sortConfig)
      .then((response) => {
        const residentsWithName = (response.data || []).map((r) => ({
          ...r,
          name: `${r.first_name} ${r.last_name}`,
        }));
        setResidents(residentsWithName);
        setTotal(response.total || 0);
      })
      .catch((error) => {
        showCustomToast("Failed to fetch pending residents", "error");
        setResidents([]);  
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, sortConfig]);

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
      label: "Profile Picture",
      accessor: "profile_picture_path",
      render: (value, row) => {
        const hasProfilePic = !!value;
        const initials = row.first_name && row.last_name
          ? `${row.first_name[0]}${row.last_name[0]}`
          : '';
        const imgUrl = getProfilePicUrl(value);
        
        return (
          <div className="w-10 h-10">
            {hasProfilePic ? (
              <img
                src={imgUrl}
                alt={`${row.first_name}'s profile`}
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
      accessor: "name",
      render: (value, row) => {
        const hasProfilePic = !!row.profile_picture_path;
        const initials = row.first_name && row.last_name
          ? `${row.first_name[0]}${row.last_name[0]}`
          : value?.[0] || '';
        const imgUrl = getProfilePicUrl(row.profile_picture_path);
        return (
          <div className="flex items-center space-x-2"> 
           
            
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

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction
    });
  };

  const handleApproveClick = (resident) => {
    setSelectedResident(resident);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    setIsProcessing(true);
    try {
      await acceptAccount(selectedResident.id);
      showCustomToast("Account has been accepted successfully!", "success");
      setIsApproveModalOpen(false);
      // Refresh the residents list
      await refreshResidentsList();
    } catch (error) {
      showCustomToast(error.message || "Failed to accept account", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const refreshResidentsList = async () => {
    const response = await fetchPendingResidents(page, sortConfig);
    const updatedResidents = (response.data || []).map((r) => ({
      ...r,
      name: `${r.first_name} ${r.last_name}`,
    }));
    setResidents(updatedResidents);
    setTotal(response.total || 0);
  };

  const handleRejectClick = (resident) => {
    setSelectedResident(resident);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      showCustomToast("Please provide a reason for rejection", "error");
      return;
    }

    setIsProcessing(true);
    try {
      await rejectAccount(selectedResident.id, rejectReason);
      showCustomToast("Account rejected successfully", "success");
      setIsRejectModalOpen(false);
      setRejectReason('');
      // Refresh the residents list
      fetchPendingResidents(page, sortConfig).then((response) => {
        const updatedResidents = (response.data || []).map((r) => ({
          ...r,
          name: `${r.first_name} ${r.last_name}`,
        }));
        setResidents(updatedResidents);
        setTotal(response.total || 0);
      });
    } catch (error) {
      showCustomToast(error.message || "Failed to reject account", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-medium text-lg text-gray-800">Pending Applications</h3>
          <p className="text-sm text-gray-500 mt-1">Review and approve pending resident accounts</p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={residents}
            loading={loading}
            enableSearch
            enablePagination
            onPageChange={setPage}
            enableSelection={false}
            emptyMessage={loading ? "Loading..." : "No pending residents found."}
            totalItems={total}
            currentPage={page}
            onSort={handleSort}
            actions={[
              {
                label: "View",
                icon: <FaEye className="text-blue-600" />,
                onClick: (row) => {
                  setSelectedResident(row);
                  setIsModalOpen(true);
                },
                variant: "primary",
                disabled: isProcessing,
              },
              {
                label: "Approve",
                icon: <FaCheck className="text-green-600" />,
                onClick: handleApproveClick,
                variant: "success",
                disabled: isProcessing,
              },
              {
                label: "Reject",
                icon: <FaTimes className="text-red-600" />,
                onClick: handleRejectClick,
                variant: "danger",
                disabled: isProcessing,
              },
            ]}
            searchPlaceholder="Search by name, email, or contact number..."
          />
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Account"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsApproveModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleApproveConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={isProcessing}
            >
              {isProcessing ? 'Approving...' : 'Approve Account'}
            </button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to approve {selectedResident?.name}'s account? This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectReason('');
        }}
        title="Reject Account"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason('');
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              disabled={isProcessing}
            >
              {isProcessing ? 'Rejecting...' : 'Reject Account'}
            </button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Please provide a reason for rejecting {selectedResident?.name}'s account
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full border rounded-lg p-2 h-32"
            placeholder="Enter reason for rejection..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default PendingResidents;
 