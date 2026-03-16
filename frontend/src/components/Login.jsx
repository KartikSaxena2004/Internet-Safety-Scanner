import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export default function Login({ setView }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
         <Shield size={48} color="var(--accent-primary)" />
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
      <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign in to access your scan history.</p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: '1rem' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
        Don't have an account? <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setView('register')}>Sign up</span>
      </p>
    </div>
  );
}
