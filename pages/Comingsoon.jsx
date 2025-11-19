import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const ComingSoon = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '450px', width: '90%', textAlign: 'center', padding: '30px' }}>
        <h2 style={{ color: '#8A2BE2', marginBottom: '20px', fontSize: '28px' }}>¡Próximamente!</h2>
        <p style={{ fontSize: '18px', color: '#555', marginBottom: '30px', lineHeight: '1.5' }}>
          This feature will be available very soon.
          <br />
          We are working to bring you new fitness experiences!
        </p>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            backgroundColor: '#8A2BE2', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;