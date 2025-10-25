import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaSpinner, FaTimes, FaEdit } from 'react-icons/fa';
import { showCustomToast } from '../Toast/CustomToast';
import { updateProfilePicture } from '../../api/accountApi';

const ProfileHeader = ({ profile, onProfileUpdate = () => {}, onEdit }) => {
  const [uploading, setUploading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPhotoOverlay, setShowPhotoOverlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [localProfilePic, setLocalProfilePic] = useState(profile?.profile_picture_path);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // effect to control body scroll
  useEffect(() => {
    if (showPhotoOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPhotoOverlay]);

  // Get initials from name
  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Update local state when profile changes
  useEffect(() => {
    setLocalProfilePic(profile?.profile_picture_path);
  }, [profile]);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setLocalProfilePic(previewUrl);
        setShowProfileMenu(false);

        const formData = new FormData();
        formData.append('profile_picture', file);
        
        const response = await updateProfilePicture(profile.id, formData);
        
        if (response?.profile_picture_path) {
          showCustomToast('Profile picture updated successfully', 'success');
          onProfileUpdate(response.profile_picture_path);
          setLocalProfilePic(response.profile_picture_path);
        }
      } catch (error) {
        // Revert to original profile pic on error
        setLocalProfilePic(profile?.profile_picture_path);
        showCustomToast('Failed to update profile picture', 'error');
      } finally {
        setUploading(false);
      }
    }
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
      <div className="flex flex-col items-center mt-16 mb-8 relative z-10">
        {/* Profile Picture Section */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-lg">
            {uploading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <FaSpinner className="w-8 h-8 text-red-600 animate-spin" />
              </div>
            ) : localProfilePic ? (
              <img 
                src={getProfilePicUrl(localProfilePic)}
                alt={`${profile?.first_name}'s profile`}
                className="w-full h-full object-cover"
                onClick={() => setShowProfileMenu(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-red-900 text-white text-3xl font-semibold">
                {getInitials()}
              </div>
            )}

            {/* Camera Icon Overlay */}
            <div 
              className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
              onClick={() => setShowProfileMenu(true)}
            >
              <FaCamera className="w-6 h-6 text-white/90" />
            </div>
          </div>

          {/* Profile Picture Menu */}
          {showProfileMenu && (
            <div 
              ref={menuRef}
              className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
              >
                <FaCamera className="w-4 h-4 text-gray-400" />
                {profile?.profile_picture_path ? 'Update photo' : 'Upload photo'}
              </button>
              {profile?.profile_picture_path && (
                <button
                  onClick={() => setShowPhotoOverlay(true)}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View photo
                </button>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Name and Edit Button Section */}
        <div className="mt-4 text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {`${profile?.first_name || ''} ${profile?.last_name || ''}`}
          </h2>
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

      {/* Improved Preview Photo Overlay */}
      {showPhotoOverlay && (
        <div 
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm"
          onClick={() => setShowPhotoOverlay(false)}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setShowPhotoOverlay(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaTimes className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="w-full h-full flex items-center justify-center p-4">
            <div 
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={getProfilePicUrl(profile?.profile_picture_path)}
                alt={profile?.first_name}
                className="w-full h-full object-contain rounded-lg select-none"
                draggable="false"
              />
            </div>
          </div>
        </div>
      )}

     </>
  );
};

export default ProfileHeader;

