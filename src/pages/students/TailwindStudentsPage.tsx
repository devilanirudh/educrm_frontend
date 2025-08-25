import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  CogIcon,
  AdjustmentsHorizontalIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useStudents } from '../../hooks/useStudents';
import { useForm } from '../../hooks/useForm';
import { studentsService, Student } from '../../services/students';
import TailwindFormRenderer from '../../components/form-builder/TailwindFormRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { startImpersonation } from '../../store/authSlice';
import { authService } from '../../services/auth';
import { tokenUtils } from '../../services/auth';



const TailwindStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Debug logging
  console.log('🔍 StudentsPage - Current user:', user);
  console.log('🔍 StudentsPage - User role:', user?.role);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localStudents, setLocalStudents] = useState<any>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<number | null>(null);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const columnsMenuRef = useRef<HTMLDivElement>(null);

  // Close columns menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setShowColumnsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Use the actual API hooks
  const { 
    students, 
    isStudentsLoading, 
    studentsError, 
    deleteStudent, 
    isDeletingStudent,
    updateStudent
  } = useStudents({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError, isFormSchemaError } = useForm('student_form');

  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>(['student', 'student_id', 'academic_year', 'roll_number', 'section', 'status', 'actions']);

  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'student_id', label: 'Student ID', is_visible_in_listing: true },
      { field_name: 'academic_year', label: 'Academic Year', is_visible_in_listing: true },
      { field_name: 'roll_number', label: 'Roll Number', is_visible_in_listing: true },
      { field_name: 'section', label: 'Section', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns when form schema changes (only on first load)
  React.useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const allColumnIds = ['student', ...visibleColumns.map(col => col.field_name), 'status', 'actions'];
      setTableVisibleColumns(allColumnIds);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

  // Set local state when React Query data is available
  React.useEffect(() => {
    if (students && !localStudents) {
      setLocalStudents(students);
      console.log('Setting local students from React Query:', students);
    }
  }, [students, localStudents]);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    // Handle both API response structures
    const studentsData = localStudents?.students || (students as any)?.students || students?.data || [];
    return studentsData.filter((student: Student) => {
      const matchesSearch = student.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [localStudents, students, searchTerm]);

  // Get unique classes for filter
  const classes = Array.from(new Set(
    (localStudents?.students || (students as any)?.students || students?.data || []).map((student: Student) => student.current_class).filter(Boolean)
  )) as string[];

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-success-100 text-success-800' 
          : 'bg-surface-100 text-surface-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedStudent(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (selectedStudent) {
        updateStudent({ id: selectedStudent.id, data });
        setSuccessMessage('Student updated successfully!');
      } else {
        // Use the dynamic form endpoint for new students
        const result = await studentsService.createStudentFromDynamicForm(data);
        // Invalidate the students query to refresh the list
        queryClient.invalidateQueries('students');
        // Also refetch the data immediately
        queryClient.refetchQueries('students');
        // Update local state as fallback
        if (localStudents) {
          setLocalStudents({
            ...localStudents,
            students: [...localStudents.students, result.student],
            total: localStudents.total + 1
          });
        }
        setSuccessMessage('Student created successfully!');
      }
      handleFormClose();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
    }
  };

  // Function to map student data to form fields
  const mapStudentToFormData = (student: Student): Record<string, any> => {
    if (!student || !formSchema) return {};

    const formData: Record<string, any> = {};

    // Map form fields to student data
    formSchema.fields.forEach(field => {
      let value: any = undefined;

      // First check dynamic_data (custom form fields)
      if (student.dynamic_data && student.dynamic_data[field.field_name] !== undefined) {
        value = student.dynamic_data[field.field_name];
      }
      // Then check direct student properties
      else if ((student as any)[field.field_name] !== undefined) {
        value = (student as any)[field.field_name];
      }
      // Finally check user properties for user-related fields
      else if (student.user && (student.user as any)[field.field_name] !== undefined) {
        value = (student.user as any)[field.field_name];
      }

      // Only add the value if it's not undefined
      if (value !== undefined) {
        // Format date values for HTML date input (YYYY-MM-DD)
        if (field.field_type === 'date' && value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            formData[field.field_name] = date.toISOString().split('T')[0];
          } else {
            formData[field.field_name] = value;
          }
        } else {
          formData[field.field_name] = value;
        }
      }
    });

    console.log('🔍 Mapping student to form data:', {
      student,
      formSchema: formSchema.fields.map(f => f.field_name),
      mappedData: formData
    });

    return formData;
  };

  const handleEditStudent = (student: Student) => {
    console.log('🔍 handleEditStudent called with student:', student);
    const mappedData = mapStudentToFormData(student);
    console.log('🔍 Mapped data for form:', mappedData);
    setSelectedStudent(student);
    setFormOpen(true);
    setShowUserMenu(null);
  };

  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
    setShowUserMenu(null);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setError(null);
      await deleteStudent(studentToDelete.id);

      // Update local state immediately for better UX
      if (localStudents?.students) {
        const updatedStudents = localStudents.students.filter((s: Student) => s.id !== studentToDelete.id);
        setLocalStudents({
          ...localStudents,
          students: updatedStudents,
          total: localStudents.total - 1
        });
      }

      setSuccessMessage(`Student ${studentToDelete.user.first_name} ${studentToDelete.user.last_name} has been successfully deactivated.`);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleBecomeUser = async (userId: number, userType: string) => {
    try {
      const response = await authService.impersonateUser(userId);
      
      console.log('🎭 Impersonation response:', response);
      console.log('🎭 Response data structure:', {
        access_token: response.access_token,
        impersonated_user: response.impersonated_user,
        original_user: response.original_user,
        session_id: response.session_id
      });
      
      // Store the impersonation session token
      tokenUtils.setTokens(response.access_token, tokenUtils.getRefreshToken() || '');
      
      // Store original user data in localStorage for page refresh recovery
      localStorage.setItem('originalUser', JSON.stringify(response.original_user));
      localStorage.setItem('isImpersonating', 'true');
      
      // Update Redux store with impersonated user data
      const impersonationAction = {
        impersonatedUser: response.impersonated_user,
        originalUser: response.original_user,
        token: response.access_token
      };
      
      console.log('🎭 Dispatching impersonation action:', impersonationAction);
      console.log('🎭 Impersonated user data:', impersonationAction.impersonatedUser);
      console.log('🎭 Original user data:', impersonationAction.originalUser);
      
      dispatch(startImpersonation(impersonationAction));
      
      console.log('✅ Redux store updated with impersonated user:', response.impersonated_user);
      
      // Navigate to dashboard - the navigation should automatically update based on the new user role
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to impersonate user:', error);
      setError('Failed to impersonate user. Please try again.');
    }
  };

  const handleEditForm = () => {
    // Navigate to advanced form builder
    navigate('/form-builder/advanced?type=student');
  };

  // Show form not found error with option to create new form
  if (isFormSchemaError && !isFormSchemaLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-error-50 border border-error-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-error-900 mb-4">Student Form Not Found</h2>
          <p className="text-error-700 mb-4">
            The default student form could not be loaded. This might be because:
          </p>
          <ul className="list-disc list-inside text-error-700 mb-6 space-y-1">
            <li>The form hasn't been created yet</li>
            <li>There's a connection issue with the server</li>
          </ul>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="bg-white border border-surface-200 rounded-xl p-4 cursor-pointer hover:shadow-soft transition-shadow duration-200"
              onClick={handleEditForm}
            >
              <div className="flex items-center gap-3">
                <CogIcon className="w-6 h-6 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-surface-900">Edit Form Schema</h3>
                  <p className="text-sm text-surface-600">Access the advanced form builder to modify the student form</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  if (studentsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 mb-4">Error Loading Students</h2>
          <p className="text-surface-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const hasStudentsData = (localStudents?.students && localStudents.students.length > 0) || 
                         ((students as any)?.students && (students as any).students.length > 0) ||
                         (students?.data && students.data.length > 0);

  // Debug logging
  console.log('Students Debug:', {
    students,
    localStudents,
    hasStudentsData,
    studentsData: students?.data,
    localStudentsData: localStudents?.students,
    filteredStudentsLength: filteredStudents.length
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Students</h1>
          <p className="mt-1 text-sm text-surface-600">
            Manage student information, enrollment, and academic records.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative" ref={columnsMenuRef}>
            <button 
              className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200"
              onClick={() => setShowColumnsMenu(!showColumnsMenu)}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              Columns
            </button>
            
            {/* Column visibility menu */}
            {showColumnsMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-surface-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-surface-200">
                  <p className="text-sm font-medium text-surface-900">Visible Columns</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {/* Base columns that are always visible */}
                  <div className="px-4 py-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={true}
                        disabled={true}
                        className="rounded border-surface-300 text-brand-600 focus:ring-brand-500 mr-2 opacity-50"
                      />
                      <span className="text-sm text-surface-700">Student</span>
                    </label>
                  </div>
                  
                  {/* Dynamic columns */}
                  {visibleColumns.map((col) => (
                    <div key={col.field_name} className="px-4 py-2">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={tableVisibleColumns.includes(col.field_name)}
                          onChange={() => {
                            const newColumns = tableVisibleColumns.includes(col.field_name)
                              ? tableVisibleColumns.filter(id => id !== col.field_name)
                              : [...tableVisibleColumns, col.field_name];
                            setTableVisibleColumns(newColumns);
                          }}
                          className="rounded border-surface-300 text-brand-600 focus:ring-brand-500 mr-2"
                        />
                        <span className="text-sm text-surface-700">{col.label}</span>
                      </label>
                    </div>
                  ))}
                  
                  {/* Status and Actions are always visible */}
                  <div className="px-4 py-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={true}
                        disabled={true}
                        className="rounded border-surface-300 text-brand-600 focus:ring-brand-500 mr-2 opacity-50"
                      />
                      <span className="text-sm text-surface-700">Status</span>
                    </label>
                  </div>
                  <div className="px-4 py-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={true}
                        disabled={true}
                        className="rounded border-surface-300 text-brand-600 focus:ring-brand-500 mr-2 opacity-50"
                      />
                      <span className="text-sm text-surface-700">Actions</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200"
            onClick={handleEditForm}
          >
            <CogIcon className="w-4 h-4 mr-2" />
            Edit Form
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors duration-200"
            onClick={handleAddStudent}
            disabled={isFormSchemaLoading}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-error-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-error-500 hover:text-error-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-success-50 border border-success-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-success-700">{successMessage}</p>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-success-500 hover:text-success-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-surface-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Class</label>
                <select
                  className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="all">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-600">
          Showing {filteredStudents.length} of {(localStudents?.total || (students as any)?.total || students?.total || 0)} students
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-surface-600">View:</span>
          <select className="text-sm border border-surface-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option>10 per page</option>
            <option>25 per page</option>
            <option>50 per page</option>
          </select>
        </div>
      </div>

      {/* Students Table - Desktop */}
      {isStudentsLoading ? (
        <SkeletonLoader rows={8} />
      ) : hasStudentsData ? (
        <div className="hidden lg:block bg-white rounded-2xl shadow-soft border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Student
                  </th>
                  {visibleColumns
                    .filter(col => tableVisibleColumns.includes(col.field_name))
                    .map(col => (
                      <th key={col.field_name} className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200">
                {filteredStudents.map((student: Student) => (
                  <tr key={student.id} className="hover:bg-surface-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-brand-800">
                              {student.user.first_name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-surface-900">
                            {student.user.first_name} {student.user.last_name}
                          </div>
                          <div className="text-sm text-surface-500">{student.user.email}</div>
                        </div>
                      </div>
                    </td>
                    {visibleColumns
                      .filter(col => tableVisibleColumns.includes(col.field_name))
                      .map(col => (
                        <td key={col.field_name} className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                          {(() => {
                            let value;
                            // First check dynamic_data
                            if (student.dynamic_data && student.dynamic_data[col.field_name] !== undefined) {
                              value = student.dynamic_data[col.field_name];
                            }
                            // Then check direct student properties
                            else if ((student as any)[col.field_name] !== undefined) {
                              value = (student as any)[col.field_name];
                            }
                            // Finally check user properties for user-related fields
                            else if (student.user && (student.user as any)[col.field_name] !== undefined) {
                              value = (student.user as any)[col.field_name];
                            }
                            else {
                              value = '-';
                            }
                            
                            // Convert to string to avoid React warnings
                            return String(value);
                          })()}
                        </td>
                      ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          className="text-surface-400 hover:text-surface-600"
                          onClick={() => setShowUserMenu(showUserMenu === student.id ? null : student.id)}
                        >
                          <EllipsisVerticalIcon className="w-4 h-4" />
                        </button>
                        
                        {showUserMenu === student.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-surface-200 py-2 z-50">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                            >
                              <PencilIcon className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200">
                              <EyeIcon className="w-4 h-4 mr-2" />
                              View Details
                            </button>

                            {(user?.role === 'super_admin' || user?.role === 'admin') && (
                              <button
                                onClick={() => handleBecomeUser(student.user.id, 'student')}
                                className="w-full flex items-center px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 transition-colors duration-200 border-t border-gray-100"
                              >
                                <UserIcon className="w-4 h-4 mr-2" />
                                Become Student
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteStudent(student)}
                              className="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors duration-200"
                            >
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No students found</h3>
          <p className="text-surface-600">
            {students?.data ? 'No students match your search criteria.' : 'Start by adding your first student.'}
          </p>
        </div>
      )}

      {/* Students Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {isStudentsLoading ? (
          // Mobile skeleton loader
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-surface-200 mr-3"></div>
                      <div className="h-6 w-32 bg-surface-200 rounded"></div>
                    </div>
                    <div className="h-6 w-16 bg-surface-200 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 w-12 bg-surface-200 rounded mb-1"></div>
                      <div className="h-4 w-24 bg-surface-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-4 w-12 bg-surface-200 rounded mb-1"></div>
                      <div className="h-4 w-20 bg-surface-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-surface-200 rounded mb-1"></div>
                      <div className="h-4 w-28 bg-surface-200 rounded"></div>
                    </div>
                    <div>
                      <div className="h-4 w-20 bg-surface-200 rounded mb-1"></div>
                      <div className="h-4 w-16 bg-surface-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="h-8 w-8 bg-surface-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredStudents.map((student: Student) => (
          <div key={student.id} className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-brand-800">
                        {student.user.first_name[0]}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900">
                      {student.user.first_name} {student.user.last_name}
                    </h3>
                  </div>
                  {getStatusBadge(student.is_active)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-surface-500">Email</p>
                    <p className="text-surface-900">{student.user.email}</p>
                  </div>
                  <div>
                    <p className="text-surface-500">Class</p>
                    <p className="text-surface-900">{student.current_class?.name || 'N/A'}</p>
                  </div>
                  {visibleColumns.slice(0, 2).map(col => (
                    <div key={col.field_name}>
                      <p className="text-surface-500">{col.label}</p>
                      <p className="text-surface-900">
                        {(() => {
                          let value;
                          if (student.dynamic_data && student.dynamic_data[col.field_name] !== undefined) {
                            value = student.dynamic_data[col.field_name];
                          } else if ((student as any)[col.field_name] !== undefined) {
                            value = (student as any)[col.field_name];
                          } else if (student.user && (student.user as any)[col.field_name] !== undefined) {
                            value = (student.user as any)[col.field_name];
                          } else {
                            value = '-';
                          }
                          return String(value);
                        })()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ml-4">
                <button 
                  className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100"
                  onClick={() => setShowUserMenu(showUserMenu === student.id ? null : student.id)}
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
                
                {showUserMenu === student.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-surface-200 py-2 z-50">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </button>

                    {(user?.role === 'super_admin' || user?.role === 'admin') && (
                      <button
                        onClick={() => handleBecomeUser(student.user.id, 'student')}
                        className="w-full flex items-center px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 transition-colors duration-200 border-t border-gray-100"
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Become Student
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteStudent(student)}
                      className="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors duration-200"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className={`px-3 py-2 text-sm font-medium rounded-lg border ${
              (students as any)?.has_prev 
                ? 'text-surface-700 bg-white border-surface-300 hover:bg-surface-50' 
                : 'text-surface-400 bg-surface-100 border-surface-200 cursor-not-allowed'
            }`}
            disabled={!(students as any)?.has_prev}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, (students as any)?.pages || 1) }, (_, i) => {
            const pageNum = i + 1;
            const isCurrentPage = pageNum === ((students as any)?.page || 1);
            return (
              <button
                key={pageNum}
                className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                  isCurrentPage
                    ? 'text-white bg-brand-600 border-brand-600'
                    : 'text-surface-700 bg-white border-surface-300 hover:bg-surface-50'
                }`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            className={`px-3 py-2 text-sm font-medium rounded-lg border ${
              (students as any)?.has_next 
                ? 'text-surface-700 bg-white border-surface-300 hover:bg-surface-50' 
                : 'text-surface-400 bg-surface-100 border-surface-200 cursor-not-allowed'
            }`}
            disabled={!(students as any)?.has_next}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Student Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900">
                {selectedStudent 
                  ? `Edit Student - ${selectedStudent.user.first_name} ${selectedStudent.user.last_name}`
                  : 'Add New Student'
                }
              </h3>
              <button
                onClick={handleFormClose}
                className="text-surface-400 hover:text-surface-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {formSchema ? (
              <TailwindFormRenderer
                schema={formSchema}
                onSubmit={handleFormSave}
                initialData={selectedStudent ? mapStudentToFormData(selectedStudent) : undefined}
                onCancel={handleFormClose}
                isEditMode={!!selectedStudent}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Delete Student</h3>
            <p className="text-surface-600 mb-6">
              Are you sure you want to delete {studentToDelete ? `${studentToDelete.user.first_name} ${studentToDelete.user.last_name}` : 'this student'}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-surface-700 bg-surface-100 rounded-lg hover:bg-surface-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeletingStudent}
                className="px-4 py-2 text-sm font-medium text-white bg-error-600 rounded-lg hover:bg-error-700 disabled:opacity-50"
              >
                {isDeletingStudent ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailwindStudentsPage;
