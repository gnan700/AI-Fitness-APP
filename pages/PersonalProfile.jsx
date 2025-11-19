import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import userService from '../services/userService';

const PersonalProfile = () => {
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [allergies, setAllergies] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    userService.updateProfile({
      height: height,
      weight: weight,
      level: level,
      goal: goal,
      allergies: allergies
    });
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ margin: '10px 0' }}>Create Profile</h1>

        <div style={{ textAlign: 'left', width: '100%' }}>
          
          <h3>Physical Data:</h3>
          
          <div className="form-group">
            <label className="form-label">Height:</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Height (cm)" 
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Weight:</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Weight (kg)" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Level:</label>
            <select 
              className="form-control" 
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="" disabled>Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Goal:</label>
            <select 
              className="form-control" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            >
              <option value="" disabled>Select goal</option>
              <option value="lose_weight">Lose weight</option>
              <option value="gain_muscle">Gain muscle</option>
              <option value="maintain">Maintain</option>
              <option value="define">Define</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Allergens:</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="None" 
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          className="btn btn-primary" 
          style={{ marginTop: '20px' }}
          disabled={!height || !weight || !level || !goal}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PersonalProfile;
