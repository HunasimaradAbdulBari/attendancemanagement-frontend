import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor: attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllStudents: () => api.get('/auth/students'),
  getAllTeachers: () => api.get('/auth/teachers'),
  getAllParents: () => api.get('/auth/parents'),
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerTeacher: (data) => api.post('/auth/register/teacher', data),
  registerParent: (data) => api.post('/auth/register/parent', data),
};

// ✅ Attendance API calls
export const attendanceAPI = {
  takeAttendance: (data) => api.post('/attendance/take', data),
  getStudentsByClass: (className, section) => 
    api.get(`/attendance/students/${className}/${section}`),
  getStudentAttendance: (studentId, params = {}) => 
    api.get(`/attendance/student/${studentId}`, { params }),
  getAttendanceReport: (params) => 
    api.get('/attendance/report', { params }),
};

// ✅ Timetable API calls
export const timetableAPI = {
  getTimetable: (className, section) => 
    api.get(`/timetable/${className}/${section}`),
  createTimetable: (data) => api.post('/timetable', data),
  getTeacherClasses: () => {
    return api.get('/timetable/teacher/classes').catch(error => {
      console.warn('Teacher classes API not available, using fallback');
      return {
        data: {
          assignedClasses: [
            { class: '10', section: 'A', subject: 'Mathematics', teacher: 'Current User' },
            { class: '10', section: 'B', subject: 'Physics', teacher: 'Current User' }
          ]
        }
      };
    });
  },
  getHolidays: (className, section) => 
    api.get(`/timetable/holidays/${className}/${section}`).catch(() => ({
      data: { holidays: [] }
    })),
};

// ✅ Announcement API calls
export const announcementAPI = {
  getAnnouncements: (params) => api.get('/announcements', { params }),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  markAsRead: (id) => api.put(`/announcements/${id}/read`),
  getAnnouncementStats: (id) => api.get(`/announcements/${id}/stats`),
};

// ✅ Admin API calls
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  getDashboardStats: () => api.get('/admin/dashboard/stats').catch(() => ({
    data: {
      stats: {
        overview: {
          totalStudents: 0,
          activeStudents: 0,
          totalTeachers: 0,
          activeTeachers: 0,
          totalParents: 0,
          activeParents: 0
        },
        recentRegistrations: {
          students: 0,
          teachers: 0,
          parents: 0
        },
        classStats: []
      }
    }
  })),
  bulkCreateStudents: (data) => api.post('/admin/bulk/students', data),
  getSystemSettings: () => api.get('/admin/settings'),
  updateSystemSettings: (data) => api.put('/admin/settings', data),
};
