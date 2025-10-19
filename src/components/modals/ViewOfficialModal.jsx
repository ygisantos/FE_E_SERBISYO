import React from 'react';
import Modal from '../Modal/Modal';

const ViewOfficialModal = ({ isOpen, onClose, official }) => {
   const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    // Remove /storage prefix and use storage URL
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    const cleanPath = path.replace(/^\/storage\//, '');
    return `${storageUrl}/${cleanPath}`;
  };

  const getFullName = (official) => {
    if (!official?.account) return 'N/A';
    const { first_name, middle_name, last_name, suffix } = official.account;
    return `${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}${suffix ? ' ' + suffix : ''}`.trim();
  };

  const sections = [
    {
      title: 'Official Information',
      fields: [
        { label: 'Full Name', value: getFullName(official) },
        { label: 'Position', value: official?.position },
        { label: 'Status', value: official?.status === 'inactive' ? 'ARCHIVED' : official?.status?.toUpperCase() },
        { label: 'Email', value: official?.account?.email },
        { label: 'Contact No.', value: official?.account?.contact_no }
      ]
    },
    {
      title: 'Personal Information',
      fields: [
        { label: 'Sex', value: official?.account?.sex === 'M' ? 'Male' : 'Female' },
        { label: 'Civil Status', value: official?.account?.civil_status?.charAt(0).toUpperCase() + official?.account?.civil_status?.slice(1) },
        { label: 'Nationality', value: official?.account?.nationality },
        { label: 'Birthday', value: official?.account?.birthday ? new Date(official.account.birthday).toLocaleDateString() : 'N/A' },
        { label: 'Birth Place', value: official?.account?.birth_place }
      ]
    },
    {
      title: 'Address Information',
      fields: [
        { label: 'House No.', value: official?.account?.house_no },
        { label: 'Street', value: official?.account?.street },
        { label: 'Barangay', value: official?.account?.barangay },
        { label: 'Municipality', value: official?.account?.municipality },
        { label: 'ZIP Code', value: official?.account?.zip_code }
      ]
    },
    {
      title: 'Term Information',
      fields: [
        { 
          label: 'Term Start', 
          value: official?.term_start ? new Date(official.term_start).toLocaleDateString() : 'N/A'
        },
        { 
          label: 'Term End', 
          value: official?.term_end ? new Date(official.term_end).toLocaleDateString() : 'N/A'
        }
      ]
    },
    {
      title: 'System Information',
      fields: [
        { 
          label: 'Account Type', 
          value: official?.account?.type?.toUpperCase() || 'N/A'
        },
        { 
          label: 'Date Created', 
          value: official?.created_at ? new Date(official.created_at).toLocaleDateString() : 'N/A'
        },
        { 
          label: 'Last Updated', 
          value: official?.updated_at ? new Date(official.updated_at).toLocaleDateString() : 'N/A'
        }
      ]
    }
  ];

  const hasProfilePic = !!official?.image_path;
  const initials = official?.account ? 
    `${official.account.first_name?.[0] || ''}${official.account.last_name?.[0] || ''}` : '';
  const imgUrl = getProfilePicUrl(official?.image_path);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Information" modalClass="max-w-2xl">
      <div className="p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 mb-6 border-b border-gray-100 text-center sm:text-left">
          {hasProfilePic ? (
            <img
              src={imgUrl}
              alt={getFullName(official)}
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
              {getFullName(official)}
            </h3>
            <p className="text-sm text-gray-500">{official?.position}</p>
            <span className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              official?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {official?.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Grid Layout for Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-3">
            <InfoSection
              title="Contact Details"
              fields={[
                { label: 'Email', value: official?.account?.email },
                { label: 'Phone', value: official?.account?.contact_no }
              ]}
            />
            <InfoSection
              title="Term Period"
              fields={[
                { label: 'Start', value: official?.term_start ? new Date(official.term_start).toLocaleDateString() : 'N/A' },
                { label: 'End', value: official?.term_end ? new Date(official.term_end).toLocaleDateString() : 'N/A' }
              ]}
            />
          </div>

          {/* Personal Information */}
          <div className="space-y-4 sm:space-y-3">
            <InfoSection
              title="Personal Details"
              fields={[
                { label: 'Gender', value: official?.account?.sex === 'M' ? 'Male' : 'Female' },
                { label: 'Birthday', value: official?.account?.birthday ? new Date(official.account.birthday).toLocaleDateString() : 'N/A' },
                { label: 'Civil Status', value: official?.account?.civil_status?.charAt(0).toUpperCase() + official?.account?.civil_status?.slice(1) }
              ]}
            />
          </div>
          
          {/* Full Width Address Section */}
          <div className="col-span-1 sm:col-span-2">
            <InfoSection
              title="Complete Address"
              fields={[{
                label: 'Address',
                value: `${official?.account?.house_no} ${official?.account?.street}, ${official?.account?.barangay}, ${official?.account?.municipality} ${official?.account?.zip_code}`
              }]}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Helper component for info sections
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

export default ViewOfficialModal;
