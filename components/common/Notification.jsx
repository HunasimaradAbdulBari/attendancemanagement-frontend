import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const Notification = ({ type = 'info', message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animate in
    gsap.fromTo('.notification', 
      { x: 300, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3 }
    );

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    gsap.to('.notification', {
      x: 300,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setIsVisible(false);
        if (onClose) onClose();
      }
    });
  };

  if (!isVisible) return null;

  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-icon">{typeIcons[type]}</span>
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;