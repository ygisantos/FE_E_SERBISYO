import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { fetchAllResidents } from '../../../api/adminApi';
import { getUserById } from '../../../api/userApi';
import { FaEye, FaEdit, FaArchive } from 'react-icons/fa';
import { showCustomToast } from '../../../components/Toast/CustomToast';
import ViewResidentModal from '../../../components/modals/ViewResidentModal';
import EditResidentModal from '../../../components/modals/EditResidentModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';

const AllResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const [selectedResident, setSelectedResident] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [residentToArchive, setResidentToArchive] = useState(null);

  const getProfilePicUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_BASE_URL;
    return `${base}${path}`;
  };

  const confirmArchive = async () => {
    try {
      // API call to archive resident
      showCustomToast('Resident archived successfully', 'success');
      fetchAllResidents(page, itemsPerPage);
    } catch (error) {
      showCustomToast('Failed to archive resident', 'error');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAllResidents(page, itemsPerPage)
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
        setError('Failed to fetch residents.');
        showCustomToast('Failed to fetch residents', 'error');
        setLoading(false);
      });
  }, [page]);

  const handleView = async (resident) => {
    try {
      const userDetails = await getUserById(resident.id);
      setSelectedResident(userDetails);
      setShowViewModal(true);
    } catch (error) {
      showCustomToast('Failed to fetch resident details', 'error');
    }
  };

  const handleEdit = (resident) => {
    setSelectedResident(resident);
    setShowEditModal(true);
  };

  const handleArchive = (resident) => {
    setResidentToArchive(resident);
    setShowConfirmModal(true);
  };

  const columns = [
    {
      label: 'Profile Picture',
      accessor: 'profile_picture_path',
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
      accessor: 'name',
      render: (value) => (
        <span className="text-xs text-gray-800">{value}</span>
      )
    },
    { label: 'Email', accessor: 'email' },
    { label: 'Contact No.', accessor: 'contact_no' },
    { label: 'House No.', accessor: 'house_no' },
    { label: 'Street', accessor: 'street' },
    { label: 'Municipality', accessor: 'municipality' },
    { label: 'Barangay', accessor: 'barangay' },
    {
      label: 'Status',
      accessor: 'status',
      type: 'badge',
      badgeColors: { 
        active: 'green',
        inactive: 'gray',
        pending: 'yellow',
        rejected: 'red'
      },
    }
  ];

 
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Simplified */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                Residence List
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage and monitor registered residents
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
              searchPlaceholder="Search residents..."
              emptyMessage="No residents found"
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: "View Details",
                  onClick: handleView,
                },
                {
                  icon: <FaEdit className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Edit",
                  onClick: handleEdit,
                },
                {
                  icon: <FaArchive className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Archive",
                  onClick: handleArchive,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* View Resident Modal */}
      {showViewModal && (
        <ViewResidentModal
          resident={selectedResident}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedResident(null);
          }}
        />
      )}

      {/* Edit Resident Modal */}
      {showEditModal && (
        <EditResidentModal
          resident={selectedResident}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedResident(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedResident(null);
            fetchAllResidents(page, itemsPerPage);
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmArchive}
        title="Archive Resident"
        message={`Are you sure you want to archive ${residentToArchive?.name}? This action cannot be undone.`}
        type="danger"
        confirmText="Archive"
      />
    </div>
  );
};

export default AllResidents;
