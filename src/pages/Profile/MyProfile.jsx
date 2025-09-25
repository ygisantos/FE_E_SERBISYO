import React, { useState, useEffect, useRef } from 'react';
import Banner from '../../assets/background/santol_hall.jpg';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import PersonalInformation from '../../components/Profile/PersonalInformation';
import AddressInformation from '../../components/Profile/AddressInformation';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import { getCurrentUser } from '../../api/accountApi';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await getCurrentUser();
        
        setProfile({
          id: userData.id,
          first_name: userData.first_name,
          middle_name: userData.middle_name,
          last_name: userData.last_name,
          suffix: userData.suffix,
          email: userData.email,
          contact_no: userData.contact_no,
          sex: userData.sex,
          nationality: userData.nationality,
          birthday: userData.birthday,
          birth_place: userData.birth_place,
          type: userData.type,
          municipality: userData.municipality,
          barangay: userData.barangay,
          house_no: userData.house_no,
          zip_code: userData.zip_code,
          street: userData.street,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError(error.message || 'Failed to load profile data');
        toast.error(error.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profile) {
      setEditForm({ ...profile });
    }
  }, [profile]);

  const handleProfileUpdate = () => {
    setProfile(editForm);
    setIsEditModalOpen(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error loading profile</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
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
            profile={profile}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
          />
          
          <div className="space-y-6">
            <PersonalInformation 
              profile={profile}
              onEdit={() => setIsEditModalOpen(true)}
            />

            <AddressInformation 
              profile={profile}
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