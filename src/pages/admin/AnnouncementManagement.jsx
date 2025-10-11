import React, { useState, useEffect } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { createAnnouncement, getAnnouncements } from '../../api/announcementApi';
import CreateAnnouncementModal from '../../components/modals/CreateAnnouncementModal';

import ViewAnnouncementModal from '../../components/modals/ViewAnnouncementModal';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    images: []
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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
        setFormData({ type: '', description: '', images: [] });
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
      type: 'badge',
      badgeColors: {
        information: 'blue',
        problem: 'red',
        warning: 'yellow'
      },
      render: (value) => (
        <span className="capitalize text-xs">{value}</span>
      ),
    },
    {
      label: 'Description',
      accessor: 'description',
      sortable: false,
      render: (value) => (
        <div className="max-w-lg">
          <span className="text-xs text-gray-600">
            {value.length > 80 ? `${value.substring(0, 80)}...` : value}
          </span>
        </div>
      ),
    },
    {
      label: 'Images',
      accessor: 'images',
      sortable: false,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {value?.length || 0} image{value?.length !== 1 ? 's' : ''}
        </span>
      )
    },
    {
      label: 'Created',
      accessor: 'created_at',
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    }
  ];

  const handleView = (row) => {
    setSelectedAnnouncement(row);
    setShowViewModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">
            Announcement List
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Manage and track all announcements
          </p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={announcements}
            loading={isLoading}
            enableSearch={true}
            enablePagination={true}
            itemsPerPage={pagination.perPage}
            currentPage={pagination.currentPage}
            totalItems={pagination.total}
            onPageChange={(page) => fetchAnnouncements(page)}
            searchPlaceholder="Search announcements..."
            comboBoxFilter={{
              label: "Type",
              value: filters.type,
              onChange: (value) => {
                setFilters(prev => ({ ...prev, type: value }));
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              },
              options: [
                { value: '', label: 'All Types' },
                { value: 'information', label: 'Information' },
                { value: 'problem', label: 'Problem' },
                { value: 'warning', label: 'Warning' }
              ]
            }}
            actions={[
              {
                icon: <FaEye className="h-3.5 w-3.5 text-gray-400" />,
                label: 'View Details',
                onClick: handleView,
              },
              {
                icon: <FaEdit className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Edit',
                onClick: (row) => {
                  toast.info('Edit functionality coming soon');
                },
              },
              {
                icon: <FaTrash className="h-3.5 w-3.5 text-gray-400" />,
                label: 'Delete',
                onClick: (row) => {
                  toast.info('Delete functionality coming soon');
                },
              },
            ]}
            actionButton={{
              label: "New Announcement",
              icon: <FileText className="w-3.5 h-3.5" />,
              onClick: () => setIsCreateModalOpen(true),
              className: "bg-red-900 text-white hover:bg-red-800"
            }}
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

      <ViewAnnouncementModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
      />
    </div>
  );
};

export default AnnouncementManagement;
   