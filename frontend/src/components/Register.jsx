import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function Register({ setView }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
        return setError('Password must be at least 6 characters');
    }
    setError('');
    setLoading(true);
    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
         <ShieldAlert size={48} color="var(--accent-secondary)" />
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
      <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Start scanning and protecting your data.</p>
      
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
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: '1rem' }}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
        Already have an account? <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setView('login')}>Sign in</span>
      </p>
    </div>
  );
}
