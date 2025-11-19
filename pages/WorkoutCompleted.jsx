import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WorkoutCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { duration, calories } = location.state || { duration: '00:00', calories: 0 };

  const handleBack = () => {
    navigate('/generated-routine');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        maxWidth: 450,
        margin: '0 auto',
        padding: '16px 0 0 0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ width: 32 }}></div>
        <h2 style={{
          flex: 1,
          textAlign: 'center',
          margin: 0,
          color: '#A084E8',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 1
        }}>
          <span style={{ color: '#B9A9F7' }}>Hyper</span>Fit
        </h2>
        <div style={{ width: 32 }}></div>
      </div>

      {/* Card */}
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        margin: '32px 0 0 0',
        padding: 24,
        maxWidth: 370,
        width: '95%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: '#A084E8',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h3 style={{
          margin: '0 0 18px 0',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 28
        }}>
          Congratulations!
        </h3>

        <p style={{
          fontSize: 18,
          color: '#444',
          textAlign: 'center',
          marginBottom: 24
        }}>
          You've completed your workout routine
        </p>

        {/* Info icons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
          margin: '18px 0 18px 0'
        }}>
          {/* Time */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 14, color: '#222', marginTop: 2 }}>{duration}</span>
          </div>
          {/* Calories */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 14, color: '#222', marginTop: 2 }}>{calories} kcal</span>
          </div>
        </div>

        <button
          onClick={handleBack}
          style={{
            width: '100%',
            background: '#A084E8',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '14px 0',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 24
          }}
        >
          Back to my routines
        </button>
      </div>
    </div>
  );
};

export default WorkoutCompleted;
