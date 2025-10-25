const getOrdinal = (n) => {
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
};

const tagalogMonths = {
  'January': 'Enero',
  'February': 'Pebrero',
  'March': 'Marso',
  'April': 'Abril',
  'May': 'Mayo',
  'June': 'Hunyo',
  'July': 'Hulyo',
  'August': 'Agosto',
  'September': 'Setyembre',
  'October': 'Oktubre',
  'November': 'Nobyembre',
  'December': 'Disyembre'
};

const formatDateTagalog = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  return `ika-${day} ng ${tagalogMonths[month]}, ${year}`;
};

const validateBirthDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  
  // Check if date is invalid
  if (isNaN(date.getTime())) return false;
  
  // Check if date is in future
  if (date > today) return false;
  
  // Check if person is too old (over 120 years)
  if (age > 120) return false;
  
  return true;
};

const formatBirthdayTagalog = (dateString) => {
  if (!dateString || !validateBirthDate(dateString)) return '';
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  return `ika-${day} ng ${tagalogMonths[month]}, ${year}`;
};

const formatBirthdayEnglish = (dateString) => {
  if (!dateString || !validateBirthDate(dateString)) return '';
  
  const date = new Date(dateString);
  const day = getOrdinal(date.getDate());
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = date.getFullYear();
  
  return `${day} day of ${month}, ${year}`;
};

const formatDate = (format = 'en') => {
  if (format === 'tl') {
    return formatDateTagalog();
  }

  // Original English format
  const date = new Date();
  const day = getOrdinal(date.getDate());
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = date.getFullYear();
  
  return `${day} day of ${month}, ${year}`;
};

// Group checkboxes by category
export const CHECKBOX_GROUPS = {
  ASSISTANCE_TYPE: {
    label: 'Assistance For:',
    checkboxes: {
      'CHECK_MEDICAL': 'Medical',
      'CHECK_FINANCIAL': 'Financial',
      'CHECK_BURIAL': 'Burial',
      'CHECK_EDUCATIONAL': 'Educational'
    }
  },

  PURPOSE: {
    label: 'Purpose:',
    checkboxes: {
      'CHECK_LOCAL': 'Local Employment',
      'CHECK_ABROAD': 'Overseas Employment',
      'CHECK_SCHOOL': 'School Requirement',
      'CHECK_BANK': 'Bank Requirement'
    } 
  },
  
  PERMIT_TYPE: {
    label: 'Type of Permit:',
    checkboxes: {
      'CHECK_BUILDING': 'Building Permit',
      'CHECK_ELECTRICAL': 'Electrical Permit',
      'CHECK_FENCING': 'Fencing Permit',
      'CHECK_BUSINESS': 'Business Permit'
    }
  }
  
};

/**
 * System Keywords for Document Templates:
 * 
 * 1. Date Keywords:
 * ${DATE_TODAY} - Current date in English (e.g., "22nd day of APRIL, 2025")
 * ${DATE_TODAY_TL} - Current date in Tagalog (e.g., "ika-22 ng Abril, 2025")
 * ${DATE} - Format any date in English (e.g., "22nd day of APRIL, 2025")
 * ${DATE_TL} - Format any date in Tagalog (e.g., "ika-22 ng Abril, 2025")
 * 
 * 2. Personal Information:
 * ${SELECT_TITLE} - Title prefix (Mr./Mrs./Ms./Dr.)
 * ${BIRTH_DATE} - Birth date in English (e.g., "22nd day of APRIL, 2020")
 * ${BIRTH_DATE_TL} - Birth date in Tagalog (e.g., "ika-22 ng Abril, 2020")
 * ${AGE} - Age in English (auto-calculated from birth date)
 *         Examples: "four (4) years old" or "one (1) month old"
 * ${AGE_TL} - Age in Tagalog (auto-calculated from birth date)
 *         Examples: "apat (4) taong gulang" or "isang (1) buwang gulang"
 * 
 * 3. Checkbox Groups:
 * 
 * Assistance Type (single selection):
 * ${CHECK_MEDICAL} - "✓" if Medical
 * ${CHECK_FINANCIAL} - "✓" if Financial
 * ${CHECK_BURIAL} - "✓" if Burial
 * ${CHECK_EDUCATIONAL} - "✓" if Educational
 * 
 * Purpose (single selection):
 * ${CHECK_LOCAL} - "✓" if Local Employment
 * ${CHECK_ABROAD} - "✓" if Overseas Employment
 * ${CHECK_SCHOOL} - "✓" if School Requirement
 * ${CHECK_BANK} - "✓" if Bank Requirement
 * 
 * Permit Type (single selection):
 * ${CHECK_BUILDING} - "✓" if Building Permit
 * ${CHECK_ELECTRICAL} - "✓" if Electrical Permit
 * ${CHECK_FENCING} - "✓" if Fencing Permit
 * ${CHECK_BUSINESS} - "✓" if Business Permit
 * 
 * Usage Examples:
 * "To whom it may concern:"
 * "${SELECT_TITLE} Juan Dela Cruz"
 * "Age: ${AGE}"
 * "Birth Date: ${BIRTH_DATE}"
 * "Issued this ${DATE_TODAY}"
 * "Purpose: [${CHECK_LOCAL}] Local [${CHECK_ABROAD}] Abroad"
 * "Permit Type: [${CHECK_BUILDING}] Building [${CHECK_ELECTRICAL}] Electrical"
 */

const tagalogBaseNumbers = {
  1: 'isa', 2: 'dalawa', 3: 'tatlo', 4: 'apat', 
  5: 'lima', 6: 'anim', 7: 'pito', 8: 'walo', 
  9: 'siyam', 10: 'sampu',
  11: 'labing-isa', 12: 'labindalawa', 13: 'labintatlo', 
  14: 'labing-apat', 15: 'labinlima', 16: 'labing-anim',
  17: 'labimpito', 18: 'labingwalo', 19: 'labinsiyam',
  20: 'dalawampu', 30: 'tatlumpu', 40: 'apatnapu',
  50: 'limampu', 60: 'animnapu', 70: 'pitumpu',
  80: 'walumpu', 90: 'siyamnapu', 100: 'isang daan'
};

const getTagalogNumber = (num) => {
  if (tagalogBaseNumbers[num]) return tagalogBaseNumbers[num];
  
  if (num > 20 && num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    if (ones === 0) return tagalogBaseNumbers[tens];
    return `${tagalogBaseNumbers[tens]} at ${tagalogBaseNumbers[ones]}`;
  }
  
  if (num >= 100 && num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredsText = hundreds === 1 ? 'isang daan' : `${tagalogBaseNumbers[hundreds]} daan`;
    if (remainder === 0) return hundredsText;
    return `${hundredsText} at ${getTagalogNumber(remainder)}`;
  }
  
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandsText = thousands === 1 ? 'isang libo' : `${getTagalogNumber(thousands)} libo`;
    if (remainder === 0) return thousandsText;
    return `${thousandsText} at ${getTagalogNumber(remainder)}`;
  }
  
  return num.toString();
};

const englishUnits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const englishTens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const getEnglishNumber = (num) => {
  if (num < 20) return englishUnits[num];
  
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return ones === 0 ? englishTens[tens] : `${englishTens[tens]}-${englishUnits[ones]}`;
  }
  
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredsText = `${englishUnits[hundreds]} hundred`;
    if (remainder === 0) return hundredsText;
    return `${hundredsText} and ${getEnglishNumber(remainder)}`;
  }
  
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandsText = `${getEnglishNumber(thousands)} thousand`;
    if (remainder === 0) return thousandsText;
    return `${thousandsText} ${getEnglishNumber(remainder)}`;
  }
  
  return num.toString();
};

// Use birthday formatting functions for custom dates since they have same logic
const formatCustomDateTagalog = formatBirthdayTagalog;
const formatCustomDateEnglish = formatBirthdayEnglish;

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months += today.getMonth() - birth.getMonth();
  
  // Adjust for day of month
  if (today.getDate() < birth.getDate()) {
    months--;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  return { years, months: remainingMonths, totalMonths: months };
};

const formatAgeTagalog = (value, birthDateValue) => {
  if (birthDateValue) {
    const age = calculateAge(birthDateValue);
    if (age.totalMonths < 12) {
      return `${getTagalogNumber(age.totalMonths)} (${age.totalMonths}) buwang gulang`;
    }
    return `${getTagalogNumber(age.years)} (${age.years}) taong gulang`;
  }
  return '';
};

const formatAgeEnglish = (value, birthDateValue) => {
  if (birthDateValue) {
    const age = calculateAge(birthDateValue);
    if (age.totalMonths < 12) {
      return `${getEnglishNumber(age.totalMonths)} (${age.totalMonths}) ${age.totalMonths === 1 ? 'month' : 'months'} old`;
    }
    return `${getEnglishNumber(age.years)} (${age.years}) ${age.years === 1 ? 'year' : 'years'} old`;
  }
  return '';
};

const TITLE_OPTIONS = [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Dr.', label: 'Dr.' }
];

export const SYSTEM_KEYWORDS = {
  'DATE_TODAY': () => formatDate('en'),
  'DATE_TODAY_TL': () => formatDate('tl'),
  'DATE': (value) => formatCustomDateEnglish(value),
  'DATE_TL': (value) => formatCustomDateTagalog(value),
  'BIRTH_DATE': (value) => formatBirthdayEnglish(value),
  'BIRTH_DATE_TL': (value) => formatBirthdayTagalog(value),
  'AGE': (value, values) => formatAgeEnglish(value, values?.BIRTH_DATE),
  'AGE_TL': (value, values) => formatAgeTagalog(value, values?.BIRTH_DATE),
  'SELECT_TITLE': (value) => value || '',
  // Add checkboxes from groups
  ...Object.values(CHECKBOX_GROUPS).reduce((acc, group) => ({
    ...acc,
    ...Object.keys(group.checkboxes).reduce((checksAcc, key) => ({
      ...checksAcc,
      [key]: (value) => processCheckbox(value)
    }), {})
  }), {})
};

export const isSystemKeyword = (keyword) => {
  return ['DATE_TODAY', 'DATE_TODAY_TL', 'DATE', 'DATE_TL', 'BIRTH_DATE', 'BIRTH_DATE_TL'].includes(keyword);
};

export const replaceSystemKeywords = (content, values = {}) => {
  if (!content) return content;
  
    return content.replace(/\${([^}]+)}/g, (match, keyword) => {
      const fn = SYSTEM_KEYWORDS[keyword];
      if (fn) {
        return fn(values[keyword], values) || '';
      }
      return match;
    });
  }

// Export for use in other components
export { TITLE_OPTIONS };
