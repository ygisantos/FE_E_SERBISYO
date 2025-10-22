import React, { useEffect, useState } from "react";
import { fetchPendingResidents } from "../../../api/adminApi";
import { getUserById } from "../../../api/userApi";
import { showCustomToast } from "../../../components/Toast/CustomToast";
import DataTable from "../../../components/reusable/DataTable";
import { FaEye } from "react-icons/fa";
import ViewResidentApplicationModal from '../../../components/modals/ViewResidentApplicationModal';

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

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

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction
    });
  };

  const handleViewDetails = async (resident) => {
    try {
      // Get complete user details
      const userDetails = await getUserById(resident.id);
      setSelectedResident(userDetails);
      setIsViewModalOpen(true);
    } catch (error) {
      showCustomToast("Failed to fetch resident details", "error");
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

  const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^\/storage\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const columns = [
    {
      label: 'Profile Picture',
      accessor: 'profile_picture_path',
      render: (value, row) => {
        const hasProfilePic = !!value;
        const initials = row.first_name && row.last_name
          ? `${row.first_name[0]}${row.last_name[0]}`.toUpperCase()
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
      sortable: true,
      render: (value) => <span className="text-xs text-gray-800">{value}</span>
    },
    {
      label: "Email",
      accessor: "email",
      render: (value) => <span className="text-xs text-gray-600">{value}</span>
    },
    {
      label: "Contact No.",
      accessor: "contact_no",
      render: (value) => <span className="text-xs text-gray-600">{value}</span>
    },
    {
      label: "House No.",
      accessor: "house_no",
      render: (value) => <span className="text-xs text-gray-600">{value}</span>
    },
    {
      label: "Street",
      accessor: "street",
      render: (value) => <span className="text-xs text-gray-600">{value}</span>
    },
    {
      label: "Municipality",
      accessor: "municipality",
      render: (value) => <span className="text-xs text-gray-600">{value}</span>
    },
    {
      label: "Barangay",
      accessor: "barangay",
      render: (value) => <span className="text-xs text-gray-600">{value}</span>
    },
    {
      label: "Filing Date",
      accessor: "created_at",
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      label: "Status",
      accessor: "status",
      type: "badge",
      badgeColors: { 
        pending: "yellow",
        rejected: "red",
        active: "green"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                Pending Applications
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Review and process new resident registrations
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4">
            <DataTable
              columns={columns}
              data={residents}
              loading={loading}
              enableSearch={true}
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
              searchPlaceholder="Search by name or email..."
              emptyMessage="No pending applications found"
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: "View Details",
                  onClick: handleViewDetails
                }
              ]}
            />
          </div>
        </div>
      </div>

      <ViewResidentApplicationModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedResident(null);
        }}
        resident={selectedResident}
        onSuccess={() => {
          setIsViewModalOpen(false);
          refreshResidentsList();
        }}
        showActions={true}
      />
    </div>
  );
};

export default PendingResidents;
