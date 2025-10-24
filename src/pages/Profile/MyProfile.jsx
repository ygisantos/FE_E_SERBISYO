import React, { useState, useEffect, useRef } from 'react';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import PersonalInformation from '../../components/Profile/PersonalInformation';
import AddressInformation from '../../components/Profile/AddressInformation';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { updatePassword } from '../../api/accountApi';
import ChangePasswordModal from '../../components/modals/ChangePasswordModal';

const MyProfile = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditForm({ ...currentUser });
    }
  }, [currentUser]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const { getUserById } = await import('../../api/accountApi');
      const updatedUser = await getUserById(currentUser.id);
      setEditForm(updatedUser);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordUpdate = async (passwordData) => {
    try {
      setIsPasswordLoading(true);
      await updatePassword(currentUser.id, passwordData);
      toast.success('Password updated successfully');
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No profile information available.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 transition-all duration-300 ease-in-out">
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader 
            profile={currentUser}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            onEdit={async () => {
              try {
                const { getUserById } = await import('../../api/accountApi');
                const userData = await getUserById(currentUser.id);
                setEditForm(userData);
                setIsEditModalOpen(true);
              } catch (error) {
                toast.error('Failed to load user data');
              }
            }}
          />
          
          <div className="space-y-4 sm:space-y-6">
            <PersonalInformation 
              profile={currentUser}
              onEdit={async () => {
                try {
                  const { getUserById } = await import('../../api/accountApi');
                  const userData = await getUserById(currentUser.id);
                  setEditForm(userData);
                  setIsEditModalOpen(true);
                } catch (error) {
                  toast.error('Failed to load user data');
                }
              }}
            />

            <AddressInformation 
              profile={currentUser}
              onEdit={async () => {
                try {
                  const { getUserById } = await import('../../api/accountApi');
                  const userData = await getUserById(currentUser.id);
                  setEditForm(userData);
                  setIsEditModalOpen(true);
                } catch (error) {
                  toast.error('Failed to load user data');
                }
              }}
            />

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4 sm:gap-0">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-gray-900">Account Security</h2>
                  <p className="text-sm text-gray-500">
                    Protect your account - Update your password regularly and never share it
                  </p>
                  
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-medium cursor-pointer text-red-700 bg-transparent border border-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
                  </svg>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleProfileUpdate}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordUpdate}
        isLoading={isPasswordLoading}
      />
    </div>
  );
};

export default MyProfile;