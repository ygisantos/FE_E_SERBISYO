import React, { useState, useRef } from 'react';
import { FaCamera, FaSpinner, FaEdit} from 'react-icons/fa';
import Modal from '../Modal/Modal';
import { updateProfilePicture } from '../../api/accountApi';
import { showCustomToast } from '../Toast/CustomToast';

const ProfileHeader = ({ profile, onProfileUpdate = () => {}, onEdit }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Get initials from name
  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowModal(true);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profile_picture', selectedImage);
      
      const response = await updateProfilePicture(profile.id, formData);
      
      if (response?.profile_picture_path) {
        showCustomToast('Profile picture updated successfully', 'success');
        // Add null check before calling onProfileUpdate
        if (typeof onProfileUpdate === 'function') {
          onProfileUpdate(response.profile_picture_path);
        }
        setShowModal(false);
        setSelectedImage(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showCustomToast('Failed to update profile picture', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setShowModal(false);
  };

  // Updated getProfilePicUrl helper
  const getProfilePicUrl = (path) => {
    console.log('Original path:', path);
    if (!path) return '/placeholder-avatar.png';
    if (path.startsWith('http')) return path;
    
    const storageUrl = import.meta.env.VITE_API_STORAGE_URL;
    console.log('Storage URL:', storageUrl);
    
    const cleanPath = path.replace(/^\/storage\//, '');
    console.log('Clean path:', cleanPath);
    
    const fullUrl = `${storageUrl}/${cleanPath}`;
    console.log('Full URL:', fullUrl);
    return fullUrl;
  };

  return (
    <>
      <div className="flex flex-col items-center -mt-16 mb-8 relative z-10">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-lg">
            {profile?.profile_picture_path ? (
              <img 
                src={getProfilePicUrl(profile.profile_picture_path)}
                alt={`${profile.first_name}'s profile`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load image:', e.target.src);
                  e.target.onerror = null;
                  e.target.src = '/placeholder-avatar.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-red-900 text-white text-3xl font-semibold">
                {getInitials()}
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaCamera className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="mt-4 text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {`${profile?.first_name || ''} ${profile?.last_name || ''}`}
          </h2>
          {/* Only show Edit Profile button if onEdit prop is provided */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-900 bg-red-50 rounded-md hover:bg-red-100 hover:text-red-800 hover:shadow-sm transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <FaEdit className="w-4 h-4 mr-1.5" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCancel}
        title="Update Profile Picture"
        modalClass="max-w-lg"
      >
        <div className="p-6 space-y-6">
          {previewUrl && (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileHeader;

