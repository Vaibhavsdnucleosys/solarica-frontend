import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import QuotationRejectionPage from './pages/QuotationRejectionPage';
import QuotationThankYouPage from './pages/QuotationThankYouPage';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Main App component with routing
const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/quotation-feedback/:id" element={<QuotationRejectionPage />} />
        <Route path="/quotation-thank-you" element={<QuotationThankYouPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;

