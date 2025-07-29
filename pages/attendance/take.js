import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI, timetableAPI } from '../../services/api';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Notification from '../../components/Common/Notification';

const TakeAttendancePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchTeacherClasses();
    
    // If class info is passed via query params, set it
    if (router.query.class && router.query.section && router.query.subject) {
      setSelectedClass(router.query.class);
      setSelectedSection(router.query.section);
      setSelectedSubject(router.query.subject);
    }
  }, [router.query]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchStudents();
    }
  }, [selectedClass, selectedSection]);

  const fetchTeacherClasses = async () => {
    try {
      const response = await timetableAPI.getTeacherClasses();
      setTeacherClasses(response.data.assignedClasses || []);
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      showNotification('error', 'Failed to load your classes');
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getStudentsByClass(selectedClass, selectedSection);
      const studentList = response.data.students || [];
      setStudents(studentList);
      
      // Initialize attendance state
      const initialAttendance = {};
      studentList.forEach(student => {
        initialAttendance[student._id] = 'present'; // Default to present
      });
      setAttendance(initialAttendance);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      showNotification('error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedClass || !selectedSection || !selectedSubject) {
      showNotification('error', 'Please select class, section, and subject');
      return;
    }

    if (students.length === 0) {
      showNotification('error', 'No students found for this class');
      return;
    }

    try {
      setSubmitting(true);
      
      const attendanceData = students.map(student => ({
        studentId: student._id,
        status: attendance[student._id] || 'present',
        remarks: ''
      }));

      const payload = {
        attendanceData,
        classInfo: {
          class: selectedClass,
          section: selectedSection,
          subject: selectedSubject,
          period: selectedPeriod,
          date: selectedDate
        }
      };

      await attendanceAPI.takeAttendance(payload);
      
      showNotification('success', 'Attendance recorded successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        router.push('/dashboard/teacher');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting attendance:', error);
      showNotification('error', error.response?.data?.message || 'Failed to record attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSelectAll = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student._id] = status;
    });
    setAttendance(newAttendance);
  };

  const getAvailableSubjects = () => {
    const classData = teacherClasses.find(cls => 
      cls.class === selectedClass && cls.section === selectedSection
    );
    return classData ? [classData.subject] : [];
  };

  return (
    <PrivateRoute allowedRoles={['teacher']}>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="page-header">
            <h2>✅ Take Attendance</h2>
            <p>Record student attendance for your classes</p>
          </div>

          <div className="attendance-form-container">
            <form onSubmit={handleSubmit} className="attendance-form">
              {/* Class Selection */}
              <div className="form-section">
                <h3>📚 Class Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="class">Class</label>
                    <select
                      id="class"
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setSelectedSection('');
                        setSelectedSubject('');
                      }}
                      required
                    >
                      <option value="">Select Class</option>
                      {[...new Set(teacherClasses.map(cls => cls.class))].map(className => (
                        <option key={className} value={className}>{className}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="section">Section</label>
                    <select
                      id="section"
                      value={selectedSection}
                      onChange={(e) => {
                        setSelectedSection(e.target.value);
                        setSelectedSubject('');
                      }}
                      required
                      disabled={!selectedClass}
                    >
                      <option value="">Select Section</option>
                      {teacherClasses
                        .filter(cls => cls.class === selectedClass)
                        .map(cls => cls.section)
                        .filter((section, index, arr) => arr.indexOf(section) === index)
                        .map(section => (
                          <option key={section} value={section}>{section}</option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      required
                      disabled={!selectedClass || !selectedSection}
                    >
                      <option value="">Select Subject</option>
                      {getAvailableSubjects().map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="period">Period</label>
                    <select
                      id="period"
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(period => (
                        <option key={period} value={period}>Period {period}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Student List */}
              {students.length > 0 && (
                <div className="form-section">
                  <div className="students-header">
                    <h3>👥 Students ({students.length})</h3>
                    <div className="bulk-actions">
                      <button
                        type="button"
                        className="btn btn-success btn-small"
                        onClick={() => handleSelectAll('present')}
                      >
                        Mark All Present
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleSelectAll('absent')}
                      >
                        Mark All Absent
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <LoadingSpinner message="Loading students..." />
                  ) : (
                    <div className="students-list">
                      {students.map((student) => (
                        <div key={student._id} className="student-item">
                          <div className="student-info">
                            <div className="student-avatar">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-details">
                              <h4>{student.name}</h4>
                              <p>Roll No: {student.rollNumber}</p>
                            </div>
                          </div>
                          <div className="attendance-controls">
                            <label className="radio-option present">
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="present"
                                checked={attendance[student._id] === 'present'}
                                onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                              />
                              <span>✅ Present</span>
                            </label>
                            <label className="radio-option absent">
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="absent"
                                checked={attendance[student._id] === 'absent'}
                                onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                              />
                              <span>❌ Absent</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => router.push('/dashboard/teacher')}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || students.length === 0}
                >
                  {submitting ? 'Recording...' : '📝 Record Attendance'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
        
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </PrivateRoute>
  );
};

export default TakeAttendancePage;