import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData, userType) => api.post(`/auth/register/${userType}`, userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllStudents: (params = {}) => api.get('/auth/students', { params }),
  getAllTeachers: (params = {}) => api.get('/auth/teachers', { params }),
  getAllParents: (params = {}) => api.get('/auth/parents', { params }),
};

// Attendance API
export const attendanceAPI = {
  takeAttendance: (data) => api.post('/attendance/take', data),
  getStudentsByClass: (className, section) => api.get(`/attendance/students/${className}/${section}`),
  getStudentAttendance: (studentId, params = {}) => api.get(`/attendance/student/${studentId}`, { params }),
  getAttendanceReport: (params = {}) => api.get('/attendance/report', { params }),
};

// Timetable API
export const timetableAPI = {
  getTimetable: (className, section) => api.get(`/timetable/${className}/${section}`),
  createTimetable: (data) => api.post('/timetable', data),
  getTeacherClasses: () => api.get('/timetable/teacher/classes'),
  getHolidays: (className, section) => api.get(`/timetable/holidays/${className}/${section}`),
};

// Announcement API
export const announcementAPI = {
  getAnnouncements: (params = {}) => api.get('/announcements', { params }),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  markAsRead: (id) => api.put(`/announcements/${id}/read`),
  getAnnouncementStats: (id) => api.get(`/announcements/${id}/stats`),
};

// Admin API
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  createAdmin: (data) => api.post('/admin/create', data),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  bulkCreateStudents: (data) => api.post('/admin/bulk/students', data),
  getSystemSettings: () => api.get('/admin/settings'),
  updateSystemSettings: (data) => api.put('/admin/settings', data),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export default api;