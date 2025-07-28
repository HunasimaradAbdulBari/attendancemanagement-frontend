import { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../../services/api';
import { gsap } from 'gsap';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    
    // GSAP animations
    gsap.fromTo('.admin-card', 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }
    );
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const statsRes = await adminAPI.getDashboardStats();
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="welcome-section">
        <h2 className="animated-heading">Admin Dashboard</h2>
        <p>System Overview & Management</p>
      </div>

      <div className="dashboard-grid">
        {/* System Statistics */}
        <div className="admin-card stats-overview-card">
          <h3>📊 System Overview</h3>
          {stats && (
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-number">{stats.overview.totalStudents}</div>
                <div className="stat-label">Total Students</div>
                <div className="stat-active">({stats.overview.activeStudents} active)</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{stats.overview.totalTeachers}</div>
                <div className="stat-label">Total Teachers</div>
                <div className="stat-active">({stats.overview.activeTeachers} active)</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{stats.overview.totalParents}</div>
                <div className="stat-label">Total Parents</div>
                <div className="stat-active">({stats.overview.activeParents} active)</div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div className="admin-card recent-registrations-card">
          <h3>📈 Recent Registrations (30 days)</h3>
          {stats && (
            <div className="registration-stats">
              <div className="reg-item">
                <span className="reg-count">{stats.recentRegistrations.students}</span>
                <span className="reg-label">New Students</span>
              </div>
              <div className="reg-item">
                <span className="reg-count">{stats.recentRegistrations.teachers}</span>
                <span className="reg-label">New Teachers</span>
              </div>
              <div className="reg-item">
                <span className="reg-count">{stats.recentRegistrations.parents}</span>
                <span className="reg-label">New Parents</span>
              </div>
            </div>
          )}
        </div>

        {/* Class Distribution */}
        <div className="admin-card class-distribution-card">
          <h3>🏫 Class Distribution</h3>
          {stats?.classStats && (
            <div className="class-stats">
              {stats.classStats.map((classItem, index) => (
                <div key={index} className="class-item">
                  <span className="class-name">
                    {classItem._id.class}-{classItem._id.section}
                  </span>
                  <span className="student-count">{classItem.count} students</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Management Actions */}
        <div className="admin-card management-actions-card">
          <h3>⚙️ Management Actions</h3>
          <div className="management-grid">
            <button 
              className="management-btn users"
              onClick={() => window.location.href = '/admin/users'}
            >
              👥 Manage Users
            </button>
            <button 
              className="management-btn students"
              onClick={() => window.location.href = '/admin/students'}
            >
              🎓 Manage Students
            </button>
            <button 
              className="management-btn teachers"
              onClick={() => window.location.href = '/admin/teachers'}
            >
              👨‍🏫 Manage Teachers
            </button>
            <button 
              className="management-btn parents"
              onClick={() => window.location.href = '/admin/parents'}
            >
              👨‍👩‍👧‍👦 Manage Parents
            </button>
            <button 
              className="management-btn timetable"
              onClick={() => window.location.href = '/admin/timetable'}
            >
              📅 Manage Timetables
            </button>
            <button 
              className="management-btn announcements"
              onClick={() => window.location.href = '/announcements'}
            >
              📢 Manage Announcements
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="admin-card system-health-card">
          <h3>🔧 System Health</h3>
          <div className="health-indicators">
            <div className="health-item">
              <div className="health-indicator green"></div>
              <span>Database Connection</span>
            </div>
            <div className="health-item">
              <div className="health-indicator green"></div>
              <span>API Services</span>
            </div>
            <div className="health-item">
              <div className="health-indicator yellow"></div>
              <span>Notification Service</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card recent-activity-card">
          <h3>📝 Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-desc">New teacher registered</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">5 hours ago</span>
              <span className="activity-desc">Attendance taken for Class 10-A</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-desc">New announcement published</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;