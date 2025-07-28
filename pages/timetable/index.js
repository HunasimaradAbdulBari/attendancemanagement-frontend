import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { timetableAPI } from '../../services/api';
import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Card from '../../components/UI/Card';

export default function TimetablePage() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetableData();
  }, []);

  const fetchTimetableData = async () => {
    try {
      if (user.userType === 'student') {
        const [timetableRes, holidaysRes] = await Promise.all([
          timetableAPI.getTimetable(user.class, user.section),
          timetableAPI.getHolidays(user.class, user.section)
        ]);
        setTimetable(timetableRes.data.timetable);
        setHolidays(holidaysRes.data.holidays);
      } else if (user.userType === 'teacher') {
        const classesRes = await timetableAPI.getTeacherClasses();
        setTimetable(classesRes.data.assignedClasses);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading timetable...</div>;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <PrivateRoute allowedRoles={['student', 'teacher']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="timetable-page">
            <Card
              title={`📅 ${user.userType === 'student' ? 'Class Timetable' : 'My Classes'}`}
              subtitle={user.userType === 'student' ? `Class: ${user.class}-${user.section}` : ''}
            >
              {user.userType === 'student' && timetable ? (
                <div className="timetable-grid">
                  <div className="timetable-header">
                    <div className="period-header">Period</div>
                    {daysOfWeek.map(day => (
                      <div key={day} className="day-header">{day}</div>
                    ))}
                  </div>
                  
                  {periods.map(period => (
                    <div key={period} className="timetable-row">
                      <div className="period-cell">{period}</div>
                      {daysOfWeek.map(day => {
                        const classData = timetable.schedule?.[day]?.[period];
                        return (
                          <div key={`${day}-${period}`} className="class-cell">
                            {classData ? (
                              <div className="class-info">
                                <div className="subject">{classData.subject}</div>
                                <div className="teacher">{classData.teacher}</div>
                              </div>
                            ) : (
                              <div className="empty-cell">-</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : user.userType === 'teacher' && timetable ? (
                <div className="teacher-classes">
                  {timetable.map((classItem, index) => (
                    <div key={index} className="teacher-class-card">
                      <h4>{classItem.class}-{classItem.section}</h4>
                      <p>Subject: {classItem.subject}</p>
                      <div className="class-actions">
                        <button 
                          onClick={() => window.location.href = `/attendance/take?class=${classItem.class}&section=${classItem.section}&subject=${classItem.subject}`}
                        >
                          Take Attendance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No timetable data available.</p>
              )}
            </Card>

            {/* Holidays Section */}
            {holidays.length > 0 && (
              <Card title="🏖️ Upcoming Holidays" className="holidays-card">
                <div className="holidays-list">
                  {holidays.map((holiday, index) => (
                    <div key={index} className="holiday-item">
                      <div className="holiday-date">
                        {new Date(holiday.date).toLocaleDateString()}
                      </div>
                      <div className="holiday-name">{holiday.name}</div>
                      <div className="holiday-type">{holiday.type}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}