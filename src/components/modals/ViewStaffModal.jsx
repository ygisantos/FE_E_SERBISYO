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
      title: 'Basic Information',
      fields: [
        { label: 'Full Name', value: `${staff?.first_name} ${staff?.middle_name || ''} ${staff?.last_name}` },
        { label: 'Email', value: staff?.email },
        { label: 'Contact', value: staff?.contact_no || 'N/A' },
        { label: 'Account Type', value: staff?.type?.toUpperCase() },
        { label: 'Status', value: staff?.status?.toUpperCase() },
      ]
    },
    {
      title: 'Address',
      fields: [
        { label: 'Complete Address', value: `${staff?.house_no || ''} ${staff?.street || ''}, ${staff?.barangay || ''}, ${staff?.municipality || ''}` },
        { label: 'ZIP Code', value: staff?.zip_code || 'N/A' },
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        { label: 'Date Added', value: new Date(staff?.created_at).toLocaleDateString() },
        { label: 'Last Updated', value: new Date(staff?.updated_at).toLocaleDateString() },
      ]
    }
  ];

  const hasProfilePic = !!staff?.profile_picture_path;
  const initials = staff?.first_name && staff?.last_name
    ? `${staff.first_name[0]}${staff.last_name[0]}`
    : '';
  const imgUrl = getProfilePicUrl(staff?.profile_picture_path);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Information">
      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          {hasProfilePic ? (
            <img
              src={imgUrl}
              alt={staff?.first_name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
              onError={(e) => { e.target.src = '/placeholder-avatar.png'; }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {`${staff?.first_name} ${staff?.last_name}`}
            </h3>
            <p className="text-xs text-gray-500">{staff?.email}</p>
          </div>
        </div>

        {/* Details Sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {section.title}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {section.fields.map((field, fieldIdx) => (
                <div key={fieldIdx} className="flex flex-col">
                  <span className="text-xs text-gray-500">{field.label}</span>
                  <span className="text-sm text-gray-900">{field.value || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ViewStaffModal;
