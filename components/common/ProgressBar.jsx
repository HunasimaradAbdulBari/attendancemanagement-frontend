import { useEffect, useRef } from 'react';

const ProgressBar = ({ percentage, size = 100, strokeWidth = 4, color = '#10b981' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-bar-container" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ 
            transition: 'stroke-dashoffset 0.5s ease-in-out',
            strokeLinecap: 'round'
          }}
        />
      </svg>
      {/* Percentage text */}
      <div className="progress-text" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: `${size / 5}px`,
        fontWeight: 'bold',
        color: 'var(--text-primary)'
      }}>
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressBar;