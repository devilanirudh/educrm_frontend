import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TailwindAdminDashboard from '../../pages/dashboard/TailwindAdminDashboard';
import TailwindTeacherDashboard from '../../pages/dashboard/TailwindTeacherDashboard';
import TailwindStudentDashboard from '../../pages/dashboard/TailwindStudentDashboard';
import ParentDashboard from '../../pages/dashboard/ParentDashboard';

const DynamicDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Render appropriate dashboard based on user role
  switch (user?.role) {
    case 'super_admin':
    case 'admin':
      return <TailwindAdminDashboard />;
    case 'teacher':
      return <TailwindTeacherDashboard />;
    case 'student':
      return <TailwindStudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      // Default to student dashboard for unknown roles
      return <TailwindStudentDashboard />;
  }
};

export default DynamicDashboard;
