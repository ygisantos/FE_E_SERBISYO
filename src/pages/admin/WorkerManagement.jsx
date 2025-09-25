import React, { useState } from 'react';
import DataTable from '../../components/reusable/DataTable';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { UserPlus } from 'lucide-react';

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: 'Juan Dela Cruz',
      email: 'juan@example.com',
      position: 'Clerk',
      status: 'Active',
      dateAdded: '2024-01-15',
    },
   ]);

  const columns = [
    {
      label: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {value.charAt(0)}
            </span>
          </div>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      label: 'Email',
      accessor: 'email',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      label: 'Position',
      accessor: 'position',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
          {value}
        </span>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <span className={`h-1.5 w-1.5 mr-1.5 rounded-full ${
            value === 'Active' ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
          {value}
        </span>
      ),
    },
    {
      label: 'Date Added',
      accessor: 'dateAdded',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
           <div className="p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage barangay worker accounts and permissions
              </p>
            </div>
          </div>
 
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <DataTable
              columns={columns}
              data={workers}
              enableSearch={true}
              enablePagination={true}
              itemsPerPage={10}
              searchPlaceholder="Search workers..."
              actions={[
                {
                  icon: <FaEye className="w-4 h-4 text-blue-600 hover:text-blue-700" />,
                  label: 'View',
                  onClick: (row) => console.log('View', row),
                },
                {
                  icon: <FaEdit className="w-4 h-4 text-green-600 hover:text-green-700" />,
                  label: 'Edit',
                  onClick: (row) => console.log('Edit', row),
                },
                {
                  icon: <FaTrash className="w-4 h-4 text-red-600 hover:text-red-700" />,
                  label: 'Delete',
                  onClick: (row) => console.log('Delete', row),
                },
              ]}
              actionButton={{
                label: 'Add New Worker',
                icon: <UserPlus className="w-4 h-4" />,
                onClick: () => console.log('Add new worker clicked'),
                className: 'bg-red-900 hover:bg-red-800 text-white'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

 export default WorkerManagement;
