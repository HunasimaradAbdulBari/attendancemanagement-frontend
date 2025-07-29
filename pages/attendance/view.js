import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI } from '../../services/api';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ProgressBar from '../../components/Common/ProgressBar';

const ViewAttendancePage = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user, selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError('');
      
      let studentId = user.id;
      
      // If user is parent, we need to handle multiple children
      // For now, we'll use the first child or let them select
      if (user.userType === 'parent' && user.children && user.children.length > 0) {
        studentId = user.children[0]._id;
      }

      const response = await attendanceAPI.getStudentAttendance(studentId, {
        month: selectedMonth,
        year: selectedYear
      });

      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const getAttendanceColor = (status) => {
    return status === 'present' ? '#10b981' : '#ef4444';
  };

  const groupAttendanceByDate = (records) => {
    const grouped = {};
    records.forEach(record => {
      const date = new Date(record.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(record);
    });
    return grouped;
  };

  if (loading) {
    return <LoadingSpinner message="Loading attendance data..." />;
  }

  const attendancePercentage = attendanceData?.statistics?.attendancePercentage || 0;
  const isLowAttendance = attendancePercentage < 75;

  return (
    <PrivateRoute allowedRoles={['student', 'parent']}>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="page-header">
            <h2>📊 Attendance Report</h2>
            <p>View detailed attendance records and statistics</p>
          </div>

          <div className="attendance-view-container">
            {/* Filters */}
            <div className="attendance-filters">
              <div className="filter-group">
                <label htmlFor="month">Month</label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="year">Year</label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {attendanceData ? (
              <>
                {/* Statistics Overview */}
                <div className="attendance-overview">
                  <div className="overview-card">
                    <h3>📈 {getMonthName(selectedMonth)} {selectedYear} Summary</h3>
                    <div className="stats-display">
                      <div className="progress-section">
                        <ProgressBar 
                          percentage={Math.round(attendancePercentage)} 
                          size={150}
                          color={isLowAttendance ? '#ef4444' : '#10b981'}
                        />
                      </div>
                      <div className="stats-details">
                        <div className="stat-row">
                          <span className="stat-label">Total Classes:</span>
                          <span className="stat-value">{attendanceData.statistics.totalClasses}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Classes Attended:</span>
                          <span className="stat-value present">{attendanceData.statistics.presentClasses}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Classes Missed:</span>
                          <span className="stat-value absent">{attendanceData.statistics.absentClasses}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Attendance Rate:</span>
                          <span className={`stat-value ${isLowAttendance ? 'warning' : 'good'}`}>
                            {attendancePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {isLowAttendance && (
                      <div className="attendance-warning">
                        ⚠️ Attendance is below the required 75%. Please attend classes regularly.
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Records */}
                <div className="attendance-records">
                  <h3>📋 Detailed Records</h3>
                  
                  {attendanceData.attendance && attendanceData.attendance.length > 0 ? (
                    <div className="records-list">
                      {Object.entries(groupAttendanceByDate(attendanceData.attendance))
                        .sort(([a], [b]) => new Date(b) - new Date(a))
                        .map(([date, records]) => (
                          <div key={date} className="date-group">
                            <h4 className="date-header">
                              {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h4>
                            <div className="records-for-date">
                              {records.map((record) => (
                                <div key={record._id} className="attendance-record">
                                  <div className="record-info">
                                    <span className="subject">{record.subject}</span>
                                    <span className="period">Period {record.period}</span>
                                    <span className="teacher">
                                      {record.teacher?.name || 'N/A'}
                                    </span>
                                  </div>
                                  <div className={`status-badge ${record.status}`}>
                                    {record.status === 'present' ? '✅ Present' : '❌ Absent'}
                                  </div>
                                  {record.remarks && (
                                    <div className="remarks">
                                      Note: {record.remarks}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="no-records">
                      <p>No attendance records found for {getMonthName(selectedMonth)} {selectedYear}.</p>
                    </div>
                  )}
                </div>

                {/* Subject-wise Breakdown */}
                {attendanceData.attendance && attendanceData.attendance.length > 0 && (
                  <div className="subject-breakdown">
                    <h3>📚 Subject-wise Attendance</h3>
                    <div className="subject-stats">
                      {Object.entries(
                        attendanceData.attendance.reduce((acc, record) => {
                          if (!acc[record.subject]) {
                            acc[record.subject] = { present: 0, absent: 0, total: 0 };
                          }
                          acc[record.subject][record.status]++;
                          acc[record.subject].total++;
                          return acc;
                        }, {})
                      ).map(([subject, stats]) => {
                        const percentage = ((stats.present / stats.total) * 100).toFixed(1);
                        return (
                          <div key={subject} className="subject-stat-card">
                            <h4>{subject}</h4>
                            <div className="subject-progress">
                              <ProgressBar 
                                percentage={Math.round(percentage)} 
                                size={80}
                                color={percentage < 75 ? '#ef4444' : '#10b981'}
                              />
                            </div>
                            <div className="subject-details">
                              <span>Present: {stats.present}</span>
                              <span>Absent: {stats.absent}</span>
                              <span>Total: {stats.total}</span>
                              <span className={percentage < 75 ? 'warning' : 'good'}>
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-data">
                <p>No attendance data available for the selected period.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default ViewAttendancePage;