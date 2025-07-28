import React from "react";
const StudentCard = ({ student, attendance, onToggleAttendance, onUpdateRemarks }) => {
  const isPresent = attendance?.status === 'present';

  return (
    <div className={`student-card ${isPresent ? 'present' : 'absent'}`}>
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
        <button 
          className={`attendance-toggle ${isPresent ? 'present' : 'absent'}`}
          onClick={onToggleAttendance}
        >
          {isPresent ? '✅ Present' : '❌ Absent'}
        </button>
        
        {!isPresent && (
          <textarea
            className="remarks-input"
            placeholder="Add remarks (optional)"
            value={attendance?.remarks || ''}
            onChange={(e) => onUpdateRemarks(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentCard;