import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { FileText, AlertTriangle, MessageCircle, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { createAnnouncement, getAnnouncements } from '../../api/announcementApi';
import CreateAnnouncementModal from '../../components/modals/CreateAnnouncementModal';
import StatCard from '../../components/reusable/StatCard';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    type: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    fetchAnnouncements(1);
   }, [filters.type]);

  const fetchAnnouncements = async (page = pagination.currentPage) => {
    try {
      setIsLoading(true);
      const response = await getAnnouncements({
        page,
        per_page: pagination.perPage,
        type: filters.type
      });
      
      if (response.success) {
        const { current_page, last_page, total, data } = response.data;
        setAnnouncements(data);
        setPagination(prev => ({
          ...prev,
          currentPage: current_page,
          totalPages: last_page,
          total: total
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await createAnnouncement(formData);
      
      if (response.success) {
        toast.success('Announcement created successfully');
        setIsCreateModalOpen(false);
        setFormData({ type: '', description: '' });
        fetchAnnouncements();
      }
    } catch (error) {
      if (error.errors) {
        Object.keys(error.errors).forEach(field => {
          const messages = error.errors[field];
          messages.forEach(message => toast.error(`${field}: ${message}`));
        });
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create announcement. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      label: 'Type',
      accessor: 'type',
      sortable: true,
      render: (value) => {
        let bgColor = "bg-blue-50";
        let textColor = "text-blue-700";
        
        switch(value) {
          case "information":
            bgColor = "bg-blue-50";
            textColor = "text-blue-700";
            break;
          case "problem":
            bgColor = "bg-red-50";
            textColor = "text-red-700";
            break;
          case "warning":
            bgColor = "bg-yellow-50";
            textColor = "text-yellow-700";
            break;
          default:
            break;
        }
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} capitalize`}>
            {value}
          </span>
        );
      },
    },
    {
      label: 'Description',
      accessor: 'description',
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
    {
      label: 'Last Updated',
      accessor: 'updated_at',
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Announcements</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-5 py-2.5 bg-red-900 text-white rounded-lg text-sm font-medium hover:bg-red-800 cursor-pointer transition-all shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FileText className="text-blue-600" />}
          label="Total Announcements"
          value={announcements.length}
          color="bg-white border-gray-200"
        />
        <StatCard
          icon={<MessageCircle className="text-green-600" />}
          label="Information Posts"
          value={announcements.filter(a => a.type === 'information').length}
          color="bg-white border-gray-200"
        />
        <StatCard
          icon={<Bell className="text-yellow-600" />}
          label="Warning Announcements"
          value={announcements.filter(a => a.type === 'warning').length}
          color="bg-white border-gray-200"
        />
        <StatCard
          icon={<AlertTriangle className="text-red-600" />}
          label="Problem Reports"
          value={announcements.filter(a => a.type === 'problem').length}
          color="bg-white border-gray-200"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-medium text-gray-800">Announcement List</h3>
            <p className="text-sm text-gray-500 mt-1">Manage and track all announcements</p>
          </div>
          <div className="w-full sm:w-auto">
            <select
              className="border rounded-lg px-3 py-2 text-sm text-gray-600"
              value={filters.type}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, type: e.target.value }));
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
            >
              <option value="">All Types</option>
              <option value="information">Information</option>
              <option value="problem">Problem</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={announcements}
            enableSearch={true}
            enablePagination={true}
            itemsPerPage={pagination.perPage}
            currentPage={pagination.currentPage}
            totalItems={pagination.total}
            onPageChange={(page) => fetchAnnouncements(page)}
            striped={true}
            hover={true}
            cellClassName="py-3"
            actions={[
              {
                icon: <FaEye />,
                label: 'View Details',
                handler: (row) => {
                  toast.info(`${row.type}: ${row.description}`);
                },
              },
              {
                icon: <FaEdit />,
                label: 'Edit',
                handler: (row) => {
                  toast.info('Edit functionality coming soon');
                },
              },
              {
                icon: <FaTrash />,
                label: 'Delete',
                handler: (row) => {
                  toast.info('Delete functionality coming soon');
                },
              },
            ]}
          />
        </div>
      </div>

      <CreateAnnouncementModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        enablePagination={true}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AnnouncementManagement;
