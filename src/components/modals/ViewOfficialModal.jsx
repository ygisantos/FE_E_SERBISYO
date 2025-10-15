import React from 'react';
import Modal from '../Modal/Modal';

const ViewOfficialModal = ({ isOpen, onClose, official }) => {
  const getProfilePicUrl = (path) => {
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    // Use storage URL from env
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    return `${storageUrl}/${path}`;
  };

  const sections = [
    {
      title: 'Official Information',
      fields: [
        { label: 'Full Name', value: official?.full_name },
        { label: 'Position', value: official?.position },
        { label: 'Status', value: official?.status?.toUpperCase() },
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
        },
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        { 
          label: 'Date Created', 
          value: official?.created_at ? new Date(official.created_at).toLocaleDateString() : 'N/A'
        },
        { 
          label: 'Last Updated', 
          value: official?.updated_at ? new Date(official.updated_at).toLocaleDateString() : 'N/A'
        },
      ]
    }
  ];

  const hasProfilePic = !!official?.image_path;
  const initials = official?.full_name ? official.full_name.charAt(0) : '';
  const imgUrl = getProfilePicUrl(official?.image_path);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Information">
      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          {hasProfilePic ? (
            <img
              src={imgUrl}
              alt={official?.full_name}
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
              {official?.full_name}
            </h3>
            <p className="text-xs text-gray-500">{official?.position}</p>
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

export default ViewOfficialModal;
