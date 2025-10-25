import React from 'react';

const AdditionalInformationSection = ({ formData, handleChange, styleClasses }) => {
  return (
    <section className={styleClasses.section}>
      <h2 className="text-lg font-medium text-gray-800 mb-3">Additional Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pwd_number"
            name="pwd_number"
            checked={formData.pwd_number === '0000000000'}
            onChange={e => handleChange({
              target: {
                name: 'pwd_number',
                value: e.target.checked ? '0000000000' : ''
              }
            })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="pwd_number" className={styleClasses.label + ' mb-0'}>PWD</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="single_parent_number"
            name="single_parent_number"
            checked={formData.single_parent_number === '0000000000'}
            onChange={e => handleChange({
              target: {
                name: 'single_parent_number',
                value: e.target.checked ? '0000000000' : ''
              }
            })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="single_parent_number" className={styleClasses.label + ' mb-0'}>Single Parent</label>
        </div>
      </div>
    </section>
  );
};

export default AdditionalInformationSection;
