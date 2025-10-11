import React, { useState, useEffect, useRef } from 'react';
import Banner from '../../assets/background/santol_hall.jpg';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import PersonalInformation from '../../components/Profile/PersonalInformation';
import AddressInformation from '../../components/Profile/AddressInformation';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { createActivityLog } from '../../api/activityLogApi';

const MyProfile = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setEditForm({ ...currentUser });
    }
  }, [currentUser]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      await createActivityLog({
        account: currentUser.id,
        module: "Profile",
        remark: "Updated profile information"
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to log profile update:', error);
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
      {/* Banner Section */}
      <div className="relative h-64 -mt-8">
        <img src={Banner} alt="Barangay Hall" className="w-full h-full object-cover brightness-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      </div>

      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader 
            profile={currentUser}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            onEdit={() => setIsEditModalOpen(true)}
          />
          
          <div className="space-y-6">
            <PersonalInformation 
              profile={currentUser}
              onEdit={() => setIsEditModalOpen(true)}
            />

            <AddressInformation 
              profile={currentUser}
              onEdit={() => setIsEditModalOpen(true)}
            />
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
    </div>
  );
};

export default MyProfile;