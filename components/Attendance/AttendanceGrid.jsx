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
    if (classInfo?.class && classInfo?.section && classInfo?.period && classInfo?.subject) {
      fetchStudents();
    }
  }, [classInfo]);

  useEffect(() => {
    if (students.length > 0) {
      requestAnimationFrame(() => {
        gsap.fromTo(
          '.student-card',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05 }
        );
      });
    }
  }, [students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getStudentsByClass(classInfo.class, classInfo.section);
      const studentList = response.data.students || [];

      setStudents(studentList);

      const initialData = {};
      studentList.forEach(student => {
        initialData[student._id] = {
          studentId: student._id,
          status: 'present',
          remarks: ''
        };
      });
      setAttendanceData(initialData);
    } catch (error) {
      console.error('Error fetching students:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`⚠️ Failed to fetch students: ${errorMessage}`);
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

      const payload = {
        attendanceData: attendanceArray,
        classInfo: {
          class: classInfo.class,
          section: classInfo.section,
          subject: classInfo.subject,
          period: classInfo.period,
          date: new Date().toISOString().split('T')[0]
        }
      };

      const response = await attendanceAPI.takeAttendance(payload);

      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
        
        // Handle any partial errors
        if (response.data.errors && response.data.errors.length > 0) {
          console.warn('Some records had issues:', response.data.errors);
          alert(`⚠️ Warning: ${response.data.errors.length} records had issues. Check console for details.`);
        }

        const absentStudents = attendanceArray.filter(record => record.status === 'absent');
        if (absentStudents.length > 0) {
          alert(`ℹ️ ${absentStudents.length} students marked absent. Notifications sent.`);
        }
      } else {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      
      let errorMessage = 'Failed to submit attendance';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for specific duplicate key error
      if (errorMessage.includes('duplicate key') || errorMessage.includes('E11000')) {
        errorMessage = 'Attendance for this class/period already exists. The system has updated existing records.';
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;

  const presentCount = Object.values(attendanceData).filter(record => record.status === 'present').length;
  const absentCount = students.length - presentCount;

  return (
    <div className="attendance-grid-container">
      <div className="attendance-header">
        <div className="class-info">
          <h2>📊 Take Attendance</h2>
          <p>Class: {classInfo.class}-{classInfo.section} | Subject: {classInfo.subject} | Period: {classInfo.period}</p>
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

      <div className="bulk-actions">
        <button className="bulk-btn present-all" onClick={markAllPresent}>
          ✅ Mark All Present
        </button>
        <button className="bulk-btn absent-all" onClick={markAllAbsent}>
          ❌ Mark All Absent
        </button>
      </div>

      <div className="students-grid">
        {students.map(student => (
          <StudentCard
            key={student._id}
            student={student}
            attendance={attendanceData[student._id]}
            onToggleAttendance={() => toggleAttendance(student._id)}
            onUpdateRemarks={(remarks) => updateRemarks(student._id, remarks)}
          />
        ))}
      </div>

      <div className="submit-section">
        <button
          className="submit-attendance-btn"
          onClick={submitAttendance}
          disabled={submitting || students.length === 0}
        >
          {submitting ? 'Submitting...' : '📤 Submit Attendance'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceGrid;