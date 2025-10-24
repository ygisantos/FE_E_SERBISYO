import React from "react";
import InfoField from "./InfoField";

const PersonalInformation = ({ profile }) => {
  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoField label="First Name" value={profile.first_name} />
          <InfoField label="Middle Name" value={profile.middle_name} />
          <InfoField label="Last Name" value={profile.last_name} />
          <InfoField label="Suffix" value={profile.suffix} />
          <InfoField label="Email Address" value={profile.email} />
          <InfoField label="Contact Number" value={profile.contact_no} />
          <InfoField label="Gender" value={profile.sex} />
          <InfoField label="Nationality" value={profile.nationality} />
          <InfoField label="Birthday" value={profile.birthday} />
          <InfoField label="Age" value={`${calculateAge(profile.birthday)} years old`} />
          <InfoField label="Birth Place" value={profile.birth_place} />
          <InfoField label="User Type" value={profile.type} />
      </div>
    </div>
  </div>
  );
};

export default PersonalInformation;
