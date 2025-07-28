import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ userType, title, defaultCredentials = null }) => {
  const [formData, setFormData] = useState({
    email: defaultCredentials?.email || '',
    password: defaultCredentials?.password || '',
    userType
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      router.push(`/dashboard/${userType}`);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{title} Login</h2>
          {defaultCredentials && (
            <div className="default-credentials">
              <p>Default Credentials:</p>
              <p>Email: {defaultCredentials.email}</p>
              <p>Password: {defaultCredentials.password}</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <button 
            onClick={() => router.push('/')}
            className="back-button"
          >
            ← Back to Role Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;