import React, { useState, useEffect } from 'react';
import FormInput from "./inputfield/FormInput";

const Register = ({ form, handleChange, handleSubmit, isLoading = false, resetSignal }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePreview, setProfilePreview] = useState(null);
  const totalSteps = 5; // Added profile picture step

  // Reset to initial step and clear preview when resetSignal changes
  useEffect(() => {
    setCurrentStep(1);
    setProfilePreview(null);
  }, [resetSignal]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type before updating
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("The profile picture field must be an image (jpeg, jpg, png).");
        handleChange({ target: { name: 'profile_picture', value: null } });
        setProfilePreview(null);
        return;
      }
      // Update form data
      handleChange({ target: { name: 'profile_picture', value: file } });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    if (!form) return false;
    
    switch (step) {
      case 1:
        return form.first_name && form.last_name && form.email && 
               form.password && form.password_confirmation && 
               form.password === form.password_confirmation;
      case 2:
        return form.birthday && form.sex && form.nationality && 
               form.contact_no && form.birth_place;
      case 3:
        return form.municipality && form.barangay && form.house_no && 
               form.street && form.zip_code;
      case 4:
        // Optional step - PWD/Single Parent info
        const pwdOk = !form.is_pwd || (form.is_pwd && form.pwd_number);
        const spOk = !form.is_single_parent || (form.is_single_parent && form.single_parent_number);
        return pwdOk && spOk;
      case 5:
        return true; // Review step - profile picture is optional
      default:
        return false;
    }
  };

  const isStepValid = validateStep(currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
              <p className="text-gray-600 text-sm mt-2">Create your account credentials</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput 
                name="first_name" 
                value={form.first_name || ''} 
                onChange={handleChange} 
                required 
                placeholder="Enter your first name" 
                label="First Name" 
              />
              <FormInput 
                name="last_name" 
                value={form.last_name || ''} 
                onChange={handleChange} 
                required 
                placeholder="Enter your last name" 
                label="Last Name" 
              />
              <FormInput 
                name="middle_name" 
                value={form.middle_name || ''} 
                onChange={handleChange} 
                placeholder="Enter your middle name (optional)" 
                label="Middle Name" 
              />
              <FormInput 
                name="suffix" 
                value={form.suffix || ''} 
                onChange={handleChange} 
                placeholder="Jr, Sr, III, etc. (optional)" 
                label="Suffix" 
              />
              <FormInput 
                name="email" 
                value={form.email || ''} 
                onChange={handleChange} 
                required 
                type="email" 
                placeholder="your.email@example.com" 
                label="Email Address" 
                className="col-span-1 sm:col-span-2" 
              />
              <FormInput 
                name="password" 
                value={form.password || ''} 
                onChange={handleChange} 
                required 
                type="password" 
                placeholder="Enter a strong password" 
                label="Password" 
              />
              <FormInput 
                name="password_confirmation" 
                value={form.password_confirmation || ''} 
                onChange={handleChange} 
                required 
                type="password" 
                placeholder="Confirm your password" 
                label="Confirm Password" 
              />
            </div>
            
            {form.password && form.password_confirmation && form.password !== form.password_confirmation && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                Passwords do not match
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
              <p className="text-gray-600 text-sm mt-2">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput 
                name="birthday" 
                value={form.birthday || ''} 
                onChange={handleChange} 
                required 
                type="date" 
                label="Date of Birth" 
              />
              <FormInput 
                as="select" 
                name="sex" 
                value={form.sex || ''} 
                onChange={handleChange} 
                required 
                label="Sex"
                type="select"
              >
                <option value="">Select Sex</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </FormInput>
              <FormInput 
                name="nationality" 
                value={form.nationality || 'Filipino'} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Filipino" 
                label="Nationality" 
              />
              <FormInput 
                name="contact_no" 
                value={form.contact_no || ''} 
                onChange={handleChange} 
                required 
                placeholder="09XX-XXX-XXXX" 
                label="Contact Number" 
              />
              <FormInput 
                name="birth_place" 
                value={form.birth_place || ''} 
                onChange={handleChange} 
                required 
                placeholder="City/Municipality where you were born" 
                label="Place of Birth" 
                className="col-span-1 sm:col-span-2" 
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Address Information</h3>
              <p className="text-gray-600 text-sm mt-2">Provide your current address details</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput 
                name="municipality" 
                value={form.municipality || ''} 
                onChange={handleChange} 
                required 
                placeholder="City/Municipality" 
                label="City/Municipality" 
              />
              <FormInput 
                name="barangay" 
                value={form.barangay || ''} 
                onChange={handleChange} 
                required 
                placeholder="Barangay name" 
                label="Barangay" 
              />
              <FormInput 
                name="house_no" 
                value={form.house_no || ''} 
                onChange={handleChange} 
                required 
                placeholder="House/Unit Number" 
                label="House/Unit No." 
              />
              <FormInput 
                name="street" 
                value={form.street || ''} 
                onChange={handleChange} 
                required 
                placeholder="Street name" 
                label="Street" 
              />
              <FormInput 
                name="zip_code" 
                value={form.zip_code || ''} 
                onChange={handleChange} 
                required 
                placeholder="4-digit ZIP code" 
                label="ZIP Code" 
              />
              <FormInput 
                as="select" 
                name="type" 
                value={form.type || 'residence'} 
                onChange={handleChange} 
                required 
                label="Address Type"
                type="select"
              >
                <option value="residence">Residence</option>
                <option value="business">Business</option>
                <option value="temporary">Temporary</option>
              </FormInput>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Additional Information</h3>
              <p className="text-gray-600 text-sm mt-2">Optional: Special categories and IDs</p>
            </div>
            
            <div className="space-y-6">
              {/* Voter's ID */}
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <FormInput
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
                    <FormInput
                      name="pwd_number"
                      value={form.pwd_number || ''}
                      onChange={handleChange}
                      required
                      placeholder="Enter PWD ID Number"
                      label="PWD ID Number"
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
                    <FormInput
                      name="single_parent_number"
                      value={form.single_parent_number || ''}
                      onChange={handleChange}
                      required
                      placeholder="Enter Single Parent ID Number"
                      label="Single Parent ID Number"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Review & Submit</h3>
              <p className="text-gray-600 text-sm mt-2">Please review your information before submitting</p>
            </div>

            {/* Profile Picture Upload */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture (Optional)</h4>
                
                {profilePreview ? (
                  <div className="mb-4">
                    <img 
                      src={profilePreview} 
                      alt="Profile Preview" 
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                <input
                  type="file"
                  id="profile_picture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <label
                  htmlFor="profile_picture"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {profilePreview ? 'Change Photo' : 'Upload Photo'}
                </label>
              </div>
            </div>
            
            {/* Review Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-6">Registration Summary</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-600">Full Name:</span>
                    <p className="text-gray-900">{`${form.first_name || ''} ${form.middle_name || ''} ${form.last_name || ''} ${form.suffix || ''}`.trim()}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Email:</span>
                    <p className="text-gray-900">{form.email || ''}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Birthday:</span>
                    <p className="text-gray-900">{form.birthday || ''}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Sex:</span>
                    <p className="text-gray-900">{form.sex === 'M' ? 'Male' : form.sex === 'F' ? 'Female' : ''}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Contact:</span>
                    <p className="text-gray-900">{form.contact_no || ''}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-600">Nationality:</span>
                    <p className="text-gray-900">{form.nationality || ''}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Birth Place:</span>
                    <p className="text-gray-900">{form.birth_place || ''}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Address Type:</span>
                    <p className="text-gray-900 capitalize">{form.type || 'residence'}</p>
                  </div>
                  {form.voters_id && (
                    <div>
                      <span className="font-semibold text-gray-600">Voter's ID:</span>
                      <p className="text-gray-900">{form.voters_id}</p>
                    </div>
                  )}
                  {form.is_pwd && (
                    <div>
                      <span className="font-semibold text-gray-600">PWD ID:</span>
                      <p className="text-gray-900">{form.pwd_number || ''}</p>
                    </div>
                  )}
                  {form.is_single_parent && (
                    <div>
                      <span className="font-semibold text-gray-600">Single Parent ID:</span>
                      <p className="text-gray-900">{form.single_parent_number || ''}</p>
                    </div>
                  )}
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <span className="font-semibold text-gray-600">Complete Address:</span>
                  <p className="text-gray-900">{`${form.house_no || ''} ${form.street || ''}, ${form.barangay || ''}, ${form.municipality || ''} ${form.zip_code || ''}`.trim()}</p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-semibold text-blue-900">Account Creation Process</h3>
                  <div className="mt-2 text-sm text-blue-800">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your registration will be submitted with "pending" status</li>
                      <li>An administrator will review your application</li>
                      <li>You'll receive an email notification once approved</li>
                      <li>Login credentials will be provided after approval</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium text-red-600">{Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm" 
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Step Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className={currentStep >= 1 ? 'text-red-600 font-medium' : ''}>Account</span>
          <span className={currentStep >= 2 ? 'text-red-600 font-medium' : ''}>Personal</span>
          <span className={currentStep >= 3 ? 'text-red-600 font-medium' : ''}>Address</span>
          <span className={currentStep >= 4 ? 'text-red-600 font-medium' : ''}>Additional</span>
          <span className={currentStep >= 5 ? 'text-red-600 font-medium' : ''}>Review</span>
        </div>
      </div>

      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            currentStep === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm'
          }`}
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {currentStep === totalSteps ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isStepValid || isLoading}
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 text-white shadow-lg ${
              isStepValid && !isLoading
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transform hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Registration
                <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-white shadow-lg ${
              isStepValid
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transform hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;