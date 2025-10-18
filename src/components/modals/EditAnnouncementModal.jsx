import React, { useState, useEffect, useRef } from 'react';
import Modal from '../Modal/Modal';
import { FaImage, FaTimes } from 'react-icons/fa';
import { updateAnnouncement } from '../../api/announcementApi';
import { showCustomToast } from '../Toast/CustomToast';
import Select from '../reusable/Select';

const EditAnnouncementModal = ({ isOpen, onClose, announcement, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    images: [],
    existing_images: [] // For keeping track of existing image
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const typeOptions = [
    { value: 'information', label: 'Information' },
    { value: 'problem', label: 'Problem' },
    { value: 'warning', label: 'Warning' }
  ];

  // Match character limit with CreateAnnouncementModal
  const MAX_CHARS = 1000;
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (announcement) {
      // Truncate description if it exceeds MAX_CHARS
      const truncatedDescription = announcement.description?.slice(0, MAX_CHARS) || '';
      
      setFormData({
        type: announcement.type || '',
        description: truncatedDescription,
        images: [],
        existing_images: announcement.images || []
      });
      
      if (announcement.images?.[0]) {
        setPreviewUrl(`${import.meta.env.VITE_API_STORAGE_URL}/${announcement.images[0]}`);
      }
      
      // Set initial char count with truncated text
      setCharCount(truncatedDescription.length);
    }
  }, [announcement]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    // Only update if within character limit
    if (value.length <= MAX_CHARS) {
      setFormData(prev => ({ ...prev, description: value }));
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      formDataToSend.append('id', announcement.id);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('_method', 'PUT');

      // If there's a new image, use that
      if (formData.images?.length > 0) {
        formDataToSend.append('images[]', formData.images[0]);
      } 
      // If keeping existing image and no new image uploaded
      else if (formData.existing_images?.length > 0) {
        formData.existing_images.forEach(img => {
          formDataToSend.append('existing_images[]', img);
        });
      }
      // If explicitly removed (both arrays empty)
      else {
        formDataToSend.append('remove_images', '1');
      }

      const response = await updateAnnouncement(announcement.id, formDataToSend);
      if (response.success) {
        showCustomToast('Announcement updated successfully', 'success');
        onSuccess();
      }
    } catch (error) {
      showCustomToast(error.message || 'Failed to update announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        images: [file],
        existing_images: [] // Clear existing image when new one is selected
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [],
      existing_images: []
    }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Announcement"
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <Select
          label="Type"
          value={typeOptions.find(opt => opt.value === formData.type)}
          onChange={(selected) => setFormData(prev => ({
            ...prev,
            type: selected.value
          }))}
          options={typeOptions}
          required
        />

        {/* Description Field with Character Counter */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs ${charCount >= MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            required
            placeholder="Enter announcement details..."
            className={`mt-1 block w-full rounded-md px-4 py-2 border-gray-300 shadow-sm 
              focus:border-red-500 focus:ring-red-500 text-sm
              ${charCount >= MAX_CHARS ? 'border-red-300' : ''}`}
            rows={6}
            onKeyDown={(e) => {
              if (formData.description.length >= MAX_CHARS && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
              }
            }}
          />
          {charCount >= MAX_CHARS && (
            <p className="text-xs text-red-500 mt-1">
              Character limit reached
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          
          {previewUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm"
                >
                  <span className="text-white text-sm flex items-center gap-2">
                    <FaTimes className="w-4 h-4" />
                    Remove Image
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaImage className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-900 rounded-md hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAnnouncementModal;
