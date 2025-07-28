import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import TeacherDashboard from '../../components/Dashboard/TeacherDashboard';

export default function TeacherDashboardPage() {
  return (
    <PrivateRoute allowedRoles={['teacher']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <TeacherDashboard />
        </main>
      </div>
    </PrivateRoute>
  );
}
