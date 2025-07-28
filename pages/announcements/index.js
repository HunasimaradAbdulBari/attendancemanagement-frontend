import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { announcementAPI } from '../../services/api';
import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { gsap } from 'gsap';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
    
    // GSAP animations
    gsap.fromTo('.announcement-card', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    );
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementAPI.getAnnouncements({
        limit: 20,
        sortBy: 'publishDate',
        sortOrder: 'desc'
      });
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (announcementId) => {
    try {
      await announcementAPI.markAsRead(announcementId);
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement._id === announcementId
            ? { ...announcement, readBy: [...(announcement.readBy || []), user.id] }
            : announcement
        )
      );
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !announcement.readBy?.includes(user.id);
    return announcement.priority === filter;
  });

  if (loading) return <div>Loading announcements...</div>;

  return (
    <PrivateRoute>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="announcements-page">
            <div className="page-header">
              <h2>📢 Announcements</h2>
              {user?.userType === 'teacher' && (
  <Button 
    onClick={() => window.location.href = '/announcements/create'}
  >
    📝 Create Announcement
  </Button>
)}
            </div>

            {/* Filter Tabs */}
            <div className="announcement-filters">
              {['all', 'unread', 'high', 'medium', 'low'].map(filterOption => (
                <button
                  key={filterOption}
                  className={`filter-tab ${filter === filterOption ? 'active' : ''}`}
                  onClick={() => setFilter(filterOption)}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>

            {/* Announcements List */}
            <div className="announcements-list">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
                  <Card
                    key={announcement._id}
                    className={`announcement-card ${!announcement.readBy?.includes(user.id) ? 'unread' : ''}`}
                  >
                    <div className="announcement-header">
                      <div className="announcement-meta">
                        <h3>{announcement.title}</h3>
                        <div className="announcement-info">
                          <span className={`priority-badge ${announcement.priority}`}>
                            {announcement.priority}
                          </span>
                          <span className="announcement-date">
                            {new Date(announcement.publishDate).toLocaleDateString()}
                          </span>
                          <span className="announcement-author">
                            By: {announcement.author?.name}
                          </span>
                        </div>
                      </div>
                      {!announcement.readBy?.includes(user.id) && (
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => markAsRead(announcement._id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                    
                    <div className="announcement-content">
                      <p>{announcement.content}</p>
                      
                      {announcement.targetAudience?.length > 0 && (
                        <div className="target-audience">
                          <strong>Target:</strong> {announcement.targetAudience.join(', ')}
                        </div>
                      )}
                      
                      {announcement.attachments?.length > 0 && (
                        <div className="attachments">
                          <strong>Attachments:</strong>
                          {announcement.attachments.map((attachment, index) => (
                            <a key={index} href={attachment.url} target="_blank" rel="noopener noreferrer">
                              📎 {attachment.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="no-announcements">
                  <p>No announcements found for the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}