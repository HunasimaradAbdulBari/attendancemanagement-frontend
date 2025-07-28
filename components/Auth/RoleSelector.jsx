import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { gsap } from 'gsap';

const RoleSelector = () => {
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo('.role-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    );
  }, []);

  const roles = [
    {
      type: 'student',
      title: 'Student',
      description: 'View attendance, timetable, and announcements',
      icon: '🎓',
      color: '#3b82f6'
    },
    {
      type: 'teacher', 
      title: 'Teacher',
      description: 'Take attendance and manage classes',
      icon: '👨‍🏫',
      color: '#10b981'
    },
    {
      type: 'parent',
      title: 'Parent',
      description: 'Track your child\'s attendance',
      icon: '👨‍👩‍👧‍👦',
      color: '#f59e0b'
    },
    {
      type: 'admin',
      title: 'Admin',
      description: 'Manage system and users',
      icon: '⚙️',
      color: '#ef4444'
    }
  ];

  return (
    <div className="role-selector">
      <h2>Select Your Role</h2>
      <div className="role-grid">
        {roles.map((role) => (
          <div 
            key={role.type}
            className="role-card"
            onClick={() => router.push(`/login/${role.type}`)}
            style={{ '--card-color': role.color }}
          >
            <div className="role-icon">{role.icon}</div>
            <h3>{role.title}</h3>
            <p>{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;