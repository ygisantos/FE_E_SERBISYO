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

export const formatDate = (format = 'en') => {
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

const processCheckbox = (value) => {
  return value === '✓' ? '✓' : '';
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
  }
};

/**
 * System Keywords for Document Templates:
 * 
 * Date Keywords:
 * ${DATE_TODAY} - Outputs current date in English (e.g., "22nd day of APRIL, 2025")
 * ${DATE_TODAY_TL} - Outputs current date in Tagalog (e.g., "ika-22 ng Abril, 2025")
 * 
 * Checkbox Groups:
 * 
 * 1. Assistance Type (only one can be selected):
 * ${CHECK_MEDICAL} - Outputs "✓" if checked, empty if not
 * ${CHECK_FINANCIAL} - Outputs "✓" if checked, empty if not
 * ${CHECK_BURIAL} - Outputs "✓" if checked, empty if not
 * ${CHECK_EDUCATIONAL} - Outputs "✓" if checked, empty if not
 * 
 * 2. Purpose (only one can be selected):
 * ${CHECK_LOCAL} - Outputs "✓" if checked, empty if not
 * ${CHECK_ABROAD} - Outputs "✓" if checked, empty if not
 * ${CHECK_SCHOOL} - Outputs "✓" if checked, empty if not
 * ${CHECK_BANK} - Outputs "✓" if checked, empty if not
 * 
 * Usage Examples in Templates:
 * 
 * 1. Dates:
 * "Ipinagkaloob ngayong ${DATE_TODAY_TL}"
 * "Issued this ${DATE_TODAY}"
 * 
 * 2. Checkboxes:
 * "Purpose: [${CHECK_LOCAL}] Local Employment [${CHECK_ABROAD}] Overseas"
 * "Type: [${CHECK_MEDICAL}] Medical [${CHECK_FINANCIAL}] Financial"
 */

export const SYSTEM_KEYWORDS = {
  'DATE_TODAY': () => formatDate('en'),
  'DATE_TODAY_TL': () => formatDate('tl'),
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
  return keyword === 'DATE_TODAY' || keyword === 'DATE_TODAY_TL';
};

export const replaceSystemKeywords = (content, values = {}) => {
  if (!content) return content;
  
  return content.replace(/\${([^}]+)}/g, (match, keyword) => {
    const fn = SYSTEM_KEYWORDS[keyword];
    if (fn) {
      return fn(values[keyword]);
    }
    return values[keyword] || match;
  });
};
