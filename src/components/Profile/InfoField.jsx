import React from 'react';

const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <p className="text-gray-900 font-medium">{value || 'N/A'}</p>
  </div>
);

export default InfoField;
