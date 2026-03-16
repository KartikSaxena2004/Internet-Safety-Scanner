import React, { useState, useContext } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function ScannerForm({ onScanResult, onError }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    onError(null);
    onScanResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/scan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan URL');
      }

      onScanResult(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setIsLoading(false);
      setUrl('');
    }
  };

  return (
    <div className="glass-panel scanner-form-container">
      <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Scan a URL</h2>
      <p className="subtitle">Enter any website link to analyze its security footprint.</p>
      
      <form onSubmit={handleSubmit} className="url-input-wrapper">
        <input
          type="text"
          placeholder="e.g. https://example.com/login"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !url.trim()}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          <span>{isLoading ? 'Scanning...' : 'Analyze'}</span>
        </button>
      </form>
    </div>
  );
}
