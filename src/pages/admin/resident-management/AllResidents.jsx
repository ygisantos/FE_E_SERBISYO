import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { fetchAllResidents } from '../../../api/adminApi';

const AllResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

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
        setLoading(false);
      });
  }, [page]);

  const columns = [
    {
      label: 'Name',
      accessor: 'name',
      render: (value, row) => {
        const hasProfilePic = !!row.profile_picture_path;
        const initials = row.first_name && row.last_name
          ? `${row.first_name[0]}${row.last_name[0]}`
          : value?.[0] || '';
        return (
          <div className="flex items-center space-x-2">
            {hasProfilePic ? (
              <img
                src={row.profile_picture_path}
                alt={value}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
                onError={e => { e.target.src = '/placeholder-avatar.png'; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-gray-200">
                {initials}
              </div>
            )}
            <span className="text-xs text-gray-800">{value}</span>
          </div>
        );
      }
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
    },
  ];

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 rounded-md bg-white shadow-md border border-gray-200 h-screen">
      <h2 className="text-2xl font-semibold text-neutral-950 mb-4">
        All Residents
      </h2>
      <DataTable
        columns={columns}
        data={residents}
        loading={loading}
        enableSearch
        enablePagination
        itemsPerPage={itemsPerPage}
        enableSelection={false}
        onPageChange={setPage}
        emptyMessage="No residents found."
        totalItems={total}
        currentPage={page}
      />
    </div>
  );
};

export default AllResidents;
