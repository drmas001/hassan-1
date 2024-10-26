import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDetails from './pages/PatientDetails';
import AddPatient from './pages/AddPatient';
import DischargePatient from './pages/DischargePatient';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './components/layout/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return !user ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/welcome" element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />

        {/* Private routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/patients/:id" element={
          <PrivateRoute>
            <Layout>
              <PatientDetails />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/add-patient" element={
          <PrivateRoute>
            <Layout>
              <AddPatient />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/discharge/:id" element={
          <PrivateRoute>
            <Layout>
              <DischargePatient />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/change-password" element={
          <PrivateRoute>
            <Layout>
              <ChangePassword />
            </Layout>
          </PrivateRoute>
        } />

        {/* Redirect root to welcome for non-authenticated users */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
}