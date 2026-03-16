import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, History, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext);

  const navStyles = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem',
    borderRadius: '8px',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.2s',
    borderLeft: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
  });

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--bg-secondary)',
      backdropFilter: 'var(--glass-blur)',
      borderRight: '1px solid var(--border-color)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem' }}>
        <Shield size={32} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>SafetyScanner</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink to="/" style={navStyles}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/history" style={navStyles}>
          <History size={20} />
          History
        </NavLink>
        <NavLink to="/settings" style={navStyles}>
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap' }}>
          {user?.email}
        </p>
        <button 
          onClick={logout}
          style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--danger)' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
