import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import StudentDashboard from '../../components/Dashboard/StudentDashboard';

export default function StudentDashboardPage() {
  return (
    <PrivateRoute allowedRoles={['student']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <StudentDashboard />
        </main>
      </div>
    </PrivateRoute>
  );
}