import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/');
        return;
      }
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType)) {
        router.push(`/dashboard/${user?.userType}`);
        return;
      }
    }
  }, [isAuthenticated, user, loading, router, allowedRoles]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType)) {
    return null;
  }

  return children;
};

export default PrivateRoute;