import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuthPersistence } from './hooks/useAuthPersistence';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import TailwindAdminDashboard from './pages/dashboard/TailwindAdminDashboard';
import TailwindTeacherDashboard from './pages/dashboard/TailwindTeacherDashboard';
import TailwindStudentDashboard from './pages/dashboard/TailwindStudentDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthLayout from './components/layout/AuthLayout';
import TailwindLayout from './components/layout/TailwindLayout';
import GlobalLoader from './components/common/GlobalLoader';

// Academic pages
import StudentsPage from './pages/students/TailwindStudentsPage';
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
import NotificationsPage from './pages/notifications/NotificationsPage';
import RoleManagementPage from './pages/admin/RoleManagementPage';
import AttendancePage from './pages/attendance/AttendancePage';
import StudentAttendancePage from './pages/attendance/StudentAttendancePage';
import TeacherClassesAttendance from './components/attendance/TeacherClassesAttendance';
import DynamicDashboard from './components/common/DynamicDashboard';
import StudentClassesPage from './pages/classes/StudentClassesPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Handle auth persistence on app startup
  useAuthPersistence();

  return (
  <QueryClientProvider client={queryClient}>
    <GlobalLoader />
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

      {/* Dynamic Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <DynamicDashboard />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      {/* Role-based Dashboard Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <TailwindAdminDashboard />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <TailwindTeacherDashboard />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <TailwindStudentDashboard />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      {/* Academic Routes */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <StudentsPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <TeachersPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <ClassesPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <AssignmentsPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <ExamsPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Management Routes */}
      <Route
        path="/role-management"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <RoleManagementPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      {/* Management Routes */}
      <Route
        path="/fees"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <FeesPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/live-classes"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <LiveClassesPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <LibraryPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transport"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <TransportPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hostel"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <HostelPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <EventsPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      {/* System Routes */}
      <Route
        path="/cms"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <CMSPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <CRMPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/form-builder"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <FormBuilderPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/form-builder/advanced"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <AdvancedFormBuilderPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <ReportsPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <CommunicationPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      {/* Attendance Routes */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <TeacherClassesAttendance />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-attendance"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <StudentAttendancePage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-classes"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <StudentClassesPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <NotificationsPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />

      {/* Other Routes */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <TailwindLayout>
              <InventoryPage />
            </TailwindLayout>
          </ProtectedRoute>
        }
      />
      </Routes>
  </QueryClientProvider>
  );
};

export default App;