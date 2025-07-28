import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import AdminDashboard from '../../components/Dashboard/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <PrivateRoute allowedRoles={['admin']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <AdminDashboard />
        </main>
      </div>
    </PrivateRoute>
  );
}