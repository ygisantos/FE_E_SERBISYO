import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CreateBlotterModal from '../../components/modals/CreateBlotterModal';
import ViewBlotterModal from '../../components/modals/ViewBlotterModal';
import EditBlotterModal from '../../components/modals/EditBlotterModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getAllBlotters, updateBlotter, deleteBlotter, showBlotterByCase } from '../../api/blotterApi';
import { showCustomToast } from '../../components/Toast/CustomToast';

const MyCases = () => {
  const { currentUser } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editingCase, setEditingCase] = useState(null);
  const [deletingCase, setDeletingCase] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });

  useEffect(() => {
    if (currentUser) {
      fetchBlotters();
    }
  }, [currentUser, currentPage, search, sortConfig]);

  // Add debug logging to fetchBlotters
  const fetchBlotters = async () => {
    try {
      setLoading(true);
      const response = await getAllBlotters({
        page: currentPage,
        per_page: 10,
        search,
        created_by: currentUser?.id,
        ...sortConfig
      });

      if (response.success) {
        const userBlotters = response.data.data.filter(
          blotter => blotter.created_by?.id === currentUser?.id
        );
        console.log('Fetched blotters:', userBlotters); // Debug log
        setData(userBlotters);
        setTotal(userBlotters.length);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showCustomToast(error.message || "Failed to fetch blotters", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (caseData) => {
    setEditingCase(caseData);
    setShowEditModal(true);
  };

  const handleUpdate = async (caseNumber, updatedData) => {
    try {
      const response = await updateBlotter(caseNumber, updatedData);
      if (response.success) {
        showCustomToast('Blotter updated successfully', 'success');
        fetchBlotters(); // Refresh the list
        setShowEditModal(false);
        setEditingCase(null);
      }
    } catch (error) {
      showCustomToast(error.message || 'Failed to update blotter', 'error');
    }
  };

  const handleView = async (blotter) => {
    try {
      setLoading(true);
      const response = await showBlotterByCase(blotter.case_number);
      setSelectedCase(response.data); // Access the data property from response
      setShowViewModal(true);
    } catch (error) {
      showCustomToast(error.message || "Failed to fetch blotter details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
   setShowNewCaseModal(false);
    fetchBlotters(); // Refresh the list
  };

  const handleDelete = (blotter) => {
    setDeletingCase(blotter);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteBlotter(deletingCase.case_number);
      if (response.success) {
        showCustomToast("Sumbong deleted successfully", "success");
        fetchBlotters();
      }
    } catch (error) {
      showCustomToast(error.message || "Failed to delete sumbong", "error");
    } finally {
      setShowDeleteModal(false);
      setDeletingCase(null);
    }
  };

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction
    });
  };

  const checkStatus = (row) => {
    console.log('Row data:', row);
    console.log('Current status:', row.status);
    console.log('Status type:', typeof row.status);
    
    // Strict status check
    const isFiled = row.status === 'filed';
    console.log('Is filed status?', isFiled);
    
    return isFiled;
  };

  const columns = [
    {
      label: "Case No.",
      accessor: "case_number",
      sortable: true
    },
    {
      label: "Complainant",
      accessor: "complainant_name",
      sortable: true
    },
    {
      label: "Respondent",
      accessor: "respondent_name",
      sortable: true,
      render: (value, row) => (
        <div>
          <div>{value}</div>
          {row.additional_respondent?.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              +{row.additional_respondent.length} more
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Case Type",
      accessor: "case_type",
      sortable: true
    },
    {
      label: "Filing Date",
      accessor: "date_filed",
      sortable: true,
      render: (value) => {
        try {
          // Handle both date formats
          const date = value ? new Date(value) : null;
          return date && !isNaN(date.getTime()) 
            ? date.toLocaleDateString()
            : 'Invalid Date';
        } catch (error) {
          return 'Invalid Date';
        }
      }
    },
    {
      label: "Status",
      accessor: "status",
      sortable: true,
      type: "badge",
      badgeColors: {
        filed: "yellow",
        resolved: "green",
        scheduled: "blue",
        cancelled: "red",
      },
    }
  ];

  // Debug logging function
  const debugRow = (row) => {
    console.log('Checking row:', {
      case_number: row.case_number,
      status: row.status,
      type: typeof row.status
    });
  };

  // Updated actions array with better status checking
  const actions = [
    {
      icon: <FaEye className="text-blue-600" />,
      label: "View Details",
      onClick: handleView
    },
    {
      icon: <FaEdit className="text-green-600" />,
      label: "Edit Case",
      onClick: handleEdit,
      disabled: (row) => row.status !== "filed",
      tooltip: () => "Can only edit filed cases"
    },
    {
      icon: <FaTrash className="text-red-600" />,
      label: "Cancel Sumbong",
      onClick: handleDelete,
      disabled: (row) => row.status !== "filed",
      tooltip: () => "Can only cancel filed cases"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">My Sumbong</h3>
          <p className="mt-1 text-sm text-gray-500">Track and manage your filed complaints</p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            enableSearch={true}
            enableSelection={false}
            searchValue={search}
            onSearchChange={setSearch}
            enablePagination={true}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onSort={handleSort}
            actions={actions}
            actionButton={{
              label: "Magsumbong",
              icon: <FaPlus />,
              onClick: () => setShowNewCaseModal(true),
              className: "bg-red-900 text-white hover:bg-red-800",
            }}
          />
        </div>
      </div>

      {/* Edit Blotter Modal */}
      <EditBlotterModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCase(null);
        }}
        data={editingCase}
        onSuccess={() => {
          fetchBlotters();
        }}
      />

      {/* Create Blotter Modal */}
      <CreateBlotterModal
        isOpen={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        onSuccess={handleCreateSuccess}
        createdBy={currentUser?.id}
      />

      {/* View Blotter Modal */}
      {showViewModal && (
        <ViewBlotterModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedCase(null);
          }}
          data={selectedCase}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCase(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Cancel Sumbong"
        message="Are you sure you want to cancel this sumbong? This action cannot be undone."
        confirmText="Cancel Sumbong"
        cancelText="Keep Sumbong"
        type="danger"
      />
    </div>
  );
};

export default MyCases;
