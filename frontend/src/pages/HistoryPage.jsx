import React, { useState } from 'react';
import HistoryDashboard from '../components/HistoryDashboard';

export default function HistoryPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <header style={{ textAlign: 'left', marginBottom: '1rem', animation: 'fadeInDown 0.8s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Scan History</h1>
        <p className="subtitle">Review your previously queried domains and results.</p>
      </header>

      <section style={{ display: 'flex', flex: 1, minHeight: '500px' }}>
        <div style={{ flex: 1 }}>
           <HistoryDashboard refreshTrigger={refreshTrigger} />
        </div>
      </section>
    </div>
  );
}
