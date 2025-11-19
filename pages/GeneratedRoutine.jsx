import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/App.css';

const LISTA_EJERCICIOS = `
GYM EXERCISES - COMPLETE LIST (20 EXERCISES)

--- PUSH (Chest, Shoulders, Triceps) ---
1. Flat bench press with barbell
2. Military press with barbell or dumbbells
3. Dips on parallel bars
4. Lateral raises with dumbbells
5. Incline bench press with dumbbells

--- PULL (Back, Biceps) ---
6. Pull-ups (pull-ups or chin-ups)
7. Row with barbell or dumbbell
8. Conventional deadlift
9. Lat pulldown machine
10. Biceps curl with barbell or dumbbells

--- LEGS (Quads, Hamstrings, Glutes, Calves) ---
11. Squats with barbell
12. Leg press
13. Lunges with dumbbells or barbell
14. Romanian deadlift

--- CORE (Abs and Midsection) ---
16. Planks
17. Leg raises hanging or on bench
18. Crunches (machine or floor)
19. Ab wheel
`;

const GeneratedRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goal, level, daysPerWeek } = location.state || {};

  const [routine, setRoutine] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeGoal = goal || 'general';
    const safeLevel = level || 'beginner';
    const safeDays = daysPerWeek || 3;

    const currentParams = JSON.stringify({ goal: safeGoal, level: safeLevel, daysPerWeek: safeDays });
    const savedRoutine = sessionStorage.getItem('hyperfit_routine');
    const savedParams = sessionStorage.getItem('hyperfit_routine_params');

    if (savedRoutine && savedParams === currentParams) {
      setRoutine(JSON.parse(savedRoutine));
      setLoading(false);
      return;
    }

    const prompt = `
Use only the following exercises to create the routine (do NOT invent new ones):

${LISTA_EJERCICIOS}

Generate a JSON workout routine (must be JSON, no markdown). Create it for ${safeDays} days, goal: ${safeGoal}, level: ${safeLevel}.
IMPORTANT: Each day name must be exactly "Day 1", "Day 2", etc. No muscle-group names.
For each day include name, sets and reps per exercise. Respond ONLY with the JSON.
`;

    fetch('http://localhost:8000/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_message: prompt })
    })
      .then(res => res.json())
      .then(data => {
        return fetch('http://localhost:8000/api/v1/process-routine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ response: data.response })
        });
      })
      .then(res => res.json())
      .then(data => {
        const rutinaArray = data.routine || [];
        setRoutine(rutinaArray);
        sessionStorage.setItem('hyperfit_routine', JSON.stringify(rutinaArray));
        sessionStorage.setItem('hyperfit_routine_params', currentParams);
        setLoading(false);
      })
      .catch(() => {
        setRoutine([]);
        setLoading(false);
      });
  }, [goal, level, daysPerWeek]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartDay = (dayIndex) => {
    const ejercicios = routine[dayIndex]?.ejercicios || [];
    if (ejercicios.length > 0) {
      navigate('/exercise', { state: { ejercicios } });
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white', position: 'relative' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          zIndex: 999
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            height: '60px',
            maxWidth: '450px',
            margin: '0 auto'
          }}>
            <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h2 style={{ flex: 1, textAlign: 'center', margin: 0, color: '#8A2BE2' }}>Generated Routine</h2>
            <div style={{ width: '24px' }}></div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, marginTop: '60px', marginBottom: '90px', padding: '20px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
              <div className="spinner"></div>
              <p style={{ color: '#8A2BE2', marginTop: 16, fontWeight: 500 }}>Generating your personalized routine...</p>
            </div>
          ) : routine.length === 0 ? (
            <p>Could not generate routine. Try again.</p>
          ) : (
            routine.map((day, index) => (
              <div key={index} style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ marginBottom: '12px' }}>{`Day ${index + 1}`}</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  {(day.ejercicios && day.ejercicios.length > 0) ? (
                    day.ejercicios.map((ex, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>
                        {ex.nombre}: {ex.series} x {ex.repeticiones}
                      </li>
                    ))
                  ) : (
                    <li style={{ color: '#888' }}>No exercises for this day.</li>
                  )}
                </ul>
                <button
                  onClick={() => handleStartDay(index)}
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: '#8A2BE2', color: 'white', padding: '10px', borderRadius: '8px' }}
                  disabled={(day.ejercicios || []).length === 0}
                >
                  {(day.ejercicios || []).length === 0 ? 'No exercises' : `Start Day ${index + 1}`}
                </button>
              </div>
            ))
          )}
        </main>

        {/* Bottom Nav */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '450px',
          margin: '0 auto',
          background: 'white',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0',
          zIndex: 1000
        }}>
          <Link to="/dashboard" className="nav-item active" style={{ textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="#8A2BE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Home</span>
          </Link>

          <Link to="/coming-soon" className="nav-item" style={{ textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21L16.65 16.65"
                stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Search</span>
          </Link>

          <Link to="/user-profile" className="nav-item" style={{ textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default GeneratedRoutine;
