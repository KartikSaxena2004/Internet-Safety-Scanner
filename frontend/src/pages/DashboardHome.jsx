import React, { useState } from 'react';
import ScannerForm from '../components/ScannerForm';
import ResultDisplay from '../components/ResultDisplay';
import AnalyticsCard from '../components/AnalyticsCard';

export default function DashboardHome() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleScanResult = (data) => {
    setScanResult(data);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ textAlign: 'left', marginBottom: '1rem', animation: 'fadeInDown 0.8s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Dashboard</h1>
        <p className="subtitle">Analyze URLs for phishing patterns and safety signals.</p>
      </header>

      <section>
        <ScannerForm onScanResult={handleScanResult} onError={setError} />
        
        {error && (
          <div className="glass-panel result-container" style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3 style={{ color: 'var(--danger)' }}>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {scanResult && <ResultDisplay scanData={scanResult} />}
      </section>

      <section>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Overview Analytics</h3>
        <AnalyticsCard refreshTrigger={refreshTrigger} />
      </section>
    </div>
  );
}
