import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AdminClassesView from './AdminClassesView';
import TeacherClassesView from './TeacherClassesView';

const ClassesPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isTeacher = Boolean(user?.role === 'teacher');

  if (isTeacher) {
    return <TeacherClassesView />;
  }

  return <AdminClassesView />;
};

export default ClassesPage;
