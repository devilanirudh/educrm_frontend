import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  liveClassesService, 
  LiveClass, 
  LiveClassCreate, 
  LiveClassJoinResponse,
  ClassAttendance 
} from '../services/liveClasses';
import { useAuth } from './useAuth';

export const useLiveClasses = (skip: number = 0, limit: number = 100) => {
  return useQuery(
    ['liveClasses', skip, limit],
    () => liveClassesService.getLiveClasses(skip, limit),
    {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  );
};

export const useUpcomingLiveClasses = () => {
  return useQuery(
    ['upcomingLiveClasses'],
    () => liveClassesService.getUpcomingLiveClasses(),
    {
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    }
  );
};

export const useLiveClass = (id: number) => {
  return useQuery(
    ['liveClass', id],
    () => liveClassesService.getLiveClass(id),
    {
      enabled: !!id,
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
};

export const useLiveClassInfo = (id: number) => {
  return useQuery(
    ['liveClassInfo', id],
    () => liveClassesService.getLiveClassInfo(id),
    {
      enabled: !!id,
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
};

export const useCreateLiveClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: LiveClassCreate) => liveClassesService.createLiveClass(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['liveClasses']);
        queryClient.invalidateQueries(['upcomingLiveClasses']);
      },
    }
  );
};

export const useUpdateLiveClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: number; data: Partial<LiveClassCreate> }) =>
      liveClassesService.updateLiveClass(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['liveClasses']);
        queryClient.invalidateQueries(['liveClass', id]);
        queryClient.invalidateQueries(['upcomingLiveClasses']);
      },
    }
  );
};

export const useDeleteLiveClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => liveClassesService.deleteLiveClass(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['liveClasses']);
        queryClient.invalidateQueries(['upcomingLiveClasses']);
      },
    }
  );
};

export const useStartLiveClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => liveClassesService.startLiveClass(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['liveClasses']);
        queryClient.invalidateQueries(['liveClass', id]);
        queryClient.invalidateQueries(['upcomingLiveClasses']);
      },
    }
  );
};

export const useEndLiveClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => liveClassesService.endLiveClass(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['liveClasses']);
        queryClient.invalidateQueries(['liveClass', id]);
        queryClient.invalidateQueries(['upcomingLiveClasses']);
      },
    }
  );
};

export const useJoinLiveClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => liveClassesService.joinLiveClass(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['liveClassAttendance', id]);
      },
    }
  );
};

export const useLeaveLiveClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => liveClassesService.leaveLiveClass(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['liveClassAttendance', id]);
      },
    }
  );
};

export const useLiveClassAttendance = (id: number) => {
  return useQuery(
    ['liveClassAttendance', id],
    () => liveClassesService.getLiveClassAttendance(id),
    {
      enabled: !!id,
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
};

export const useLiveClassesByClass = (classId: number) => {
  return useQuery(
    ['liveClassesByClass', classId],
    () => liveClassesService.getLiveClassesByClass(classId),
    {
      enabled: !!classId,
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
};

export const useLiveClassesByTeacher = (teacherId: number) => {
  return useQuery(
    ['liveClassesByTeacher', teacherId],
    () => liveClassesService.getLiveClassesByTeacher(teacherId),
    {
      enabled: !!teacherId,
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
};

// Hook to get user-specific live classes
export const useUserLiveClasses = () => {
  const { user } = useAuth();
  
  return useQuery(
    ['userLiveClasses', user?.id, user?.role],
    async () => {
      if (!user) return [];
      
      if (user.role === 'admin') {
        return liveClassesService.getLiveClasses();
      } else if (user.role === 'teacher') {
        return liveClassesService.getLiveClassesByTeacher(user.id);
      } else if (user.role === 'student') {
        // For students, we'll get all live classes and filter by their class
        const allClasses = await liveClassesService.getLiveClasses();
        // Get student's class_id from the student object
        const studentClassId = user.student?.current_class_id;
        if (studentClassId) {
          return allClasses.filter(liveClass => liveClass.class_id === studentClassId);
        }
        return [];
      }
      
      return [];
    },
    {
      enabled: !!user,
      staleTime: 30 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
};

// Hook to check if user can join a specific live class
export const useCanJoinLiveClass = (liveClass: LiveClass | undefined) => {
  const { user } = useAuth();
  
  if (!liveClass || !user) return false;
  
  return liveClassesService.canJoinClass(liveClass, user.role);
};

// Hook to check if user can manage a specific live class
export const useCanManageLiveClass = (liveClass: LiveClass | undefined) => {
  const { user } = useAuth();
  
  if (!liveClass || !user) return false;
  
  return liveClassesService.canManageClass(liveClass, user.id, user.role);
};
