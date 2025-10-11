import React from 'react';
import InputField from "../../reusable/InputField";

const AdditionalInformation = ({ form, handleChange, stepErrors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Additional Information</h3>
        <p className="text-gray-600 text-sm mt-2">Optional: Special categories and IDs</p>
      </div>
      
      <div className="space-y-6">
        {/* Voter's ID */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
          <InputField
            name="voters_id"
            value={form.voters_id || ''}
            onChange={handleChange}
            placeholder="Enter Voter's ID (optional)"
            label="Voter's ID"
          />
        </div>

        {/* PWD Section */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="is_pwd"
              name="is_pwd"
              checked={!!form.is_pwd}
              onChange={e => handleChange({ target: { name: 'is_pwd', value: e.target.checked } })}
              className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="is_pwd" className="text-base font-semibold text-gray-800">
              Person with Disability (PWD)
            </label>
          </div>
          {form.is_pwd && (
            <div className="ml-8">
              <InputField
                name="pwd_number"
                value={form.pwd_number || ''}
                onChange={handleChange}
                required
                placeholder="Enter PWD ID Number"
                label="PWD ID Number"
                error={stepErrors.pwd_number}
              />
            </div>
          )}
        </div>

        {/* Single Parent Section */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="is_single_parent"
              name="is_single_parent"
              checked={!!form.is_single_parent}
              onChange={e => handleChange({ target: { name: 'is_single_parent', value: e.target.checked } })}
              className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="is_single_parent" className="text-base font-semibold text-gray-800">
              Single Parent
            </label>
          </div>
          {form.is_single_parent && (
            <div className="ml-8">
              <InputField
                name="single_parent_number"
                value={form.single_parent_number || ''}
                onChange={handleChange}
                required
                placeholder="Enter Single Parent ID Number"
                label="Single Parent ID Number"
                error={stepErrors.single_parent_number}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalInformation;
