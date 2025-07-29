import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { timetableAPI } from '../../services/api';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const TimetablePage = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchTimetableData();
    }
  }, [user]);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      setError('');

      let className, section;

      if (user.userType === 'student') {
        className = user.class;
        section = user.section;
      } else if (user.userType === 'parent' && user.children?.length > 0) {
        // For parents, use first child's class (you might want to add child selection)
        className = user.children[0].class;
        section = user.children[0].section;
      } else if (user.userType === 'teacher') {
        // For teachers, we'll show their schedule differently
        const teacherClasses = await timetableAPI.getTeacherClasses();
        // For now, show first assigned class timetable
        if (teacherClasses.data.assignedClasses?.length > 0) {
          className = teacherClasses.data.assignedClasses[0].class;
          section = teacherClasses.data.assignedClasses[0].section;
        }
      }

      if (className && section) {
        // Fetch timetable
        const timetableResponse = await timetableAPI.getTimetable(className, section);
        setTimetable(timetableResponse.data.timetable);

        // Fetch holidays
        const holidaysResponse = await timetableAPI.getHolidays(className, section);
        setHolidays(holidaysResponse.data.holidays || []);
      } else {
        setError('No class information available');
      }

    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const getPeriodForDay = (day, period) => {
    const daySchedule = timetable?.schedule?.find(s => s.day === day);
    return daySchedule?.periods?.find(p => p.period === period);
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.length <= 5 ? time : time.substring(0, 5);
  };

  const isHoliday = (date) => {
    return holidays.some(holiday => 
      new Date(holiday.date).toDateString() === date.toDateString()
    );
  };

  const getUpcomingHolidays = () => {
    const today = new Date();
    return holidays
      .filter(holiday => new Date(holiday.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  if (loading) {
    return <LoadingSpinner message="Loading timetable..." />;
  }

  return (
    <PrivateRoute>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="page-header">
            <h2>📅 Timetable</h2>
            <p>
              {user.userType === 'student' && `Class ${user.class} - Section ${user.section}`}
              {user.userType === 'parent' && user.children?.length > 0 && 
                `${user.children[0].name} - Class ${user.children[0].class} - Section ${user.children[0].section}`}
              {user.userType === 'teacher' && 'Your Teaching Schedule'}
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="timetable-container">
            {timetable ? (
              <>
                {/* Main Timetable */}
                <div className="timetable-card">
                  <h3>📚 Weekly Schedule</h3>
                  <div className="timetable-grid">
                    <div className="timetable-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Period</th>
                            {daysOfWeek.map(day => (
                              <th key={day}>{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {periods.map(period => (
                            <tr key={period}>
                              <td className="period-number">
                                <div className="period-info">
                                  <strong>Period {period}</strong>
                                  <small>
                                    {period === 1 && '9:00-9:45'}
                                    {period === 2 && '9:45-10:30'}
                                    {period === 3 && '10:45-11:30'}
                                    {period === 4 && '11:30-12:15'}
                                    {period === 5 && '1:00-1:45'}
                                    {period === 6 && '1:45-2:30'}
                                    {period === 7 && '2:30-3:15'}
                                    {period === 8 && '3:15-4:00'}
                                  </small>
                                </div>
                              </td>
                              {daysOfWeek.map(day => {
                                const periodData = getPeriodForDay(day, period);
                                return (
                                  <td key={`${day}-${period}`} className="period-cell">
                                    {periodData ? (
                                      <div className="subject-card">
                                        <div className="subject-name">
                                          {periodData.subject}
                                        </div>
                                        <div className="teacher-name">
                                          {periodData.teacher?.name || 'TBA'}
                                        </div>
                                        {(periodData.startTime || periodData.endTime) && (
                                          <div className="time-slot">
                                            {formatTime(periodData.startTime)} - {formatTime(periodData.endTime)}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="empty-period">
                                        {period === 3 && 'BREAK'}
                                        {period === 5 && 'LUNCH'}
                                        {(period !== 3 && period !== 5) && '—'}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="today-schedule-card">
                  <h3>📋 Today's Schedule</h3>
                  <div className="today-schedule">
                    {(() => {
                      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                      const todaySchedule = timetable.schedule?.find(s => s.day === today);
                      
                      if (!todaySchedule || !todaySchedule.periods) {
                        return <p>No classes scheduled for today.</p>;
                      }

                      return (
                        <div className="today-periods">
                          {todaySchedule.periods
                            .sort((a, b) => a.period - b.period)
                            .map(period => (
                              <div key={period.period} className="today-period">
                                <div className="period-time">
                                  <span className="period-number">Period {period.period}</span>
                                  <span className="time-range">
                                    {formatTime(period.startTime)} - {formatTime(period.endTime)}
                                  </span>
                                </div>
                                <div className="period-details">
                                  <span className="subject">{period.subject}</span>
                                  <span className="teacher">{period.teacher?.name || 'TBA'}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Upcoming Holidays */}
                {holidays.length > 0 && (
                  <div className="holidays-card">
                    <h3>🎉 Upcoming Holidays</h3>
                    <div className="holidays-list">
                      {getUpcomingHolidays().map((holiday, index) => (
                        <div key={index} className="holiday-item">
                          <div className="holiday-date">
                            {new Date(holiday.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="holiday-reason">
                            {holiday.reason}
                          </div>
                        </div>
                      ))}
                      {getUpcomingHolidays().length === 0 && (
                        <p>No upcoming holidays scheduled.</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-timetable">
                <h3>No Timetable Available</h3>
                <p>Timetable has not been created for this class yet.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default TimetablePage;