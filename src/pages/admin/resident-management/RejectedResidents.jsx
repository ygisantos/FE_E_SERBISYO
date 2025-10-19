import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { fetchRejectedAccounts } from '../../../api/adminApi';
import { FaEye } from 'react-icons/fa';
import { AlertCircle } from 'lucide-react';
import StatCard from '../../../components/reusable/StatCard';

const ArchivedResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetchRejectedAccounts({
      page,
      per_page: itemsPerPage,
      sort_by: 'created_at',
      order: 'desc'
    })
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
        setError('Failed to fetch rejected accounts.');
        setLoading(false);
      });
  }, [page]);

  const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    // Remove /storage prefix and use storage URL
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^\/storage\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const columns = [
    {
      label: "Profile Picture",
      accessor: "profile_picture_path",
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
      label: "Name",
      accessor: "name",
      render: (value) => (
        <span className="text-xs text-gray-800">{value}</span>
      )
    },
    { label: 'Email', accessor: 'email' },
    { label: 'Contact No.', accessor: 'contact_no' },
    { 
      label: 'Rejection Reason', 
      accessor: 'reason',
      render: (value) => (
        <div className="max-w-xs truncate text-red-600">
          {value || 'No reason provided'}
        </div>
      )
    },
    {
      label: 'Rejected Date',
      accessor: 'created_at',
      render: (value) => <span>{formattedDate(value)}</span>,
    },
  ];

  const formattedDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rejected Applications</h1>
          <p className="mt-1 text-sm text-gray-600">View all rejected resident applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={<AlertCircle className="text-red-600" />}
          label="Total Rejected"
          value={total}
          color="bg-white border-gray-200"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-medium text-gray-800">Rejected Applications</h3>
          <p className="text-sm text-gray-500 mt-1">List of all rejected resident accounts</p>
        </div>

        <div className="p-6">
          <DataTable
            columns={columns}
            data={residents}
            loading={loading}
            enableSearch
            enablePagination
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            emptyMessage="No rejected accounts found."
            totalItems={total}
            currentPage={page}
            actions={[
              {
                label: "View Details",
                icon: <FaEye className="text-blue-600" />,
                onClick: (row) => {
                  // Handle viewing rejected account details
                  console.log('View details:', row);
                },
                variant: "primary",
              }
            ]}
            searchPlaceholder="Search by name, email, or contact number..."
          />
        </div>
      </div>
    </div>
  );
};

export default ArchivedResidents;
