import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuthPersistence } from './hooks/useAuthPersistence';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthLayout from './components/layout/AuthLayout';
import Layout from './components/layout/Layout';

// Academic pages
import StudentsPage from './pages/students/StudentsPage';
import TeachersPage from './pages/teachers/TeachersPage';
import ClassesPage from './pages/classes/ClassesPage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import ExamsPage from './pages/exams/ExamsPage';

// Management pages
import FeesPage from './pages/fees/FeesPage';
import LiveClassesPage from './pages/live-classes/LiveClassesPage';
import LibraryPage from './pages/library/LibraryPage';
import TransportPage from './pages/transport/TransportPage';
import HostelPage from './pages/hostel/HostelPage';
import EventsPage from './pages/events/EventsPage';

// System pages
import CMSPage from './pages/cms/CMSPage';
import CRMPage from './pages/crm/CRMPage';
import FormBuilderPage from './pages/form-builder/FormBuilderPage';
import AdvancedFormBuilderPage from './pages/form-builder/AdvancedFormBuilderPage';
import ReportsPage from './pages/reports/ReportsPage';
import CommunicationPage from './pages/communication/CommunicationPage';

// Other pages
import InventoryPage from './pages/inventory/InventoryPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Handle auth persistence on app startup
  useAuthPersistence();

  return (
  <QueryClientProvider client={queryClient}>
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Academic Routes */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Layout>
              <StudentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <Layout>
              <TeachersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <Layout>
              <ClassesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <Layout>
              <AssignmentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <Layout>
              <ExamsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Management Routes */}
      <Route
        path="/fees"
        element={
          <ProtectedRoute>
            <Layout>
              <FeesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/live-classes"
        element={
          <ProtectedRoute>
            <Layout>
              <LiveClassesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Layout>
              <LibraryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transport"
        element={
          <ProtectedRoute>
            <Layout>
              <TransportPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hostel"
        element={
          <ProtectedRoute>
            <Layout>
              <HostelPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Layout>
              <EventsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* System Routes */}
      <Route
        path="/cms"
        element={
          <ProtectedRoute>
            <Layout>
              <CMSPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm"
        element={
          <ProtectedRoute>
            <Layout>
              <CRMPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/form-builder"
        element={
          <ProtectedRoute>
            <Layout>
              <FormBuilderPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/form-builder/advanced"
        element={
          <ProtectedRoute>
            <Layout>
              <AdvancedFormBuilderPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <ProtectedRoute>
            <Layout>
              <CommunicationPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Other Routes */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <InventoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  </QueryClientProvider>
  );
};

export default App;