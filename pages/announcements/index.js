import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const AnnouncementsPage = () => {
  const { user, loading } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PrivateRoute>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="page-header">
            <h2>📢 Announcements</h2>
            {user?.userType === 'teacher' && (
              <button 
                onClick={() => window.location.href = '/announcements/create'}
                className="btn btn-primary"
              >
                📝 Create Announcement
              </button>
            )}
          </div>
          <div className="announcements-container">
            <p>School announcements will be displayed here.</p>
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default AnnouncementsPage;