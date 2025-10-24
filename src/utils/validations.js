// Regular expressions for different validation patterns
const patterns = {
  // Name validation - letters, spaces, and common special characters, including ñ and accented characters
  name: /^[a-zA-ZÀ-ÿñÑ\s'-]{2,50}$/,
  
  // Middle name validation (optional, can be initial)
  middleName: /^[a-zA-ZÀ-ÿñÑ\s'-]{0,50}$/,
  
  // Suffix validation (optional, common name suffixes)
  suffix: /^(Sr\.|Jr\.|I|II|III|IV|V|VI)?$/,
  
  // Email validation (more comprehensive)
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Phone number validation (PH format, includes landline)
  phoneNumber: /^(09|\+639)\d{9}$|^([0-9]{3,4}[-\s]?[0-9]{4})$/,
  
  // Password validation (minimum 8 characters, at least one uppercase, one lowercase, one number, one special character)
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  
  // Postal code (ZIP) validation (4 digits for PH)
  zipCode: /^\d{4}$/,
  
  // Enhanced street address validation (includes #, - , / and other common address characters)
  streetAddress: /^[a-zA-Z0-9\s,.\-\/#']{3,100}$/,
  
  // Date validation (YYYY-MM-DD with leap year consideration)
  date: /^(?:19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  
  // Age validation (number between 0-150)
  age: /^(?:1[0-4][0-9]|[1-9][0-9]|[0-9])$/,
  
  // Sex/Gender validation
  sex: /^[MF]$|^(Male|Female)$/,
  
  // Nationality validation (letters, spaces, and hyphens)
  nationality: /^[a-zA-Z\s-]{2,50}$/,
  
  // House number validation
  houseNumber: /^[0-9a-zA-Z\-\/\s,]{1,20}$/,
  
  // Municipality/City validation
  municipality: /^[a-zA-ZÀ-ÿñÑ\s.-]{2,100}$/,
  
  // Birth place validation
  birthPlace: /^[a-zA-ZÀ-ÿñÑ\s,.-]{2,100}$/,
  
  // Image file validation
  imageFile: /\.(jpg|jpeg|png|gif)$/i,
  
  // Add barangay pattern
  barangay: /^[a-zA-ZÀ-ÿñÑ\s.-]{2,100}$/,
};

// Validation functions
const validators = {
  // Name validation (first name, last name)
  validateName: (name, fieldName = 'Name') => {
    if (!name) return `${fieldName} is required`;
    if (!patterns.name.test(name)) return `${fieldName} can only contain letters, spaces, and characters like - '`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters`;
    if (name.length > 50) return `${fieldName} must not exceed 50 characters`;
    return '';
  },

  // Middle name validation (optional)
  validateMiddleName: (middleName) => {
    if (!middleName) return ''; // Optional field
    if (!patterns.middleName.test(middleName)) return 'Middle name can only contain letters, spaces, and characters like - \'';
    if (middleName.length > 50) return 'Middle name must not exceed 50 characters';
    return '';
  },

  // Suffix validation
  validateSuffix: (suffix) => {
    if (!suffix) return ''; // Optional field
    if (!patterns.suffix.test(suffix)) return 'Invalid suffix format (e.g., Jr., Sr., III)';
    return '';
  },

  // Email validation
  validateEmail: (email) => {
    if (!email) return 'Email is required';
    if (!patterns.email.test(email)) return 'Invalid email format (e.g., example@domain.com)';
    return '';
  },

  // Phone number validation
  validatePhone: (phone) => {
    if (!phone) return 'Phone number is required';
    if (!patterns.phoneNumber.test(phone)) return 'Invalid phone number format (e.g., 09123456789, +639123456789, or 8123-4567)';
    return '';
  },

  // Sex/Gender validation
  validateSex: (sex) => {
    if (!sex) return 'Gender is required';
    const value = typeof sex === 'object' ? sex.value : sex;
    // Normalize the value to M/F format
    const normalizedValue = value === 'Male' ? 'M' : value === 'Female' ? 'F' : value;
    if (!patterns.sex.test(value)) return 'Please select a valid gender';
    return '';
  },

  // Nationality validation
  validateNationality: (nationality) => {
    if (!nationality) return 'Nationality is required';
    if (!patterns.nationality.test(nationality)) return 'Invalid nationality format';
    return '';
  },

  // Birth place validation
  validateBirthPlace: (birthPlace) => {
    if (!birthPlace) return 'Birth place is required';
    if (!patterns.birthPlace.test(birthPlace)) return 'Invalid birth place format';
    return '';
  },

  // Date validation with age restriction
  validateBirthday: (date) => {
    if (!date) return 'Date is required';
    if (!patterns.date.test(date)) return 'Invalid date format (YYYY-MM-DD)';
    
    try {
      const birthDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 0) return 'Birth date cannot be in the future';
      if (age < 13) return 'Resident must be at least 13 years old';
      if (age > 150) return 'Invalid birth date';
      return '';
    } catch (error) {
      return 'Invalid date format';
    }
  },

  // House number validation
  validateHouseNumber: (houseNo) => {
    if (!houseNo) return 'House number is required';
    if (!patterns.houseNumber.test(houseNo)) return 'Invalid house number format';
    if (houseNo.length > 20) return 'House number is too long';
    return '';
  },

  // Municipality validation
  validateMunicipality: (municipality) => {
    if (!municipality) return 'Municipality is required';
    if (!patterns.municipality.test(municipality)) return 'Invalid municipality format';
    if (municipality.length < 2) return 'Municipality name is too short';
    if (municipality.length > 100) return 'Municipality name is too long';
    return '';
  },

  // Street validation
  validateStreet: (street) => {
    if (!street) return 'Street is required';
    if (!patterns.streetAddress.test(street)) return 'Invalid street address format';
    if (street.length < 3) return 'Street address is too short';
    if (street.length > 100) return 'Street address is too long';
    return '';
  },

  // ZIP code validation
  validateZipCode: (zipCode) => {
    if (!zipCode) return 'ZIP code is required';
    if (!patterns.zipCode.test(zipCode)) return 'Invalid ZIP code format (must be 4 digits)';
    return '';
  },

  // Image file validation
  validateImageFile: (file) => {
    if (!file) return '';  // Optional field
    if (!patterns.imageFile.test(file.name)) return 'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed';
    if (file.size > 5 * 1024 * 1024) return 'File size must be less than 5MB';
    return '';
  },

  // Password validation
  validatePassword: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!patterns.password.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  },

  // Confirm password validation
  validateConfirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  },

  // Age validation (must be at least 18 years old)
  validateAge: (inputDate) => {
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    if (age < 18) return 'Must be at least 18 years old';
    return '';
  },

  // Address validation
  validateAddress: {
    street: (street) => {
      if (!street) return 'Street address is required';
      if (!patterns.streetAddress.test(street)) return 'Invalid street address format';
      return '';
    },
    zipCode: (zipCode) => {
      if (!zipCode) return 'ZIP code is required';
      if (!patterns.zipCode.test(zipCode)) return 'Invalid ZIP code format (4 digits)';
      return '';
    }
  },

  // Required field validation
  validateRequired: (value, fieldName) => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return '';
  },

  // Add barangay validation
  validateBarangay: (barangay) => {
    if (!barangay) return 'Barangay is required';
    if (!patterns.barangay.test(barangay)) return 'Invalid barangay name format';
    if (barangay.length < 2) return 'Barangay name is too short';
    if (barangay.length > 100) return 'Barangay name is too long';
    return '';
  },
};

// Form validation function
export const validateForm = (form) => {
  const errors = {};
  let isValid = true;

  // Personal Information
  if ('first_name' in form) {
    const error = validators.validateName(form.first_name, 'First name');
    if (error) {
      errors.first_name = error;
      isValid = false;
    }
  }

  if ('middle_name' in form) {
    const error = validators.validateMiddleName(form.middle_name);
    if (error) {
      errors.middle_name = error;
      isValid = false;
    }
  }

  if ('last_name' in form) {
    const error = validators.validateName(form.last_name, 'Last name');
    if (error) {
      errors.last_name = error;
      isValid = false;
    }
  }

  if ('suffix' in form) {
    const error = validators.validateSuffix(form.suffix);
    if (error) {
      errors.suffix = error;
      isValid = false;
    }
  }

  if ('email' in form) {
    const error = validators.validateEmail(form.email);
    if (error) {
      errors.email = error;
      isValid = false;
    }
  }

  if ('contact_no' in form) {
    const error = validators.validatePhone(form.contact_no);
    if (error) {
      errors.contact_no = error;
      isValid = false;
    }
  }

  if ('sex' in form) {
    const error = validators.validateSex(form.sex);
    if (error && form.sex !== '') { // Only show error if field is not empty
      errors.sex = error;
      isValid = false;
    }
  }

  if ('nationality' in form) {
    const error = validators.validateNationality(form.nationality);
    if (error) {
      errors.nationality = error;
      isValid = false;
    }
  }

  if ('birthday' in form) {
    const error = validators.validateBirthday(form.birthday);
    if (error) {
      errors.birthday = error;
      isValid = false;
    }
  }

  if ('birth_place' in form) {
    const error = validators.validateBirthPlace(form.birth_place);
    if (error) {
      errors.birth_place = error;
      isValid = false;
    }
  }

  // Address Information
  if ('house_no' in form) {
    const error = validators.validateHouseNumber(form.house_no);
    if (error) {
      errors.house_no = error;
      isValid = false;
    }
  }

  if ('street' in form) {
    const error = validators.validateStreet(form.street);
    if (error) {
      errors.street = error;
      isValid = false;
    }
  }

  if ('barangay' in form) {
    const error = validators.validateBarangay(form.barangay);
    if (error) {
      errors.barangay = error;
      isValid = false;
    }
  }

  if ('municipality' in form) {
    const error = validators.validateMunicipality(form.municipality);
    if (error) {
      errors.municipality = error;
      isValid = false;
    }
  }

  if ('zip_code' in form) {
    const error = validators.validateZipCode(form.zip_code);
    if (error) {
      errors.zip_code = error;
      isValid = false;
    }
  }

//   // Account type validation
//   if ('type' in form) {
//     const error = validators.validateAccountType(form.type);
//     if (error) {
//       errors.type = error;
//       isValid = false;
//     }
//   }

  // Password validation (for registration/password change)
  if ('password' in form) {
    const error = validators.validatePassword(form.password);
    if (error) {
      errors.password = error;
      isValid = false;
    }
  }

  if ('password_confirmation' in form) {
    const error = validators.validateConfirmPassword(
      form.password,
      form.password_confirmation
    );
    if (error) {
      errors.password_confirmation = error;
      isValid = false;
    }
  }

  // Profile image validation
  if ('profile_picture' in form) {
    const error = validators.validateImageFile(form.profile_picture);
    if (error) {
      errors.profile_picture = error;
      isValid = false;
    }
  }

  return {
    isValid,
    errors
  };
};

export default validators;