import React from 'react';
import { FaPhone, FaHome, FaMapMarkerAlt } from 'react-icons/fa';

const ContactAndAddressSection = ({ formData, handleChange, errors, styleClasses }) => {
  return (
    <section className={styleClasses.section}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="contact_no" className={styleClasses.label}>Contact Number *</label>
              <div className="relative">
                <FaPhone className={styleClasses.icon} />
                <input
                  type="tel"
                  id="contact_no"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  className={styleClasses.inputWithIcon}
                  placeholder="09123456789"
                  maxLength="11"
                />
              </div>
              {errors.contact_no && <p className="mt-1 text-sm text-red-500">{errors.contact_no}</p>}
              <p className="text-xs text-gray-500 mt-1">Format: 09XXXXXXXXX (11 digits)</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">Address Information</h2>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="house_no" className={styleClasses.label}>House Number *</label>
                <div className="relative">
                  <FaHome className={styleClasses.icon} />
                  <input
                    type="text"
                    id="house_no"
                    name="house_no"
                    value={formData.house_no}
                    onChange={handleChange}
                    className={styleClasses.inputWithIcon}
                  />
                </div>
                {errors.house_no && <p className="mt-1 text-sm text-red-500">{errors.house_no}</p>}
              </div>

              <div>
                <label htmlFor="street" className={styleClasses.label}>Street *</label>
                <div className="relative">
                  <FaMapMarkerAlt className={styleClasses.icon} />
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className={styleClasses.inputWithIcon}
                  />
                </div>
                {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="barangay" className={styleClasses.label}>Barangay</label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  value={formData.barangay}
                  className={`${styleClasses.input} bg-gray-100`}
                  disabled
                />
              </div>

              <div>
                <label htmlFor="zip_code" className={styleClasses.label}>ZIP Code</label>
                <input
                  type="text"
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  className={`${styleClasses.input} bg-gray-100`}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactAndAddressSection;
