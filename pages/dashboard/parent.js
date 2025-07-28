import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import ParentDashboard from '../../components/Dashboard/ParentDashboard';

export default function ParentDashboardPage() {
  return (
    <PrivateRoute allowedRoles={['parent']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <ParentDashboard />
        </main>
      </div>
    </PrivateRoute>
  );
}