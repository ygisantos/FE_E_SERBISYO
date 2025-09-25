import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye } from 'react-icons/fa';
import { MessageSquare, Star, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { getFeedbacks } from '../../api/feedbackApi';
import StatCard from '../../components/reusable/StatCard';

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

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.currentPage, pagination.perPage, filters]);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await getFeedbacks({
        page: pagination.currentPage,
        per_page: pagination.perPage,
        ...filters
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

  const columns = [
    {
      label: 'Category',
      accessor: 'category',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
          {value}
        </span>
      ),
    },
    {
      label: 'Rating',
      accessor: 'rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          {[...Array(parseInt(value))].map((_, index) => (
            <svg
              key={index}
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      ),
    },
    {
      label: 'Remarks',
      accessor: 'remarks',
      sortable: false,
      render: (value) => (
        <div className="max-w-lg" title={value}>
          <div className="truncate">
            {value.length > 150 ? `${value.substring(0, 150)}...` : value}
          </div>
        </div>
      ),
    },
    {
      label: 'Created',
      accessor: 'created_at',
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Feedback Management</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage resident feedback</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<MessageSquare className="text-blue-600" />}
          label="Total Feedbacks"
          value={pagination.total}
          color="bg-white border-gray-200"
        />
        <StatCard
          icon={<Star className="text-yellow-400" />}
          label="Average Rating"
          value={feedbacks.length > 0 
            ? (feedbacks.reduce((acc, curr) => acc + parseInt(curr.rating), 0) / feedbacks.length).toFixed(1)
            : 0}
          color="bg-white border-gray-200"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {/* DataTable */}
        <div className="overflow-hidden">
          <DataTable
            columns={columns}
            data={feedbacks}
            loading={isLoading}
            enableSearch={true}
            searchPlaceholder="Search remarks..."
            enablePagination={true}
            itemsPerPage={pagination.perPage}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
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
                icon: <FaEye className="text-blue-600" />,
                label: 'View Details',
                onClick: (row) => toast.info(`Viewing feedback details: ${row.id}`),
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
