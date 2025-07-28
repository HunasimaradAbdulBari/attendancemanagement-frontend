import { format, parseISO, isValid } from 'date-fns';

// Date Utilities
export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : '';
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0; // Sunday
};

// String Utilities
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// Validation Utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Array Utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// Attendance Utilities
export const calculateAttendancePercentage = (presentDays, totalDays) => {
  if (totalDays === 0) return 0;
  return Math.round((presentDays / totalDays) * 100);
};

export const getAttendanceStatus = (percentage) => {
  if (percentage >= 75) return 'good';
  if (percentage >= 50) return 'warning';
  return 'critical';
};

// Local Storage Utilities
// In utils/helpers.js
export const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Local storage set error:', error);
    }
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Local storage get error:', error);
      return defaultValue;
    }
  }
  return defaultValue;
};
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Local storage remove error:', error);
  }
};

// Theme Utilities
export const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

// Error Handling
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Role Utilities
export const hasPermission = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

export const getRoleDisplayName = (role) => {
  const roleNames = {
    student: 'Student',
    teacher: 'Teacher',
    parent: 'Parent',
    admin: 'Administrator'
  };
  return roleNames[role] || role;
};

// File Utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Notification Utilities
export const showNotification = (message, type = 'info', duration = 5000) => {
  // This would typically integrate with a notification system
  console.log(`${type.toUpperCase()}: ${message}`);
};

// URL Utilities
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(([key, value]) => 
    value !== null && value !== undefined && value !== ''
  );
  return new URLSearchParams(filtered).toString();
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (let [key, value] of params) {
    result[key] = value;
  }
  return result;
};
