import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { Class } from '../services/classes';

interface TeacherProfile {
  id: number;
  employee_id: string;
  user_id: number;
  qualifications: string;
  specialization: string;
  experience: number;
  is_active: boolean;
  assigned_classes: Class[];
  total_classes: number;
}

export const useTeacherClasses = () => {
  const queryClient = useQueryClient();

  // Fetch teacher profile with assigned classes
  const {
    data: teacherProfile,
    isLoading: isTeacherProfileLoading,
    error: teacherProfileError,
    refetch: refetchTeacherProfile
  } = useQuery<TeacherProfile>({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      const response = await api.get('/teachers/me/profile');
      return response.data;
    },
    enabled: true, // Always enabled for teachers
  });

  return {
    teacherProfile,
    isTeacherProfileLoading,
    teacherProfileError,
    refetchTeacherProfile,
    assignedClasses: teacherProfile?.assigned_classes || [],
    totalClasses: teacherProfile?.total_classes || 0
  };
};
