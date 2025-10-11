import React from 'react';
import Modal from '../Modal/Modal';

const ViewAnnouncementModal = ({ isOpen, onClose, announcement }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${import.meta.env.VITE_API_STORAGE_URL}/${cleanPath}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Announcement Details"
      size="lg"
    >
      {announcement && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              announcement.type === 'information' ? 'bg-blue-50 text-blue-700' :
              announcement.type === 'problem' ? 'bg-red-50 text-red-700' :
              'bg-yellow-50 text-yellow-700'
            } capitalize`}>
              {announcement.type}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{announcement.description}</p>
          </div>

          {announcement.images?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {announcement.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImageUrl(image)}
                      alt={`Announcement image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png';
                        e.target.onerror = null;
                      }}
                    />
                    <a
                      href={getImageUrl(image)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200"
                    >
                      <span className="text-white opacity-0 group-hover:opacity-100">View Full Size</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 flex justify-between">
            <span>Created: {new Date(announcement.created_at).toLocaleString()}</span>
            <span>Updated: {new Date(announcement.updated_at).toLocaleString()}</span>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewAnnouncementModal;
