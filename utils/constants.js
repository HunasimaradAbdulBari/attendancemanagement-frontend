export const USER_TYPES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PARENT: 'parent',
  ADMIN: 'admin'
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    REGISTER_STUDENT: '/auth/register/student',
    REGISTER_TEACHER: '/auth/register/teacher',
    REGISTER_PARENT: '/auth/register/parent'
  },
  ATTENDANCE: {
    TAKE: '/attendance/take',
    STUDENT: '/attendance/student',
    REPORT: '/attendance/report'
  },
  ANNOUNCEMENTS: {
    BASE: '/announcements',
    READ: (id) => `/announcements/${id}/read`
  },
  TIMETABLE: {
    BASE: '/timetable',
    TEACHER_CLASSES: '/timetable/teacher/classes'
  }
};

// Time Periods
export const PERIODS = Array.from({ length: 8 }, (_, i) => ({
  number: i + 1,
  label: `Period ${i + 1}`
}));

// Days of Week
export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Classes and Sections
export const CLASSES = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

export const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

// Subjects (Common)
export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
  'Hindi', 'History', 'Geography', 'Computer Science', 'Physical Education'
];

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  LONG: 'EEEE, MMMM do, yyyy'
};

// Validation Rules
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  ROLL_NUMBER: /^[A-Z0-9]{6,12}$/,
  EMPLOYEE_ID: /^[A-Z0-9]{4,10}$/
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};