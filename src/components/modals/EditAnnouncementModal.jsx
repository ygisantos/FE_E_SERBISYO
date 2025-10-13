import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { FaImage, FaTrash } from 'react-icons/fa';
import { updateAnnouncement } from '../../api/announcementApi';
import { showCustomToast } from '../Toast/CustomToast';

const EditAnnouncementModal = ({ isOpen, onClose, announcement, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const announcementTypes = [
    { value: 'information', label: 'Information' },
    { value: 'problem', label: 'Problem' },
    { value: 'warning', label: 'Warning' }
  ];

  useEffect(() => {
    if (announcement) {
      setFormData({
        type: announcement.type || '',
        description: announcement.description || '',
        images: []
      });
      setImagePreviews(announcement.images?.map(img => 
        `${import.meta.env.VITE_API_STORAGE_URL}/${img}`) || []);
    }
  }, [announcement]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      showCustomToast('Only JPG, JPEG, and PNG files are allowed', 'error');
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateAnnouncement(announcement.id, formData);
      showCustomToast('Announcement updated successfully', 'success');
      onSuccess();
    } catch (error) {
      showCustomToast(error.message || 'Failed to update announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Announcement"
    >
      <div className="p-4 space-y-4">
        {/* Type Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full p-2 border rounded-lg"
          >
            {announcementTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded-lg resize-none"
            rows={4}
          />
        </div>

        {/* Images */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
            >
              <FaImage className="inline mr-2" />
              Add Images
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditAnnouncementModal;
            