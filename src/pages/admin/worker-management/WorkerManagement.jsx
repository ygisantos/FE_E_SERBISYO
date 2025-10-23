import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { UserPlus } from 'lucide-react';
import AddStaffModal from '../../../components/modals/AddStaffModal';
import ViewStaffModal from '../../../components/modals/ViewStaffModal';
import EditStaffModal from '../../../components/modals/EditStaffModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { createAccount, fetchAllAccounts, updateAccountStatus } from '../../../api/accountApi';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import { useAuth } from '../../../contexts/AuthContext';  

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const { user } = useAuth();  

  // Add status filter options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" }
  ];

  // Add type filter options
  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" }
  ];

  const [filters, setFilters] = useState({
    status: "",
    type: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const loadWorkers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllAccounts({
        page,
        search,
        status: 'active', // Only fetch active accounts
        ...sortConfig
      });
      
      // Filter only active admin and staff accounts, excluding current user
      const filteredData = response.data ? response.data.filter(account => 
        (account.type === 'admin' || account.type === 'staff') && 
        account.id !== user?.id &&
        account.status === 'active' // Double check status is active
      ) : [];

      setWorkers(filteredData);
      setTotal(filteredData.length);
    } catch (error) {
      showCustomToast(error.message || 'Failed to load accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) { // Only load if we have user info
      loadWorkers();
    }
  }, [page, search, sortConfig, user?.id]);

  const handleSort = ({ column, direction }) => {
    // Map frontend column names to backend sort fields
    const sortMapping = {
      first_name: 'name', // When sorting by first_name, use 'name' for backend
      created_at: 'created_at'
    };

    setSortConfig({
      sort_by: sortMapping[column] || column,
      order: direction
    });
  };

  const handleAddStaff = async (staffData) => {
    try {
      await createAccount(staffData);
      await loadWorkers(); // Refresh list after successful creation
      setShowAddModal(false); // Close modal only on success
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleView = (staff) => {
    setSelectedStaff(staff);
    setShowViewModal(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  const handleArchive = (staff) => {
    setSelectedStaff(staff);
    setShowArchiveModal(true);
  };

  const confirmArchive = async () => {
    try {
      await updateAccountStatus(selectedStaff.id, 'inactive');
      showCustomToast('Account archived successfully', 'success');
      loadWorkers();
    } catch (error) {
      showCustomToast(error.message, 'error');
    } finally {
      setShowArchiveModal(false);
      setSelectedStaff(null);
    }
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
      label: 'Name',
      accessor: 'first_name', // Keep this as first_name for display
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {row.first_name?.charAt(0)}
            </span>
          </div> */}
          <span className="text-xs text-gray-800">
            {`${row.first_name} ${row.last_name}`}
          </span>
        </div>
      ),
    },
    {
      label: 'Email',
      accessor: 'email',
      sortable: true,
      render: (value) => <span className="text-xs text-gray-600">{value}</span>,
    },
    {
      label: 'Type',
      accessor: 'type',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700">
          {value?.toUpperCase()}
        </span>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      type: 'badge',
      badgeColors: {
        active: 'green',
        pending: 'yellow',
        inactive: 'red'
      }
    },
    {
      label: 'Date Added',
      accessor: 'created_at',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">
              Staff & Admin List
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage staff and admin accounts
            </p>
          </div>
          <div className="p-6">
            <DataTable
              columns={columns}
              data={workers}
              loading={loading}
              enableSearch={true}
              searchValue={search}
              onSearchChange={setSearch}
              enablePagination={true}
              onPageChange={setPage}
              totalItems={total}
              currentPage={page}
              searchPlaceholder="Search staff..."
              onSort={handleSort}
              enableSelection={false}
              comboBoxFilters={[
                {
                  label: "Status",
                  value: filters.status,
                  onChange: (value) => handleFilterChange("status", value),
                  options: statusOptions
                },
                {
                  label: "Type",
                  value: filters.type,
                  onChange: (value) => handleFilterChange("type", value),
                  options: typeOptions
                }
              ]}
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: "View",
                  onClick: handleView,
                },
                {
                  icon: <FaEdit className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Edit",
                  onClick: handleEdit,
                },
                {
                  icon: <FaTrash className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Archive",
                  onClick: handleArchive,
                },
              ]}
              actionButton={{
                label: "Add Staff",
                icon: <UserPlus className="w-3.5 h-3.5" />,
                onClick: () => setShowAddModal(true),
                className: "bg-red-900 text-white hover:bg-red-800"
              }}
            />
          </div>
        </div>
      </div>

      <AddStaffModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStaff}
      />

      {showViewModal && (
        <ViewStaffModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
        />
      )}

      {showEditModal && (
        <EditStaffModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
            loadWorkers();
          }}
        />
      )}

      <ConfirmationModal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setSelectedStaff(null);
        }}
        onConfirm={confirmArchive}
        title="Archive Account"
        message={`Are you sure you want to archive ${selectedStaff?.first_name}'s account? This action cannot be undone.`}
        confirmText="Archive"
        cancelText="Cancel"
      />
    </div>
  );
};

export default WorkerManagement;
