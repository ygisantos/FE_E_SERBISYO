import React from "react";
import { FaEdit } from "react-icons/fa";
import InfoField from "./InfoField";

const PersonalInformation = ({ profile, onEdit }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
        <button
          onClick={onEdit}
          className="text-gray-500 hover:text-orange-500 transition-colors flex items-center space-x-1"
        >
          <span className="text-sm font-medium">Edit</span>
          <FaEdit className="w-3 h-3" />
        </button>
      </div>
    </div>

    <div className="px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoField label="First Name" value={profile.first_name} />
        <InfoField label="Middle Name" value={profile.middle_name} />
        <InfoField label="Last Name" value={profile.last_name} />
        <InfoField label="Suffix" value={profile.suffix} />
        <InfoField label="Email Address" value={profile.email} />
        <InfoField label="Contact Number" value={profile.contact_no} />
        <InfoField label="Sex" value={profile.sex} />
        <InfoField label="Nationality" value={profile.nationality} />
        <InfoField label="Birthday" value={profile.birthday} />
        <InfoField label="Birth Place" value={profile.birth_place} />
        <InfoField label="User Type" value={profile.type} />
      </div>
    </div>
  </div>
);

export default PersonalInformation;
