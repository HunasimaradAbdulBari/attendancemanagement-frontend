import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI } from '../../services/api';
import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import AttendanceChart from '../../components/Attendance/AttendanceChart';
import ProgressBar from '../../components/Common/ProgressBar';

export default function ViewAttendancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const studentId = router.query.studentId || user?.id;

  useEffect(() => {
    if (studentId) {
      fetchAttendanceData();
    }
  }, [studentId, selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    try {
      const response = await attendanceAPI.getStudentAttendance(studentId, {
        month: selectedMonth,
        year: selectedYear
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <PrivateRoute allowedRoles={['student', 'parent']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="attendance-view">
            <div className="page-header">
              <h2>📊 Attendance Report</h2>
              
              {/* Month/Year Selector */}
              <div className="date-filters">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
                
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={2024 - i} value={2024 - i}>
                      {2024 - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {attendanceData && (
              <div className="attendance-content">
                {/* Statistics Overview */}
                <div className="attendance-stats-section">
                  <div className="stats-card">
                    <h3>📈 Overall Statistics</h3>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <ProgressBar 
                          percentage={attendanceData.statistics.attendancePercentage}
                          size={120}
                          strokeWidth={8}
                          color={attendanceData.statistics.attendancePercentage >= 75 ? '#10b981' : '#ef4444'}
                        />
                      </div>
                      <div className="stat-details">
                        <div className="stat-row">
                          <span className="stat-label">Total Classes:</span>
                          <span className="stat-value">{attendanceData.statistics.totalClasses}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Present:</span>
                          <span className="stat-value present">{attendanceData.statistics.presentClasses}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Absent:</span>
                          <span className="stat-value absent">{attendanceData.statistics.absentClasses}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Percentage:</span>
                          <span className={`stat-value ${attendanceData.statistics.attendancePercentage >= 75 ? 'good' : 'warning'}`}>
                            {attendanceData.statistics.attendancePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {attendanceData.statistics.attendancePercentage < 75 && (
                      <div className="attendance-warning">
                        ⚠️ Attendance is below the required 75%!
                      </div>
                    )}
                  </div>

                  {/* Attendance Chart */}
                  <div className="chart-card">
                    <AttendanceChart data={attendanceData.attendance} />
                  </div>
                </div>

                {/* Detailed Records */}
                <div className="attendance-records">
                  <h3>📋 Detailed Records</h3>
                  <div className="records-table">
                    <div className="table-header">
                      <div className="header-cell">Date</div>
                      <div className="header-cell">Subject</div>
                      <div className="header-cell">Period</div>
                      <div className="header-cell">Status</div>
                      <div className="header-cell">Teacher</div>
                      <div className="header-cell">Remarks</div>
                    </div>
                    
                    {attendanceData.attendance.map((record, index) => (
                      <div key={index} className={`table-row ${record.status}`}>
                        <div className="table-cell">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <div className="table-cell">{record.subject}</div>
                        <div className="table-cell">{record.period}</div>
                        <div className="table-cell">
                          <span className={`status-badge ${record.status}`}>
                            {record.status === 'present' ? '✅ Present' : '❌ Absent'}
                          </span>
                        </div>
                        <div className="table-cell">{record.teacher?.name}</div>
                        <div className="table-cell">{record.remarks || '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}