import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import RoleSelector from '../components/Auth/RoleSelector';
import { gsap } from 'gsap';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      router.push(`/dashboard/${user.userType}`);
    }

    // GSAP animations
    gsap.fromTo('.welcome-heading', 
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
    
    gsap.fromTo('.role-cards', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, stagger: 0.1 }
    );
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="landing-container">
      <div className="welcome-section">
        <h1 className="welcome-heading">Welcome to Alfa</h1>
        <p className="welcome-subtitle">Attendance Management System</p>
      </div>
      <RoleSelector />
    </div>
  );
}