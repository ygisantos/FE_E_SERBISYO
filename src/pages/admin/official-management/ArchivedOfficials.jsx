import React, { useState, useEffect } from "react";
import DataTable from "../../../components/reusable/DataTable";
import { FaEye, FaUndo } from "react-icons/fa";
import ViewOfficialModal from "../../../components/modals/ViewOfficialModal";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { fetchOfficials, getOfficialById, updateOfficialStatus } from "../../../api/adminApi";
import { showCustomToast } from "../../../components/Toast/CustomToast";

const ArchivedOfficials = () => {
  const [data, setData] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadOfficials();
  }, [page, search]);

  const loadOfficials = async () => {
    try {
      setLoading(true);
      const response = await fetchOfficials({
        page,
        status: 'inactive', // Use 'inactive' for API call
        search: search,
        sort_by: 'full_name',
        order: 'desc',
      });
      setData(response.data);
      setTotal(response.total);
    } catch (error) {
      showCustomToast("Failed to load archived officials", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (official) => {
    try {
      const officialDetails = await getOfficialById(official.id);
      setSelectedOfficial(officialDetails);
      setShowViewModal(true);
    } catch (error) {
      showCustomToast('Failed to fetch official details', 'error');
    }
  };

  const handleRestore = (official) => {
    setSelectedOfficial(official);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    try {
      await updateOfficialStatus(selectedOfficial.id, 'active'); // Keep using 'active'
      await loadOfficials();
      setShowRestoreModal(false);
      setSelectedOfficial(null);
      showCustomToast('Official restored successfully', 'success');
    } catch (error) {
      showCustomToast(error.message || 'Failed to restore official', 'error');
    }
  };

  const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    return `${storageUrl}/${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };

  const columns = [
    {
      label: "Profile Picture",
      accessor: "image_path",
      render: (value, row) => {
        const hasProfilePic = !!value;
        const initials = row.full_name ? row.full_name.charAt(0) : '';
        const imgUrl = getProfilePicUrl(value);
        
        return (
          <div className="w-10 h-10">
            {hasProfilePic ? (
              <img
                src={imgUrl}
                alt={`${row.full_name}'s profile`}
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
      accessor: "full_name",
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-800">{value}</span>
      )
    },
    {
      label: "Position",
      accessor: "position",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">{value}</span>
      ),
    },
    {
      label: "Term Start",
      accessor: "term_start",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">
          {formatDate(value)}
        </span>
      ),
    },
    {
      label: "Term End",
      accessor: "term_end",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">
          {formatDate(value)}
        </span>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Archived
        </span>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Archived Officials
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              View list of archived barangay officials
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4">
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              enableSearch={true}
              enablePagination={true}
              totalItems={total}
              currentPage={page}
              onPageChange={setPage}
              enableSelection={false}
              striped={false}
              hover={true}
              cellClassName="py-2.5 text-xs"
              headerClassName="text-xs font-medium text-gray-500 bg-gray-50/50"
              tableClassName="border-none"
              searchPlaceholder="Search archived officials..."
              searchValue={search}
              onSearchChange={setSearch}
              actions={[
                {
                  icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                  label: "View",
                  onClick: handleView,
                },
                {
                  icon: <FaUndo className="h-3.5 w-3.5 text-gray-400" />,
                  label: "Restore",
                  onClick: handleRestore,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {showViewModal && (
        <ViewOfficialModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedOfficial(null);
          }}
          official={selectedOfficial}
        />
      )}

      <ConfirmationModal
        isOpen={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
          setSelectedOfficial(null);
        }}
        onConfirm={confirmRestore}
        title="Restore Official"
        message={`Are you sure you want to restore ${selectedOfficial?.full_name}? This will make the official active again.`}
        confirmText="Restore"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default ArchivedOfficials;
  