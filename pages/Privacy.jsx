import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div className="container" style={{ minHeight: '100vh', background: 'white', paddingTop: '60px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', padding: '24px' }}>
        <h2 style={{ color: '#8A2BE2', marginBottom: '18px' }}>Privacy Policy</h2>
        <p style={{ color: '#444', fontSize: '16px', marginBottom: '24px', lineHeight: '1.6' }}>
          We take your data privacy very seriously. This application only stores the information necessary
          to offer you the best possible service. We will never share your personal data with third parties
          without your consent.<br /><br />
          For more details about how your data is used, please check this section regularly. If you have any
          questions, feel free to contact our support team.
        </p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-primary" 
          style={{ background: '#8A2BE2', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 'bold' }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Privacy;
