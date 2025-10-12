import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaPlus } from 'react-icons/fa';
import CreateBlotterModal from '../../components/modals/CreateBlotterModal';
import ViewBlotterModal from '../../components/modals/ViewBlotterModal';
import { getAllBlotters } from '../../api/blotterApi';
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchBlotters();
    }
  }, [currentUser, currentPage]);

  const fetchBlotters = async () => {
    try {
      setLoading(true);
      const response = await getAllBlotters({
        page: currentPage
      });

      if (response?.success && response?.data) {
        // Filter blotters for current user
        const userBlotters = response.data.filter(
          blotter => blotter.created_by === currentUser?.id
        );
        
        setData(userBlotters);
        setTotal(userBlotters.length);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Blotter fetch error:', error);
      setData([]);
      setTotal(0);
      showCustomToast('Unable to load blotter cases', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (blotter) => {
    setSelectedCase(blotter);
    setShowViewModal(true);
  };

  const handleCreateSuccess = () => {
    showCustomToast('Blotter filed successfully', 'success');
    setShowNewCaseModal(false);
    fetchBlotters(); // Refresh the list
  };

  const columns = [
    {
      label: "Case No.",
      accessor: "case_number",
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
      render: (value) => new Date(value).toLocaleDateString(),
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">My Blotter Cases</h3>
          <p className="mt-1 text-sm text-gray-500">Track and manage your filed complaints</p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            enableSearch={true}
            searchValue={search}
            onSearchChange={setSearch}
            enablePagination={true}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            actions={[
              {
                icon: <FaEye className="text-blue-600" />,
                label: "View Details",
                onClick: handleView,
              }
            ]}
            actionButton={{
              label: "File a Case",
              icon: <FaPlus />,
              onClick: () => setShowNewCaseModal(true),
              className: "bg-red-900 text-white hover:bg-red-800",
            }}
          />
        </div>
      </div>

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
    </div>
  );
};

export default MyCases;
   