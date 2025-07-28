import PrivateRoute from '../../components/Layout/PrivateRoute';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

const ViewAttendancePage = () => {
  return (
    <PrivateRoute allowedRoles={['student', 'parent']}>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="page-header">
            <h2>📊 Attendance Report</h2>
            <p>View detailed attendance records</p>
          </div>
          <div className="attendance-view-container">
            <p>Attendance details will be displayed here.</p>
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default ViewAttendancePage;