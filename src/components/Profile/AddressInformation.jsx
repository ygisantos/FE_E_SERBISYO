import React from 'react';
import InfoField from './InfoField';

const AddressInformation = ({ profile }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <div className="border-b border-gray-200 px-6 py-4">
      <h3 className="text-lg font-semibold text-gray-900">Address</h3>
    </div>
    
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoField label="Municipality" value={profile.municipality} />
        <InfoField label="Barangay" value={profile.barangay} />
        <InfoField label="House No." value={profile.house_no} />
        <InfoField label="Street" value={profile.street} />
        <InfoField label="Zip Code" value={profile.zip_code} />
      </div>
    </div>
  </div>
);

export default AddressInformation;
 