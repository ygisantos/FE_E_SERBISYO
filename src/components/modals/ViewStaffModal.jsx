import React from 'react';
import Modal from '../Modal/Modal';

const ViewStaffModal = ({ isOpen, onClose, staff }) => {
  const getProfilePicUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    return `${base}${path}`;
  };

  const sections = [
    {
      title: 'Staff Information',
      fields: [
        { label: 'Full Name', value: `${staff?.first_name || ''} ${staff?.middle_name || ''} ${staff?.last_name || ''}`.trim() },
        { label: 'Account Type', value: staff?.type?.toUpperCase() },
        { label: 'Status', value: staff?.status?.toUpperCase() },
        { label: 'Email', value: staff?.email },
        { label: 'Contact No.', value: staff?.contact_no || 'N/A' }
      ]
    },
    {
      title: 'Personal Information',
      fields: [
        { label: 'Sex', value: staff?.sex === 'M' ? 'Male' : 'Female' },
        { label: 'Civil Status', value: staff?.civil_status?.charAt(0).toUpperCase() + staff?.civil_status?.slice(1) },
        { label: 'Nationality', value: staff?.nationality },
        { label: 'Birthday', value: staff?.birthday ? new Date(staff.birthday).toLocaleDateString() : 'N/A' },
        { label: 'Birth Place', value: staff?.birth_place }
      ]
    },
    {
      title: 'Address Information',
      fields: [
        { label: 'House No.', value: staff?.house_no },
        { label: 'Street', value: staff?.street },
        { label: 'Barangay', value: staff?.barangay },
        { label: 'Municipality', value: staff?.municipality },
        { label: 'ZIP Code', value: staff?.zip_code }
      ]
    },
    {
      title: 'System Information',
      fields: [
        { label: 'Date Created', value: staff?.created_at ? new Date(staff.created_at).toLocaleDateString() : 'N/A' },
        { label: 'Last Updated', value: staff?.updated_at ? new Date(staff.updated_at).toLocaleDateString() : 'N/A' }
      ]
    }
  ];

  const hasProfilePic = !!staff?.profile_picture_path;
  const initials = staff?.first_name && staff?.last_name
    ? `${staff.first_name[0]}${staff.last_name[0]}`
    : '';
  const imgUrl = getProfilePicUrl(staff?.profile_picture_path);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Information" modalClass="max-w-2xl">
      <div className="p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 mb-6 border-b border-gray-100 text-center sm:text-left">
          {hasProfilePic ? (
            <img
              src={imgUrl}
              alt={`${staff?.first_name}'s profile`}
              className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md"
              onError={(e) => { e.target.src = '/placeholder-avatar.png'; }}
            />
          ) : (
            <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl sm:text-lg border-2 border-white shadow-md">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {`${staff?.first_name} ${staff?.last_name}`}
            </h3>
            <p className="text-sm text-gray-500">{staff?.type?.toUpperCase()}</p>
            <span className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              staff?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {staff?.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Grid Layout for Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {sections.slice(0, 2).map((section, idx) => (
            <div key={idx} className="space-y-4 sm:space-y-3">
              <InfoSection title={section.title} fields={section.fields} />
            </div>
          ))}
          
          {/* Full Width Address Section */}
          <div className="col-span-1 sm:col-span-2">
            <InfoSection
              title="Complete Address"
              fields={[{
                label: 'Address',
                value: `${staff?.house_no} ${staff?.street}, ${staff?.barangay}, ${staff?.municipality} ${staff?.zip_code}`
              }]}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

const InfoSection = ({ title, fields }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">{title}</h4>
    <div className="space-y-2">
      {fields.map((field, idx) => (
        <div key={idx}>
          <span className="text-xs text-gray-500">{field.label}</span>
          <p className="text-sm text-gray-900 break-words">{field.value || '-'}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ViewStaffModal;
