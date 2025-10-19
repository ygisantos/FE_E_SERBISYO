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

export const SYSTEM_KEYWORDS = {
  'DATE_TODAY': formatDate
};

export const isSystemKeyword = (keyword) => {
  return Object.keys(SYSTEM_KEYWORDS).includes(keyword);
};

export const replaceSystemKeywords = (content) => {
  return content.replace(/\${([^}]+)}/g, (match, keyword) => {
    if (isSystemKeyword(keyword)) {
      return SYSTEM_KEYWORDS[keyword]();
    }
    return match;
  });
};
