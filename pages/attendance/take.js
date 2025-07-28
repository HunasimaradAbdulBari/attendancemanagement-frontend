import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import AttendanceGrid from '../../components/Attendance/AttendanceGrid';

export default function TakeAttendancePage() {
  const router = useRouter();
  const [classInfo, setClassInfo] = useState(null);

  useEffect(() => {
    const { class: className, section, subject } = router.query;
    
    if (className && section && subject) {
      setClassInfo({
        class: className,
        section: section,
        subject: subject,
        period: 1 // You can make this dynamic
      });
    }
  }, [router.query]);

  return (
    <PrivateRoute allowedRoles={['teacher']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          {classInfo ? (
            <AttendanceGrid classInfo={classInfo} />
          ) : (
            <div className="class-selector">
              <h2>Select Class to Take Attendance</h2>
              <p>Please select a class from your dashboard or provide class information.</p>
              <button 
                onClick={() => router.push('/dashboard/teacher')}
                className="back-to-dashboard-btn"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </PrivateRoute>
  );
}