import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';

import { RootState, useAppDispatch } from './store';
import { clearNotification } from './store/uiSlice';
import { initializeAuth } from './store/authSlice';

// Layout Components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for better performance
const StudentsPage = React.lazy(() => import('./pages/students/StudentsPage'));
const TeachersPage = React.lazy(() => import('./pages/teachers/TeachersPage'));
const ClassesPage = React.lazy(() => import('./pages/classes/ClassesPage'));
const AssignmentsPage = React.lazy(() => import('./pages/assignments/AssignmentsPage'));
const ExamsPage = React.lazy(() => import('./pages/exams/ExamsPage'));
const FeesPage = React.lazy(() => import('./pages/fees/FeesPage'));
const LiveClassesPage = React.lazy(() => import('./pages/live-classes/LiveClassesPage'));
const LibraryPage = React.lazy(() => import('./pages/library/LibraryPage'));
const TransportPage = React.lazy(() => import('./pages/transport/TransportPage'));
const HostelPage = React.lazy(() => import('./pages/hostel/HostelPage'));
const EventsPage = React.lazy(() => import('./pages/events/EventsPage'));
const CMSPage = React.lazy(() => import('./pages/cms/CMSPage'));
const CRMPage = React.lazy(() => import('./pages/crm/CRMPage'));
const ReportsPage = React.lazy(() => import('./pages/reports/ReportsPage'));
const CommunicationPage = React.lazy(() => import('./pages/communication/CommunicationPage'));

function App() {
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading } = useSelector((state: RootState) => state.auth);
  const { notification } = useSelector((state: RootState) => state.ui);

  // Initialize authentication on app start
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Handle notification close
  const handleNotificationClose = () => {
    dispatch(clearNotification());
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route index element={<Navigate to="login" replace />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Dashboard Routes */}
                      <Route path="/" element={<DashboardRouter />} />
                      <Route path="/dashboard" element={<DashboardRouter />} />

                      {/* Student Management */}
                      <Route path="/students/*" element={<StudentsPage />} />

                      {/* Teacher Management */}
                      <Route path="/teachers/*" element={<TeachersPage />} />

                      {/* Class Management */}
                      <Route path="/classes/*" element={<ClassesPage />} />

                      {/* Academic Management */}
                      <Route path="/assignments/*" element={<AssignmentsPage />} />
                      <Route path="/exams/*" element={<ExamsPage />} />

                      {/* Financial Management */}
                      <Route path="/fees/*" element={<FeesPage />} />

                      {/* E-Learning */}
                      <Route path="/live-classes/*" element={<LiveClassesPage />} />

                      {/* Other Modules */}
                      <Route path="/library/*" element={<LibraryPage />} />
                      <Route path="/transport/*" element={<TransportPage />} />
                      <Route path="/hostel/*" element={<HostelPage />} />
                      <Route path="/events/*" element={<EventsPage />} />

                      {/* CMS & CRM */}
                      <Route path="/cms/*" element={<CMSPage />} />
                      <Route path="/crm/*" element={<CRMPage />} />

                      {/* Reports & Communication */}
                      <Route path="/reports/*" element={<ReportsPage />} />
                      <Route path="/communication/*" element={<CommunicationPage />} />

                      {/* Fallback for unknown routes */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </React.Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth/login"} replace />} />
        </Routes>

        {/* Global Notification Snackbar */}
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {notification ? (
            <Alert
              onClose={handleNotificationClose}
              severity={notification.type}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          ) : undefined}
        </Snackbar>
      </div>
    </ErrorBoundary>
  );
}

// Dashboard Router Component
function DashboardRouter() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
    case 'super_admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <AdminDashboard />;
  }
}

export default App;
