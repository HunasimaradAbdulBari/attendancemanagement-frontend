import { useState } from 'react';
import PrivateRoute from '../../components/Layout/PrivateRoute';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

const CreateAnnouncementPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: 'all'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    alert('Announcement created successfully!');
    window.location.href = '/announcements';
  };

  return (
    <PrivateRoute allowedRoles={['teacher', 'admin']}>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <div className="page-header">
            <h2>📝 Create Announcement</h2>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="announcement-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  📤 Publish Announcement
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => window.location.href = '/announcements'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default CreateAnnouncementPage;