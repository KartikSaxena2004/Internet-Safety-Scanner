import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/layout/Sidebar';
import DashboardHome from './pages/DashboardHome';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function MainApp() {
  const { token, loading } = useContext(AuthContext);
  const [authView, setAuthView] = useState('login'); 

  if (loading) {
    return <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // Unauthenticated Flow
  if (!token) {
    return (
      <div className="app-container">
        {authView === 'login' ? <Login setView={setAuthView} /> : <Register setView={setAuthView} />}
      </div>
    );
  }

  // Authenticated Routing Flow
  return (
    <BrowserRouter>
      <ProtectedLayout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProtectedLayout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
