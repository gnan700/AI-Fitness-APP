import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';
import userService from '../services/userService';
import { CiRuler } from 'react-icons/ci';
import { FaWeightScale } from 'react-icons/fa6';
import { GoGoal } from 'react-icons/go';
import toastService from '../services/toastService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUser();
        setUser(userData);
      } catch (error) {
        toastService.showError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile', { state: { reload: true } });
  };

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #8A2BE2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#666' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        width: '100%', 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>Unable to load profile</p>
          <button
            onClick={handleBack}
            style={{
              backgroundColor: '#8A2BE2',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white', position: 'relative' }}>
      
      {/* FIXED HEADER */}
      <header
        style={{
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          zIndex: 999,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            height: '60px',
            maxWidth: '450px',
            margin: '0 auto',
          }}
        >
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h2 style={{ flex: 1, textAlign: 'center', margin: 0, color: '#8A2BE2' }}>HyperFit</h2>

          <div style={{ width: '24px' }}></div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div
        style={{
          margin: '60px auto 80px',
          maxWidth: '450px',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ 
          width: '100%', 
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '16px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#8A2BE2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ 
                margin: '0 0 4px 0', 
                color: '#333',
                fontSize: '24px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '270px'
              }}>{user.name}</h2>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user.level}</p>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <CiRuler color="#8A2BE2" size={24}/>
              <p style={{ margin: '4px 0 0 0', color: '#333', fontWeight: '500' }}>{user.height} cm</p>
              <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>Height</p>
            </div>

            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
             <FaWeightScale color="#8A2BE2" size={24}/>
              <p style={{ margin: '4px 0 0 0', color: '#333', fontWeight: '500' }}>{user.weight} kg</p>
              <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>Weight</p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px' }}>
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#8A2BE2" strokeWidth="2"/>
                <path d="M22 6L12 13L2 6" stroke="#8A2BE2" strokeWidth="2"/>
              </svg>
              <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <GoGoal color="#8A2BE2" size={20}/>
              <p style={{ margin: 0, color: '#666', marginLeft: '10px' }}>{user.goal}</p>
            </div>

            {user.allergies && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px' }}>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8A2BE2" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="#8A2BE2" strokeWidth="2"/>
                </svg>
                <p style={{ margin: 0, color: '#666' }}>{user.allergies}</p>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{
              width: '100%',
              backgroundColor: '#8A2BE2',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* BOTTOM NAVBAR */}
      <nav
        className="nav-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0',
          zIndex: 999,
          maxWidth: '450px',
          margin: '0 auto',
        }}
      >
        <Link to="/dashboard" className="nav-item" style={{ textAlign: 'center' }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Home</span>
        </Link>

        <Link to="/coming-soon" className="nav-item" style={{ textAlign: 'center' }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#333"
              strokeWidth="2"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#333"
              strokeWidth="2"
            />
          </svg>
          <span>Search</span>
        </Link>

        <Link to="/user-profile" className="nav-item active" style={{ textAlign: 'center' }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="#8A2BE2"
              strokeWidth="2"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="#8A2BE2"
              strokeWidth="2"
            />
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default UserProfile;
