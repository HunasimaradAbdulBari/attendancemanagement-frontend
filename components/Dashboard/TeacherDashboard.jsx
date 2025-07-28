import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { timetableAPI, attendanceAPI } from '../../services/api';
import { gsap } from 'gsap';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    
    // GSAP animations with delay to ensure DOM is ready
    setTimeout(() => {
      const cards = document.querySelectorAll('.teacher-card');
      if (cards.length > 0) {
        gsap.fromTo(cards, 
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }
        );
      }
    }, 100);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const classesRes = await timetableAPI.getTeacherClasses();
      
      const assignedClasses = classesRes.data.assignedClasses || [];
      setTeacherClasses(assignedClasses);
      
      // Set today's schedule (first 3 classes as example)
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      setTodaySchedule(assignedClasses.slice(0, 3));
      
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setError('Failed to load dashboard data');
      
      // Set fallback data
      const fallbackClasses = [
        {
          class: '10',
          section: 'A',
          subject: 'Mathematics'
        }
      ];
      setTeacherClasses(fallbackClasses);
      setTodaySchedule(fallbackClasses);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="teacher-dashboard">
      <div className="welcome-section">
        <h2 className="animated-heading">Welcome, {user?.name || 'Teacher'}!</h2>
        <p>Employee ID: {user?.employeeId || 'N/A'}</p>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="dashboard-grid">
        {/* Today's Schedule */}
        <div className="teacher-card schedule-card">
          <h3>📅 Today's Schedule</h3>
          <div className="schedule-list">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((classItem, index) => (
                <div key={`${classItem.class}-${classItem.section}-${index}`} className="schedule-item">
                  <div className="class-info">
                    <span className="class-name">{classItem.class}-{classItem.section}</span>
                    <span className="subject">{classItem.subject}</span>
                  </div>
                  <button 
                    className="take-attendance-btn"
                    onClick={() => window.location.href = `/attendance/take?class=${classItem.class}&section=${classItem.section}&subject=${classItem.subject}`}
                  >
                    ✅ Take Attendance
                  </button>
                </div>
              ))
            ) : (
              <p>No classes scheduled for today</p>
            )}
          </div>
        </div>

        {/* Assigned Classes */}
        <div className="teacher-card classes-card">
          <h3>👥 My Classes</h3>
          <div className="classes-grid">
            {teacherClasses.map((classItem, index) => (
              <div key={`${classItem.class}-${classItem.section}-${classItem.subject}-${index}`} className="class-card">
                <div className="class-header">
                  <h4>{classItem.class}-{classItem.section}</h4>
                  <span className="subject-tag">{classItem.subject}</span>
                </div>
                <div className="class-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => window.location.href = `/attendance/take?class=${classItem.class}&section=${classItem.section}&subject=${classItem.subject}`}
                  >
                    Take Attendance
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => window.location.href = `/attendance/report?class=${classItem.class}&section=${classItem.section}`}
                  >
                    View Reports
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="teacher-card quick-actions-card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions">
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/announcements/create'}
            >
              📝 Create Announcement
            </button>
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/timetable'}
            >
              📅 View Full Timetable
            </button>
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/attendance/report'}
            >
              📊 Attendance Reports
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="teacher-card stats-card">
          <h3>📈 Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{teacherClasses.length}</span>
              <span className="stat-label">Total Classes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user?.subjects?.length || 0}</span>
              <span className="stat-label">Subjects</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{todaySchedule.length}</span>
              <span className="stat-label">Today's Classes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;