import React, { useState, useEffect, useCallback } from 'react';
import AccountInformation from './registration/Steps/AccountInformation';
import PersonalInformation from './registration/Steps/PersonalInformation';
import AddressInformation from './registration/Steps/AddressInformation';
import AdditionalInformation from './registration/Steps/AdditionalInformation';
import ProofOfIdentity from './registration/Steps/ProofOfIdentity';
import ReviewSubmit from './registration/Steps/ReviewSubmit';
import RegistrationProgress from './registration/RegistrationProgress';
import NavigationButtons from './registration/NavigationButtons';
import { showCustomToast } from './Toast/CustomToast';
import validators from '../utils/validations';

const Register = ({ form, handleChange, handleSubmit, isLoading = false, resetSignal }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePreview, setProfilePreview] = useState(null);
  const [idFrontPreview, setIdFrontPreview] = useState(null);
  const [idBackPreview, setIdBackPreview] = useState(null);
  const [selfieWithIdPreview, setSelfieWithIdPreview] = useState(null);
  const totalSteps = 6; // Added proof of identity step

  // Add state for step errors
  const [stepErrors, setStepErrors] = useState({});

  // Reset to initial step and clear preview when resetSignal changes
  useEffect(() => {
    setCurrentStep(1);
    setProfilePreview(null);
    setIdFrontPreview(null);
    setIdBackPreview(null);
    setSelfieWithIdPreview(null);
  }, [resetSignal]);

  // Memoize validateStep to prevent unnecessary recalculations
  const validateStep = useCallback((step) => {
    const errors = {};
    
    switch (step) {
      case 1: // Account Information
        const firstNameError = validators.validateName(form.first_name, 'First name');
        const lastNameError = validators.validateName(form.last_name, 'Last name');
        const emailError = validators.validateEmail(form.email);
        const passwordError = validators.validatePassword(form.password);
        const confirmPasswordError = validators.validateConfirmPassword(form.password, form.password_confirmation);

        if (firstNameError) errors.first_name = firstNameError;
        if (lastNameError) errors.last_name = lastNameError;
        if (emailError) errors.email = emailError;
        if (passwordError) errors.password = passwordError;
        if (confirmPasswordError) errors.password_confirmation = confirmPasswordError;
        break;

      case 2: // Personal Information
        const birthdayError = validators.validateBirthday(form.birthday);
        const sexError = validators.validateSex(form.sex);
        const nationalityError = validators.validateNationality(form.nationality);
        const contactError = validators.validatePhone(form.contact_no);
        const birthPlaceError = validators.validateBirthPlace(form.birth_place);

        if (birthdayError) errors.birthday = birthdayError;
        if (sexError) errors.sex = sexError;
        if (nationalityError) errors.nationality = nationalityError;
        if (contactError) errors.contact_no = contactError;
        if (birthPlaceError) errors.birth_place = birthPlaceError;
        break;

      case 3: // Address Information
        const houseNoError = validators.validateHouseNumber(form.house_no);
        const streetError = validators.validateStreet(form.street);
        const barangayError = validators.validateBarangay(form.barangay);
        const municipalityError = validators.validateMunicipality(form.municipality);
        const zipCodeError = validators.validateZipCode(form.zip_code);

        if (houseNoError) errors.house_no = houseNoError;
        if (streetError) errors.street = streetError;
        if (barangayError) errors.barangay = barangayError;
        if (municipalityError) errors.municipality = municipalityError;
        if (zipCodeError) errors.zip_code = zipCodeError;
        break;

      case 4: // Additional Information
        if (form.is_pwd && !form.pwd_number?.trim()) {
          errors.pwd_number = 'PWD ID number is required when PWD is selected';
        }
        if (form.is_single_parent && !form.single_parent_number?.trim()) {
          errors.single_parent_number = 'Single Parent ID number is required when Single Parent is selected';
        }
        break;

      case 5: // Proof of Identity
        if (!form.id_front) errors.id_front = 'Front of ID is required';
        if (!form.id_back) errors.id_back = 'Back of ID is required';
        if (!form.selfie_with_id) errors.selfie_with_id = 'Selfie with ID is required';
        break;

      default:
        break;
    }

    return errors;
  }, [form]); // Only recreate when form changes

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length === 0) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setStepErrors(errors); // Only set errors when moving to next step
      // Show error toast with the first error message
      const firstError = Object.values(errors)[0];
      showCustomToast(firstError, 'error');
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("Please upload a valid image file (jpeg, jpg, png)");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        switch(type) {
          case 'id_front':
            setIdFrontPreview(e.target.result);
            handleChange({ target: { name: 'id_front', value: file } });
            break;
          case 'id_back':
            setIdBackPreview(e.target.result);
            handleChange({ target: { name: 'id_back', value: file } });
            break;
          case 'selfie_with_id':
            setSelfieWithIdPreview(e.target.result);
            handleChange({ target: { name: 'selfie_with_id', value: file } });
            break;
          default:
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFieldError = (fieldName) => {
    if (stepErrors[fieldName]) {
      return (
        <p className="mt-1 text-sm text-red-600">
          {stepErrors[fieldName]}
        </p>
      );
    }
    return null;
  };

  const renderStep = () => {
    const commonProps = { form, handleChange, stepErrors };
    
    switch (currentStep) {
      case 1:
        return <AccountInformation {...commonProps} />;
      case 2:
        return <PersonalInformation {...commonProps} />;
      case 3:
        return <AddressInformation {...commonProps} />;
      case 4:
        return <AdditionalInformation {...commonProps} />;
      case 5:
        return <ProofOfIdentity 
          {...commonProps}
          handleFileChange={handleFileChange}
          previews={{ idFront: idFrontPreview, idBack: idBackPreview, selfieWithId: selfieWithIdPreview }}
        />;
      case 6:
        return <ReviewSubmit 
          {...commonProps}
          handleProfilePictureChange={handleProfilePictureChange}
          profilePreview={profilePreview}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <RegistrationProgress currentStep={currentStep} totalSteps={totalSteps} />
      
      {renderStep()}

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isValid={Object.keys(validateStep(currentStep)).length === 0}
      />
    </div>
  );
};

export default Register;