import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { FaEye, FaRedo } from 'react-icons/fa';
import { fetchAllAccounts, updateAccountStatus } from '../../../api/accountApi';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import ViewStaffModal from '../../../components/modals/ViewStaffModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';

const ArchivedWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const loadArchivedWorkers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllAccounts({
        page,
        search,
        status: 'inactive', // Only get inactive accounts
        sort_by: 'created_at',
        order: 'desc'
      });
      
      // Filter for inactive staff and admin accounts only
      const filteredData = response.data ? response.data.filter(account => 
        (account.type === 'admin' || account.type === 'staff') && 
        account.status === 'inactive'
      ) : [];
      
      setWorkers(filteredData);
      setTotal(filteredData.length);
    } catch (error) {
      showCustomToast(error.message || 'Failed to load archived accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedWorkers();
  }, [page, search]);

  const handleRestore = async () => {
    try {
      await updateAccountStatus(selectedStaff.id, 'active');
      showCustomToast('Account restored successfully', 'success');
      loadArchivedWorkers();
      setShowRestoreModal(false);
      setSelectedStaff(null);
    } catch (error) {
      showCustomToast(error.message, 'error');
    }
  };

  const columns = [
    {
      label: 'Name',
      accessor: 'first_name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {row.first_name?.charAt(0)}
            </span>
          </div>
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
      label: 'Date Archived',
      accessor: 'updated_at',
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
        <div className="bg-white rounded-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">
              Archived Staff & Admin
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              View and manage archived accounts
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
              enableSelection={false}
              onPageChange={setPage}
              totalItems={total}
              currentPage={page}
              searchPlaceholder="Search archived staff..."
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: "View",
                  onClick: (staff) => {
                    setSelectedStaff(staff);
                    setShowViewModal(true);
                  },
                },
                {
                  icon: <FaRedo className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Restore",
                  onClick: (staff) => {
                    setSelectedStaff(staff);
                    setShowRestoreModal(true);
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
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

      <ConfirmationModal
        isOpen={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
          setSelectedStaff(null);
        }}
        onConfirm={handleRestore}
        title="Restore Account"
        message={`Are you sure you want to restore ${selectedStaff?.first_name}'s account?`}
        confirmText="Restore"
        cancelText="Cancel"
        type="success"
      />
    </div>
  );
};

export default ArchivedWorkers;
