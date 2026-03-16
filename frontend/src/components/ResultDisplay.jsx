import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export default function ResultDisplay({ scanData }) {
  if (!scanData) return null;

  const { riskScore, explanations, url } = scanData;
  
  let riskLevel = 'safe';
  let Icon = ShieldCheck;
  let statusText = 'Safe';

  if (riskScore >= 60) {
    riskLevel = 'danger';
    Icon = ShieldAlert;
    statusText = 'High Risk';
  } else if (riskScore >= 30) {
    riskLevel = 'warning';
    Icon = AlertTriangle;
    statusText = 'Suspicious';
  }

  return (
    <div className={`glass-panel result-container score-${riskLevel}`}>
      <div className="score-hud">
        <div className="score-circle">
          {riskScore}
        </div>
        <div className="score-details">
          <h2>{statusText}</h2>
          <p className="subtitle" style={{ wordBreak: 'break-all' }}>Analysis for: {url}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Info size={20} />
        Risk Factors & Observations
      </h3>
      
      <div className="explanation-list">
        {explanations.map((exp, idx) => (
          <div key={idx} className="explanation-card">
            <span>{exp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
