import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gsap } from 'gsap';

const Header = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage only after mounting
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
    // GSAP animation for sidebar with element check
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      if (!sidebarOpen) {
        gsap.to(sidebar, { x: 0, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(sidebar, { x: '-100%', duration: 0.3, ease: 'power2.out' });
      }
    }
  };

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <header className="header">
        <div className="header-left">
          <button className="hamburger-menu" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="header-title">Presidency University</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">({user?.userType})</span>
          </div>
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button 
            className="hamburger-menu"
            onClick={toggleSidebar}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="header-title">Presidency University</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">({user?.userType})</span>
          </div>
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Sliding Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button 
            className="close-sidebar"
            onClick={toggleSidebar}
          >
            ×
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <a href={`/dashboard/${user?.userType}`}>📊 Dashboard</a>
          
          {user?.userType === 'student' && (
            <>
              <a href="/attendance/view">📈 My Attendance</a>
              <a href="/timetable">📅 Timetable</a>
              <a href="/announcements">📢 Announcements</a>
            </>
          )}
          
          {user?.userType === 'teacher' && (
            <>
              <a href="/attendance/take">✅ Take Attendance</a>
              <a href="/announcements/create">📝 Create Announcement</a>
              <a href="/timetable">📅 My Classes</a>
            </>
          )}
          
          {user?.userType === 'parent' && (
            <>
              <a href="/attendance/view">👨‍👩‍👧‍👦 Child's Attendance</a>
              <a href="/announcements">📢 Announcements</a>
            </>
          )}
          
          {user?.userType === 'admin' && (
            <>
              <a href="/dashboard/admin">🎛️ Admin Panel</a>
              <a href="/announcements">📢 Manage Announcements</a>
            </>
          )}
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
          
          <button 
            className="logout-button"
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Header;