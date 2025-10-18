import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { getAnnouncementById } from '../../api/announcementApi';
import { showCustomToast } from '../Toast/CustomToast';
import { FaCalendar, FaTimes } from 'react-icons/fa';

const ViewAnnouncementModal = ({ isOpen, onClose, announcementId }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen && announcementId) {
      fetchAnnouncementDetails();
    }
  }, [isOpen, announcementId]);

  const fetchAnnouncementDetails = async () => {
    try {
      if (!announcementId) return;
      
      const response = await getAnnouncementById(announcementId);
      if (response.success) {
        setAnnouncement(response.data);
      }
    } catch (error) {
      showCustomToast('Failed to fetch announcement details', 'error');
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TruncatedText = ({ text, maxLength = 300 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!text || text.length <= maxLength) {
      return <p className="text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap">{text}</p>;
    }

    return (
      <div>
        <div className={`relative ${!isExpanded ? 'max-h-32' : ''} overflow-hidden`}>
          <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">{text}</p>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      </div>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Announcement Details"
        modalClass="max-w-3xl"
      >
        {announcement ? (
          <div className="p-6">
            {/* Header with Type & Date */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                announcement.type === 'information' ? 'bg-blue-100 text-blue-800' :
                announcement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {announcement.type?.toUpperCase()}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaCalendar className="w-3.5 h-3.5" />
                {formatDate(announcement.created_at)}
              </div>
            </div>

            {/* Description section */}
            <div className="mb-6">
              <TruncatedText text={announcement.description} />
            </div>

            {/* Images Grid */}
            {announcement.images?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {announcement.images.map((image, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className="aspect-video rounded-lg overflow-hidden bg-gray-50 cursor-pointer hover:opacity-90 transition-all border border-gray-100"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_STORAGE_URL}/${image}`}
                      alt={`Announcement ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* Fullscreen Image Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
          <img
            src={`${import.meta.env.VITE_API_STORAGE_URL}/${selectedImage}`}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </>
  );
};

export default ViewAnnouncementModal;
