import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { announcementAPI } from '../../services/api';
import Header from '../../components/Layout/Header';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: [],
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await announcementAPI.createAnnouncement(formData);
      alert('Announcement created successfully!');
      router.push('/announcements');
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError(error.response?.data?.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'targetAudience') {
        setFormData(prev => ({
          ...prev,
          targetAudience: checked
            ? [...prev.targetAudience, value]
            : prev.targetAudience.filter(audience => audience !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <PrivateRoute allowedRoles={['teacher', 'admin']}>
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="create-announcement-page">
            <Card
              title="📝 Create New Announcement"
              className="create-announcement-card"
            >
              <form onSubmit={handleSubmit} className="announcement-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content">Content *</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Enter announcement content"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="publishDate">Publish Date</label>
                    <input
                      type="date"
                      id="publishDate"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Target Audience</label>
                  <div className="checkbox-group">
                    {['student', 'teacher', 'parent'].map(audience => (
                      <label key={audience} className="checkbox-label">
                        <input
                          type="checkbox"
                          name="targetAudience"
                          value={audience}
                          checked={formData.targetAudience.includes(audience)}
                          onChange={handleChange}
                        />
                        {audience.charAt(0).toUpperCase() + audience.slice(1)}s
                      </label>
                    ))}
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/announcements')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Announcement'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
