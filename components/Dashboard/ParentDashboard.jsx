import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI, announcementAPI } from '../../services/api';
import AttendanceChart from '../Attendance/AttendanceChart';
import ProgressBar from '../Common/ProgressBar';
import { gsap } from 'gsap';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // GSAP animations
    gsap.fromTo('.parent-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildAttendance(selectedChild._id);
    }
  }, [selectedChild]);

  const fetchData = async () => {
    try {
      // Get parent profile with children
      const profileRes = await authAPI.getProfile();
      const childrenData = profileRes.data.user.children;
      setChildren(childrenData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }

      // Get announcements
      const announcementsRes = await announcementAPI.getAnnouncements({ limit: 5 });
      setAnnouncements(announcementsRes.data.announcements);
      
    } catch (error) {
      console.error('Error fetching parent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildAttendance = async (childId) => {
    try {
      const attendanceRes = await attendanceAPI.getStudentAttendance(childId);
      setAttendanceData(attendanceRes.data);
    } catch (error) {
      console.error('Error fetching child attendance:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="parent-dashboard">
      <div className="welcome-section">
        <h2 className="animated-heading">Welcome, {user.name}!</h2>
        <p>Parent Dashboard</p>
      </div>

      {/* Child Selection */}
      {children.length > 1 && (
        <div className="child-selector">
          <h3>Select Child:</h3>
          <div className="child-tabs">
            {children.map((child) => (
              <button
                key={child._id}
                className={`child-tab ${selectedChild?._id === child._id ? 'active' : ''}`}
                onClick={() => setSelectedChild(child)}
              >
                {child.name} ({child.class}-{child.section})
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChild && (
        <div className="dashboard-grid">
          {/* Child Info */}
          <div className="parent-card child-info-card">
            <h3>👨‍👩‍👧‍👦 Child Information</h3>
            <div className="child-details">
              <div className="child-avatar">
                {selectedChild.name.charAt(0).toUpperCase()}
              </div>
              <div className="child-info">
                <h4>{selectedChild.name}</h4>
                <p>Class: {selectedChild.class}-{selectedChild.section}</p>
                <p>Roll No: {selectedChild.rollNumber}</p>
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="parent-card attendance-card">
            <h3>📊 Attendance Overview</h3>
            {attendanceData && (
              <div className="attendance-stats">
                <ProgressBar 
                  percentage={attendanceData.statistics.attendancePercentage}
                  size={120}
                  strokeWidth={8}
                  color={attendanceData.statistics.attendancePercentage >= 75 ? '#10b981' : '#ef4444'}
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
                
                {attendanceData.statistics.attendancePercentage < 75 && (
                  <div className="attendance-warning">
                    ⚠️ Attendance below 75% requirement!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Attendance Chart */}
          <div className="parent-card chart-card">
            <h3>📈 Attendance Trend</h3>
            {attendanceData && (
              <AttendanceChart data={attendanceData.attendance} />
            )}
          </div>

          {/* Recent Absences */}
          <div className="parent-card absences-card">
            <h3>🚨 Recent Absences</h3>
            <div className="absences-list">
              {attendanceData?.attendance
                .filter(record => record.status === 'absent')
                .slice(0, 5)
                .map((record, index) => (
                  <div key={index} className="absence-item">
                    <div className="absence-date">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div className="absence-subject">{record.subject}</div>
                    <div className="absence-period">Period {record.period}</div>
                  </div>
                )) || <p>No recent absences</p>}
            </div>
          </div>

          {/* Announcements */}
          <div className="parent-card announcements-card">
            <h3>📢 School Announcements</h3>
            <div className="announcements-list">
              {announcements.length > 0 ? (
                announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement._id} className="announcement-item">
                    <div className="announcement-header">
                      <h4>{announcement.title}</h4>
                      <span className={`priority ${announcement.priority}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p>{announcement.content.substring(0, 80)}...</p>
                    <small>{new Date(announcement.publishDate).toLocaleDateString()}</small>
                  </div>
                ))
              ) : (
                <p>No announcements available</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="parent-card quick-actions-card">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button 
                className="action-btn"
                onClick={() => window.location.href = `/attendance/view?studentId=${selectedChild._id}`}
              >
                📊 Full Attendance Report
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
      )}

      {children.length === 0 && (
        <div className="no-children">
          <p>No children registered under this parent account.</p>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;