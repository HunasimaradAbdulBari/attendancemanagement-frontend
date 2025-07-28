import { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import StudentCard from './StudentCard';
import { gsap } from 'gsap';

const AttendanceGrid = ({ classInfo }) => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (classInfo?.class && classInfo?.section) {
      fetchStudents();
    }
  }, [classInfo]);

  useEffect(() => {
    // GSAP animation for student cards
    gsap.fromTo('.student-card', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05 }
    );
  }, [students]);

  const fetchStudents = async () => {
    try {
      const response = await attendanceAPI.getStudentsByClass(classInfo.class, classInfo.section);
      setStudents(response.data.students);
      
      // Initialize attendance data with all present
      const initialData = {};
      response.data.students.forEach(student => {
        initialData[student._id] = {
          studentId: student._id,
          status: 'present',
          remarks: ''
        };
      });
      setAttendanceData(initialData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId].status === 'present' ? 'absent' : 'present'
      }
    }));
  };

  const markAllPresent = () => {
    const updatedData = {};
    students.forEach(student => {
      updatedData[student._id] = {
        studentId: student._id,
        status: 'present',
        remarks: ''
      };
    });
    setAttendanceData(updatedData);
  };

  const markAllAbsent = () => {
    const updatedData = {};
    students.forEach(student => {
      updatedData[student._id] = {
        studentId: student._id,
        status: 'absent',
        remarks: ''
      };
    });
    setAttendanceData(updatedData);
  };

  const updateRemarks = (studentId, remarks) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const submitAttendance = async () => {
    setSubmitting(true);
    
    try {
      const attendanceArray = Object.values(attendanceData);
      
      await attendanceAPI.takeAttendance({
        attendanceData: attendanceArray,
        classInfo: {
          ...classInfo,
          date: new Date().toISOString().split('T')[0]
        }
      });

      // Show success notification
      alert('Attendance submitted successfully!');
      
      // Notify about absent students
      const absentStudents = attendanceArray.filter(record => record.status === 'absent');
      if (absentStudents.length > 0) {
        alert(`${absentStudents.length} students marked absent. Notifications sent to parents.`);
      }
      
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Error submitting attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;

  const presentCount = Object.values(attendanceData).filter(record => record.status === 'present').length;
  const absentCount = students.length - presentCount;

  return (
    <div className="attendance-grid-container">
      {/* Header Controls */}
      <div className="attendance-header">
        <div className="class-info">
          <h2>📊 Take Attendance</h2>
          <p>Class: {classInfo.class}-{classInfo.section} | Subject: {classInfo.subject}</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="attendance-summary">
          <div className="summary-item present">
            <span className="count">{presentCount}</span>
            <span className="label">Present</span>
          </div>
          <div className="summary-item absent">
            <span className="count">{absentCount}</span>
            <span className="label">Absent</span>
          </div>
          <div className="summary-item total">
            <span className="count">{students.length}</span>
            <span className="label">Total</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <button 
          className="bulk-btn present-all"
          onClick={markAllPresent}
        >
          ✅ Mark All Present
        </button>
        <button 
          className="bulk-btn absent-all"
          onClick={markAllAbsent}
        >
          ❌ Mark All Absent
        </button>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {students.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
            attendance={attendanceData[student._id]}
            onToggleAttendance={() => toggleAttendance(student._id)}
            onUpdateRemarks={(remarks) => updateRemarks(student._id, remarks)}
          />
        ))}
      </div>

      {/* Submit Button */}
      <div className="submit-section">
        <button 
          className="submit-attendance-btn"
          onClick={submitAttendance}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : '📤 Submit Attendance'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceGrid;