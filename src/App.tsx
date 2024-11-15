import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UniverseProvider } from './contexts/UniverseContext';
import { AuthProvider } from './contexts/AuthContext';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { AdminSetup } from './components/AdminSetup/AdminSetup';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return element;
};

const App: React.FC = () => {
  return (
    <UniverseProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route 
              path="/setup" 
              element={
                <ProtectedRoute 
                  element={<AdminSetup />} 
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute 
                  element={<Dashboard />} 
                />
              } 
            />
            <Route path="/" element={<Navigate to="/signin" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </UniverseProvider>
  );
};

export default App;