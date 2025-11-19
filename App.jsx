import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PersonalProfile from './pages/PersonalProfile';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import Training from './pages/Training';
import './styles/App.css';
import GeneratedRoutine from './pages/GeneratedRoutine';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComingSoon from './pages/Comingsoon';
import Privacy from './pages/Privacy';
import Support from './pages/Support';
import Chatbot from './pages/Chatbot';
import Exercise from './pages/Exercise';
import ExerciseInProgress from './pages/ExerciseInProgress';
import WorkoutCompleted from './pages/WorkoutCompleted';


function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/personal-profile" element={<PersonalProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/training" element={<Training />} />
            <Route path="/generated-routine" element={<GeneratedRoutine />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/chatbot" element={<Chatbot />} />
           <Route path="/exercise-in-progress" element={<ExerciseInProgress />} />
            <Route path="/workout-completed" element={<WorkoutCompleted />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
