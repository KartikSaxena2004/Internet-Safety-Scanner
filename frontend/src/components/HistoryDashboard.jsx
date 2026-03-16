import React, { useEffect, useState, useContext } from 'react';
import { Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function HistoryDashboard({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="glass-panel history-card">Loading history...</div>;

  return (
    <div className="glass-panel history-card">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Clock size={20} />
        Recent Scans
      </h3>
      
      {history.length === 0 ? (
        <p className="subtitle">No recent scans found.</p>
      ) : (
        <div className="history-list">
          {history.map(item => {
            const date = new Date(item.scannedAt).toLocaleString();
            let badgeClass = 'score-safe';
            let badgeText = 'Safe';
            
            if (item.riskScore >= 60) {
              badgeClass = 'score-danger';
              badgeText = 'Danger';
            } else if (item.riskScore >= 30) {
              badgeClass = 'score-warning';
              badgeText = 'Warning';
            }

            return (
              <div key={item._id} className="history-item">
                <div style={{ flex: 1, minWidth: 0, marginRight: '1rem' }}>
                  <div className="history-url">{item.url}</div>
                  <div className="history-date">{date}</div>
                </div>
                <div className="history-score-badge" style={{
                  backgroundColor: `var(--${badgeClass.split('-')[1]})`,
                  color: 'white'
                }}>
                  {badgeText} {item.riskScore}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
