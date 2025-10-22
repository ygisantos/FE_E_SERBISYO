const getOrdinal = (n) => {
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
};

export const formatDate = () => {
  const date = new Date();
  const day = getOrdinal(date.getDate());
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = date.getFullYear();
  
  return `${day} day of ${month}, ${year}`;
};

const processCheckbox = (value) => {
  return value === 'true' ? '✓' : '';
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

export const SYSTEM_KEYWORDS = {
  'DATE_TODAY': formatDate,
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
  return keyword ? Object.keys(SYSTEM_KEYWORDS).includes(keyword) : false;
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
