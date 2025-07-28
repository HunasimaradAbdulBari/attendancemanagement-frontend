import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Page Transition Animations
export const pageTransitionIn = (element) => {
  gsap.fromTo(element, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  );
};

export const pageTransitionOut = (element) => {
  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration: 0.4,
    ease: 'power2.in'
  });
};

// Card Animations
export const staggerCards = (selector, delay = 0.1) => {
  gsap.fromTo(selector,
    { opacity: 0, scale: 0.9, y: 30 },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      duration: 0.6, 
      stagger: delay,
      ease: 'back.out(1.7)'
    }
  );
};

export const hoverCardEffect = (element) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    scale: 1.05,
    y: -5,
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    duration: 0.3,
    ease: 'power2.out'
  });

  element.addEventListener('mouseenter', () => tl.play());
  element.addEventListener('mouseleave', () => tl.reverse());
};

// Button Animations
export const buttonClickEffect = (button) => {
  gsap.to(button, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  });
};

export const buttonLoadingEffect = (button, loading = true) => {
  if (loading) {
    gsap.to(button, {
      opacity: 0.7,
      scale: 0.98,
      duration: 0.2
    });
  } else {
    gsap.to(button, {
      opacity: 1,
      scale: 1,
      duration: 0.2
    });
  }
};

// Modal Animations
export const modalSlideIn = (modal) => {
  gsap.fromTo(modal,
    { opacity: 0, scale: 0.8, y: 50 },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      duration: 0.4, 
      ease: 'back.out(1.7)' 
    }
  );
};

export const modalSlideOut = (modal) => {
  return gsap.to(modal, {
    opacity: 0,
    scale: 0.8,
    y: 50,
    duration: 0.3,
    ease: 'power2.in'
  });
};

// Sidebar Animations
export const sidebarSlideIn = (sidebar) => {
  gsap.to(sidebar, {
    x: 0,
    duration: 0.4,
    ease: 'power2.out'
  });
};

export const sidebarSlideOut = (sidebar) => {
  gsap.to(sidebar, {
    x: '-100%',
    duration: 0.4,
    ease: 'power2.in'
  });
};

// Progress Bar Animation
export const animateProgressBar = (element, percentage, duration = 1.5) => {
  gsap.fromTo(element,
    { width: '0%' },
    { 
      width: `${percentage}%`, 
      duration: duration,
      ease: 'power2.out'
    }
  );
};

// Notification Animations
export const notificationSlideIn = (notification) => {
  gsap.fromTo(notification,
    { x: 300, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
  );
};

export const notificationSlideOut = (notification) => {
  return gsap.to(notification, {
    x: 300,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in'
  });
};

// List Item Animations
export const animateListItems = (selector, direction = 'up') => {
  const yValue = direction === 'up' ? 20 : -20;
  
  gsap.fromTo(selector,
    { opacity: 0, y: yValue },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      stagger: 0.1,
      ease: 'power2.out' 
    }
  );
};

// Hover Effects
export const setupHoverEffects = () => {
  // Card hover effects
  document.querySelectorAll('.dashboard-card, .teacher-card, .parent-card, .admin-card').forEach(card => {
    hoverCardEffect(card);
  });

  // Button click effects
  document.querySelectorAll('button, .btn').forEach(button => {
    button.addEventListener('click', () => buttonClickEffect(button));
  });
};

// Loading Spinner Animation
export const spinnerAnimation = (element) => {
  gsap.to(element, {
    rotation: 360,
    duration: 1,
    repeat: -1,
    ease: 'none'
  });
};

// Text Reveal Animation
export const textRevealAnimation = (element, delay = 0) => {
  gsap.fromTo(element,
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      delay: delay,
      ease: 'power2.out' 
    }
  );
};

// Counter Animation
export const animateCounter = (element, endValue, duration = 2) => {
  gsap.to({ value: 0 }, {
    value: endValue,
    duration: duration,
    ease: 'power2.out',
    onUpdate: function() {
      element.textContent = Math.round(this.targets()[0].value);
    }
  });
};

// Scroll Reveal
export const setupScrollReveal = () => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.utils.toArray('.scroll-reveal').forEach(element => {
      gsap.fromTo(element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }
};