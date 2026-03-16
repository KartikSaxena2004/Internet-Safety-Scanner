import React, { useEffect, useState, useContext } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';

export default function AnalyticsCard({ refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  if (!stats) return <div className="glass-panel analytics-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>Loading stats...</div>;

  const chartData = [
    { name: 'Safe', count: stats.safeScans, fill: 'var(--success)' },
    { name: 'Warning', count: stats.warningScans, fill: 'var(--warning)' },
    { name: 'Danger', count: stats.dangerScans, fill: 'var(--danger)' },
  ];

  return (
    <div className="glass-panel analytics-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '350px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} />
          Safety Overview
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Scans: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{stats.totalScans}</span></p>
      </div>
      
      <div style={{ flex: 1, width: '100%', minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
