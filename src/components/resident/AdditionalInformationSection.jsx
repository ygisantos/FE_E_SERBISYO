import React from 'react';

const AdditionalInformationSection = ({ formData, handleChange, styleClasses }) => {
  return (
    <section className={styleClasses.section}>
      <h2 className="text-lg font-medium text-gray-800 mb-3">Additional Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pwd_number" className={styleClasses.label}>PWD Number</label>
          <input
            type="text"
            id="pwd_number"
            name="pwd_number"
            value={formData.pwd_number}
            onChange={handleChange}
            className={styleClasses.input}
            placeholder="Optional"
          />
        </div>

        <div>
          <label htmlFor="single_parent_number" className={styleClasses.label}>Single Parent ID</label>
          <input
            type="text"
            id="single_parent_number"
            name="single_parent_number"
            value={formData.single_parent_number}
            onChange={handleChange}
            className={styleClasses.input}
            placeholder="Optional"
          />
        </div>
      </div>
    </section>
  );
};

export default AdditionalInformationSection;
