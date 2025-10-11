import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import Modal from '../../components/Modal/Modal';
import { FaEye } from 'react-icons/fa';
import { getFeedbacks } from '../../api/feedbackApi';
import { showCustomToast } from '../../components/Toast/CustomToast';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    rating: ''
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    sort_by: 'created_at',
    order: 'desc'
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.currentPage, pagination.perPage, filters, sortConfig]);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await getFeedbacks({
        page: pagination.currentPage,
        per_page: pagination.perPage,
        ...filters,
        ...sortConfig
      });
      
      if (response.success) {
        const { current_page, last_page, total, data } = response.data;
        setFeedbacks(data);
        setPagination(prev => ({
          ...prev,
          currentPage: current_page,
          totalPages: last_page,
          total: total
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setShowViewModal(true);
  };

  const handleSort = ({ column, direction }) => {
    setSortConfig({
      sort_by: column,
      order: direction
    });
  };

  const columns = [
    {
      label: 'Category',
      accessor: 'category',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">{value}</span>
      ),
    },
    {
      label: 'Rating',
      accessor: 'rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="text-xs text-gray-600">{value}/5</span>
        </div>
      ),
    },
    {
      label: 'Remarks',
      accessor: 'remarks',
      sortable: true,
      render: (value) => (
        <div className="max-w-lg">
          <span className="text-xs text-gray-600">
            {value.length > 80 ? `${value.substring(0, 80)}...` : value}
          </span>
        </div>
      ),
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Feedback List
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            View and manage resident feedback
          </p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={feedbacks}
            loading={isLoading}
            enableSearch={true}
            searchValue={search}
            onSearchChange={setSearch}
            enablePagination={true}
            itemsPerPage={pagination.perPage}
            totalItems={pagination.total}
            currentPage={pagination.currentPage}
            onPageChange={handlePageChange}
            searchPlaceholder="Search feedbacks..."
            comboBoxFilter={{
              label: "Category",
              options: [
                { label: 'All Categories', value: '' },
                { label: 'Random', value: 'Random' }
              ],
              value: filters.category || '',
              onChange: (value) => handleFilterChange('category', value)
            }}
            actions={[
              {
                icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                label: 'View Details',
                onClick: handleView
              }
            ]}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* View Feedback Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedFeedback(null);
        }}
        title="Feedback Details"
        modalClass="max-w-2xl"
      >
        {selectedFeedback && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Category</label>
                <p className="text-sm mt-1">{selectedFeedback.category}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Rating</label>
                <p className="text-sm mt-1">{selectedFeedback.rating}/5</p>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500">Feedback</label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedFeedback.remarks}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackManagement;
    