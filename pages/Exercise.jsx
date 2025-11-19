import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import images with Vite
const images = {};
const modules = import.meta.glob('../assets/*.gif', { eager: true });
Object.entries(modules).forEach(([path, mod]) => {
  const fileName = path.split('/').pop();
  images[fileName] = mod.default;
});

function getImageForExercise(name) {
  if (!name) return images['default.gif'];
  const fileName = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '.gif';
  return images[fileName] || images['default.gif'];
}

// Simple estimations by exercise type
function getEstimation(exercise) {
  const name = exercise.name.toLowerCase();
  let time = 2; // minutes
  let calories = 2;
  let series = exercise.series || 4;

  if (name.includes('squat') || name.includes('deadlift') || name.includes('press')) {
    time = 4;
    calories = 4;
  } else if (name.includes('plank') || name.includes('planks')) {
    time = 1;
    calories = 1;
  } else if (name.includes('pull-up') || name.includes('dips')) {
    time = 3;
    calories = 3;
  } else if (name.includes('crunch') || name.includes('ab wheel')) {
    time = 1;
    calories = 1;
  }
  return { time, calories, series };
}

const Exercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ejercicios = Array.isArray(location.state?.ejercicios) ? location.state.ejercicios : [];
  const [current, setCurrent] = useState(0);

  // Debug: log props
  useEffect(() => {
    if (!location.state) {
      console.warn('location.state not found in Exercise.jsx');
    }
    if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
      console.warn('Exercises not passed correctly to Exercise.jsx', location.state);
    }
  }, [location.state, ejercicios]);

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [calories, setCalories] = useState(0);
  const [completedSeries, setCompletedSeries] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(120); // 2 minutes rest

  if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>No exercises to show.<br/>Did you come here correctly from the routine?</h2>
        <p style={{ color: '#888', fontSize: 14 }}>Make sure to start the routine from the generated routine screen.</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>Go Back</button>
      </div>
    );
  }

  const exercise = ejercicios[current];
  if (!exercise) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Exercise not found.</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>Go Back</button>
      </div>
    );
  }

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && !isResting) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
        if (timer % 10 === 0) {
          setCalories(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, isResting]);

  // Rest timer
  useEffect(() => {
    let interval;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimer === 0) {
      setIsResting(false);
      setRestTimer(120);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExercise = () => {
    setIsTimerRunning(true);
  };

  const handleCompleteSeries = () => {
    const totalSeries = exercise.series || 4;

    if (completedSeries < totalSeries - 1) {
      setCompletedSeries(prev => prev + 1);
      setIsResting(true);
      setIsTimerRunning(false);
    } else {
      setCompletedSeries(0);
      setIsResting(false);

      if (current < ejercicios.length - 1) {
        setCurrent(prev => prev + 1);
        setIsTimerRunning(false);
      } else {
        navigate('/workout-completed', {
          state: {
            duration: formatTime(timer),
            calories: calories
          }
        });
      }
    }
  };

  const handleHyperBot = () => {
    navigate('/chatbot', { state: { exercise } });
  };

  const imgSrc = getImageForExercise(exercise.name);
  const { time, calories: estCalories, series } = getEstimation(exercise);

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
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: 8
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
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
        <h3 style={{
          margin: '0 0 18px 0',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 22
        }}>
          Training
        </h3>

        <img
          src={imgSrc}
          alt={exercise.name}
          style={{
            width: 340,
            height: 240,
            objectFit: 'contain',
            borderRadius: 14,
            marginBottom: 18,
            background: '#f7f7fa'
          }}
        />

        {/* HyperBot */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
          <button
            onClick={handleHyperBot}
            style={{
              background: '#A084E8',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '4px 16px',
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span role="img" aria-label="bot" style={{ fontSize: 20 }}>🤖</span> HyperBot
          </button>

          <div style={{ fontSize: 15, color: '#444', textAlign: 'center' }}>
            {exercise.name}
            {exercise.series && exercise.repetitions && (
              <span style={{ fontSize: 14, color: '#888' }}>
                {' '}({exercise.series}x{exercise.repetitions})
              </span>
            )}
          </div>
        </div>

        {/* Rest timer */}
        {isResting && (
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '15px',
            textAlign: 'center',
            width: '100%'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Rest Time</h4>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#A084E8' }}>
              {formatTime(restTimer)}
            </div>
            <p style={{ margin: '10px 0 10px 0', fontSize: '14px', color: '#666' }}>
              Get ready for the next set
            </p>
            <button
              onClick={() => {
                setIsResting(false);
                setRestTimer(120);
                setIsTimerRunning(true);
              }}
              style={{
                background: '#A084E8',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 8
              }}
            >
              End Rest
            </button>
          </div>
        )}

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
            <span style={{ fontSize: 14, color: '#222', marginTop: 2 }}>{formatTime(timer)}</span>
          </div>

          {/* Calories */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 14, color: '#222', marginTop: 2 }}>{calories} kcal</span>
          </div>

          {/* Sets */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M6 20V10M12 20V4M18 20V14" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 14, color: '#222', marginTop: 2 }}>{completedSeries}/{exercise.series || 4} sets</span>
          </div>
        </div>

        {!isTimerRunning && !isResting ? (
          <button
            onClick={handleStartExercise}
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
              marginTop: 10
            }}
          >
            Start Exercise
          </button>
        ) : isResting ? (
          <button
            disabled
            style={{
              width: '100%',
              background: '#cccccc',
              color: '#666',
              border: 'none',
              borderRadius: 8,
              padding: '14px 0',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'not-allowed',
              marginTop: 10
            }}
          >
            Resting...
          </button>
        ) : (
          <button
            onClick={handleCompleteSeries}
            style={{
              width: '100%',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '14px 0',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 10
            }}
          >
            Set Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default Exercise;
