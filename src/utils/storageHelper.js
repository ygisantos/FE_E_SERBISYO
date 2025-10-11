const getStorageUrl = (path) => {
  if (!path) return null;

  // Remove any leading slashes
  const cleanPath = path.replace(/^\/+/, '');

  // Check if the path is already a full URL
  if (cleanPath.startsWith('http')) {
    return cleanPath;
  }

  // For development
  if (import.meta.env.DEV) {
    return `${import.meta.env.VITE_API_STORAGE_URL}/${cleanPath}`;
  }

  // For production
  return `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_STORAGE_PATH}${cleanPath}`;
};

export default getStorageUrl;
