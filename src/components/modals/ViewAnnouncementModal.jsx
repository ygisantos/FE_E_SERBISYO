import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { getAnnouncementById } from '../../api/announcementApi';
import { showCustomToast } from '../Toast/CustomToast';

const ViewAnnouncementModal = ({ isOpen, onClose, announcementId }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && announcementId) {
      fetchAnnouncementDetails();
    }
  }, [isOpen, announcementId]);

  const fetchAnnouncementDetails = async () => {
    try {
      setLoading(true);
      if (!announcementId) return;
      
      const response = await getAnnouncementById(announcementId);
      if (response.success) {
        setAnnouncement(response.data);
      }
    } catch (error) {
      showCustomToast('Failed to fetch announcement details', 'error');
      onClose();
    } finally {
      setLoading(false);
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

  const getBadgeColor = (type) => {
    const colors = {
      information: 'bg-blue-100 text-blue-800',
      problem: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Announcement Details"
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
        </div>
      ) : announcement ? (
        <div className="space-y-6 p-4">
          <div className="flex items-start justify-between">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(announcement.type)}`}>
              {announcement.type}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(announcement.created_at)}
            </span>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{announcement.description}</p>

          {announcement.images && announcement.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {announcement.images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_STORAGE_URL}/${image}`}
                    alt={`Announcement image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No announcement details available
        </div>
      )}
    </Modal>
  );
};

export default ViewAnnouncementModal;
