import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Support = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container" style={{ minHeight: '100vh', background: 'white', paddingTop: '60px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', padding: '24px' }}>
        <h2 style={{ color: '#8A2BE2', marginBottom: '18px' }}>Support</h2>

        <p style={{ color: '#444', fontSize: '16px', marginBottom: '18px', lineHeight: '1.6' }}>
          Do you have questions, issues, or suggestions? Contact us and we’ll assist you as soon as possible.
        </p>

        <p style={{ color: '#555', fontSize: '15px', marginBottom: '18px' }}>
          Email: <a href="mailto:support@hyperfit.com" style={{ color: '#8A2BE2' }}>support@hyperfit.com</a>
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ marginBottom: '18px' }}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={form.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />

            <textarea
              name="message"
              placeholder="How can we help you?"
              value={form.message}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', minHeight: '80px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />

            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: '#8A2BE2', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 'bold', width: '100%' }}
            >
              Send Message
            </button>
          </form>
        ) : (
          <div style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: '18px' }}>
            Your message has been sent! We will contact you soon.
          </div>
        )}

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

export default Support;
