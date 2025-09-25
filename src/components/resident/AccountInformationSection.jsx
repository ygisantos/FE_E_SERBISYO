import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const AccountInformationSection = ({ formData, handleChange, errors, inputClasses, labelClasses, iconClasses }) => {
  return (
    <section className="bg-gray-50 p-6 rounded-md border border-gray-200">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Account Information</h2>
      <div className="max-w-md space-y-3">
        <div>
          <label htmlFor="email" className={labelClasses}>Email Address</label>
          <div className="relative">
            <FaEnvelope className={iconClasses} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder="email@example.com"
            />
          </div>
          {errors?.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Note: A temporary password will be generated and sent to the resident's email address.
        </p>
      </div>
    </section>
  );
};

export default AccountInformationSection;
