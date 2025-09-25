import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/reusable/DataTable';
import { fetchArchivedResidents } from '../../../api/adminApi';
import { FaUndo } from 'react-icons/fa';

const ArchivedResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetchArchivedResidents(page, itemsPerPage)
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
        setError('Failed to fetch archived residents.');
        setLoading(false);
      });
  }, [page]);

  const formattedDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const columns = [
    {
      label: 'Name',
      accessor: 'name',
      type: 'avatar',
      imageField: 'profile_picture_path',
    },
    { label: 'Email', accessor: 'email' },
    { label: 'Contact No.', accessor: 'contact_no' },
    { label: 'House No.', accessor: 'house_no' },
    { label: 'Street', accessor: 'street' },
    { label: 'Municipality', accessor: 'municipality' },
    { label: 'Barangay', accessor: 'barangay' },
    {
      label: 'Archived Date',
      accessor: 'archived_at',
      render: (value) => <span>{formattedDate(value)}</span>,
    },
  ];

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 rounded-md bg-white shadow-md border border-gray-200 h-screen">
      <h2 className="text-2xl font-semibold text-neutral-950 mb-4">
        Archived Residents
      </h2>
      <DataTable
        columns={columns}
        data={residents}
        loading={loading}
        enableSearch
        enablePagination
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        emptyMessage="No archived residents found."
        totalItems={total}
        currentPage={page}
        actions={[
          {
            label: "Restore",
            icon: <FaUndo className="text-blue-600" />,
            onClick: (row) => {
              alert(`Restoring resident: ${row.name}`);
            },
            variant: "primary",
          }
        ]}
      />
    </div>
  );
};

export default ArchivedResidents;
