import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ textAlign: 'left', marginBottom: '1rem', animation: 'fadeInDown 0.8s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Settings</h1>
        <p className="subtitle">Manage application preferences and account details.</p>
      </header>

      <div className="dashboard-grid">
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>Display Preferences</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Global Theme</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Toggle between Dark and Light mode</p>
            </div>
            
            <button 
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.8rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </section>

        <section className="glass-panel" style={{ padding: '2rem' }}>
           <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>Account Details</h3>
           
           <div style={{ marginBottom: '1.5rem' }}>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Logged in as</p>
             <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{user?.email}</p>
           </div>

           <button 
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.8rem 1.5rem'
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
        </section>
      </div>
    </div>
  );
}
