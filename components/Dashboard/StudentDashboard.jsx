import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI, announcementAPI } from '../../services/api';
import AttendanceChart from '../Attendance/AttendanceChart';
import ProgressBar from '../Common/ProgressBar';
import { gsap } from 'gsap';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // GSAP animations
    gsap.fromTo('.dashboard-card', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    );
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, announcementsRes] = await Promise.all([
        attendanceAPI.getStudentAttendance(user.id),
        announcementAPI.getAnnouncements({ limit: 5 })
      ]);
      
      setAttendanceData(attendanceRes.data);
      setAnnouncements(announcementsRes.data.announcements);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="student-dashboard">
      <div className="welcome-section">
        <h2 className="animated-heading">Welcome back, {user.name}!</h2>
        <p>Class: {user.class}-{user.section} | Roll No: {user.rollNumber}</p>
      </div>

      <div className="dashboard-grid">
        {/* Attendance Overview */}
        <div className="dashboard-card attendance-card">
          <h3>📊 Attendance Overview</h3>
          {attendanceData && (
            <div className="attendance-stats">
              <ProgressBar 
                percentage={attendanceData.statistics.attendancePercentage}
                size={120}
                strokeWidth={8}
                color="#10b981"
              />
              <div className="stats-details">
                <div className="stat-item">
                  <span className="stat-value">{attendanceData.statistics.presentClasses}</span>
                  <span className="stat-label">Present</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{attendanceData.statistics.absentClasses}</span>
                  <span className="stat-label">Absent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{attendanceData.statistics.totalClasses}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendance Chart */}
        <div className="dashboard-card chart-card">
          <h3>📈 Attendance Trend</h3>
          {attendanceData && (
            <AttendanceChart data={attendanceData.attendance} />
          )}
        </div>

        {/* Recent Announcements */}
        <div className="dashboard-card announcements-card">
          <h3>📢 Recent Announcements</h3>
          <div className="announcements-list">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement._id} className="announcement-item">
                  <div className="announcement-header">
                    <h4>{announcement.title}</h4>
                    <span className={`priority ${announcement.priority}`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p>{announcement.content.substring(0, 100)}...</p>
                  <small>{new Date(announcement.publishDate).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No announcements available</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions">
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/attendance/view'}
            >
              📊 View Full Attendance
            </button>
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/timetable'}
            >
              📅 View Timetable
            </button>
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/announcements'}
            >
              📢 All Announcements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;