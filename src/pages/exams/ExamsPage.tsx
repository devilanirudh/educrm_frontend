import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { examsService, Exam } from '../../services/exams';
import { useExams } from '../../hooks/useExams';
import { useForm } from '../../hooks/useForm';
import TailwindFormRenderer from '../../components/form-builder/TailwindFormRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State variables
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localExams, setLocalExams] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>([]);
  
  // Refs for click outside detection
  const columnsMenuRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { 
    exams, 
    isExamsLoading, 
    examsError, 
    refetchExams, 
    createExam, 
    updateExam, 
    deleteExam, 
    isDeletingExam 
  } = useExams({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError } = useForm('exam_form');

  // Visible columns configuration
  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'title', label: 'Title', is_visible_in_listing: true },
      { field_name: 'exam_date', label: 'Exam Date', is_visible_in_listing: true },
      { field_name: 'subject', label: 'Subject', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns
  useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const defaultColumns = visibleColumns.slice(0, 4).map(col => col.field_name);
      setTableVisibleColumns(defaultColumns);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

  // Set local state when React Query data is available
  useEffect(() => {
    if (exams && !localExams) {
      setLocalExams(exams);
    }
  }, [exams, localExams]);

  // Click outside detection for columns menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setShowColumnsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter exams based on search term
  const filteredExams = useMemo(() => {
    if (!searchTerm) {
      return localExams?.exams || exams?.data || [];
    }
    
    const examsData = localExams?.exams || exams?.data || [];
    return examsData.filter((exam: Exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, localExams, exams]);

  // Event handlers
  const handleAddExam = () => {
    setSelectedExam(null);
    setIsFormOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsFormOpen(true);
    setShowUserMenu(null);
  };

  const handleDeleteExam = (exam: Exam) => {
    setExamToDelete(exam);
    setIsDeleteDialogOpen(true);
    setShowUserMenu(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedExam(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (selectedExam) {
        updateExam({ id: selectedExam.id, data });
        setSuccessMessage('Exam updated successfully!');
      } else {
        const result = await examsService.createExamFromDynamicForm(data);
        queryClient.invalidateQueries('exams');
        queryClient.refetchQueries('exams');
        if (localExams) {
          setLocalExams({
            ...localExams,
            exams: [...localExams.exams, result.exam],
            total: localExams.total + 1
          });
        }
        setSuccessMessage('Exam created successfully!');
      }
      handleFormClose();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save exam');
    }
  };

  const handleConfirmDelete = async () => {
    if (!examToDelete) return;

    try {
      setError(null);
      await deleteExam(examToDelete.id);

      if (localExams?.exams) {
        const updatedExams = localExams.exams.filter((e: Exam) => e.id !== examToDelete.id);
        setLocalExams({
          ...localExams,
          exams: updatedExams,
          total: localExams.total - 1
        });
      }

      setSuccessMessage(`Exam ${examToDelete.title} has been successfully deleted.`);
      setIsDeleteDialogOpen(false);
      setExamToDelete(null);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete exam');
      setIsDeleteDialogOpen(false);
      setExamToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setExamToDelete(null);
  };

  // Function to map exam data to form fields
  const mapExamToFormData = (exam: Exam): Record<string, any> => {
    if (!exam || !formSchema) return {};

    const formData: Record<string, any> = {};

    formSchema.fields.forEach(field => {
      let value: any = undefined;

      if (exam.dynamic_data && exam.dynamic_data[field.field_name] !== undefined) {
        value = exam.dynamic_data[field.field_name];
      } else if ((exam as any)[field.field_name] !== undefined) {
        value = (exam as any)[field.field_name];
      }

      if (value !== undefined) {
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

    return formData;
  };

  // Status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'upcoming': { bg: 'bg-info-100', text: 'text-info-800', label: 'Upcoming' },
      'ongoing': { bg: 'bg-warning-100', text: 'text-warning-800', label: 'Ongoing' },
      'completed': { bg: 'bg-success-100', text: 'text-success-800', label: 'Completed' },
      'cancelled': { bg: 'bg-error-100', text: 'text-error-800', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Subjects for filter
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Physical Education', 'Art', 'Music'];

  // Show form not found error with option to create new form
  if (formSchemaError && !isFormSchemaLoading) {
    return (
      <div className="p-6">
        <div className="bg-error-50 border border-error-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-error-900 mb-2">Exam Form Not Found</h2>
          <p className="text-error-700 mb-4">
            The default exam form could not be loaded. This might be because the form hasn't been created yet
            or there's a connection issue with the server.
          </p>
          <button
            onClick={() => navigate('/form-builder/advanced?type=exam')}
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors duration-200"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Form Schema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Exams</h1>
          <p className="mt-1 text-sm text-surface-600">
            Manage examinations, tests, and academic assessments.
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
                      <span className="text-sm text-surface-700">Exam</span>
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
                  
                  {/* Actions are always visible */}
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
            onClick={() => navigate('/form-builder/advanced?type=exam')}
            className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Form
          </button>
          <button
            onClick={handleAddExam}
            disabled={isFormSchemaLoading}
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Exam
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
              placeholder="Search exams..."
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
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Subject</label>
                <select
                  className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
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
          Showing {filteredExams.length} of {(localExams?.total || (exams as any)?.total || exams?.total || 0)} exams
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

      {/* Exams Table - Desktop */}
        {isExamsLoading ? (
        <SkeletonLoader rows={8} />
      ) : filteredExams.length > 0 ? (
        <div className="hidden lg:block bg-white rounded-2xl shadow-soft border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Exam
                  </th>
                  {visibleColumns
                    .filter(col => tableVisibleColumns.includes(col.field_name))
                    .map(col => (
                      <th key={col.field_name} className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}

                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200">
                {filteredExams.map((exam: Exam) => (
                  <tr key={exam.id} className="hover:bg-surface-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-brand-800">
                              {exam.title[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-surface-900">
                            {exam.title}
                          </div>
                                                     <div className="text-sm text-surface-500">{(exam as any).subject || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    {visibleColumns
                      .filter(col => tableVisibleColumns.includes(col.field_name))
                      .map(col => (
                        <td key={col.field_name} className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        {(() => {
                          let value;
                          if (exam.dynamic_data && exam.dynamic_data[col.field_name] !== undefined) {
                            value = exam.dynamic_data[col.field_name];
                            } else if ((exam as any)[col.field_name] !== undefined) {
                              value = (exam as any)[col.field_name];
                            } else {
                              value = '-';
                            }
                            return String(value);
                          })()}
                        </td>
                      ))}

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          className="text-surface-400 hover:text-surface-600"
                          onClick={() => setShowUserMenu(showUserMenu === exam.id ? null : exam.id)}
                        >
                          <EllipsisVerticalIcon className="w-4 h-4" />
                        </button>
                        
                        {showUserMenu === exam.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-surface-200 py-2 z-50">
                            <button
                              onClick={() => handleEditExam(exam)}
                              className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                            >
                              <PencilIcon className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200">
                              <EyeIcon className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeleteExam(exam)}
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
        <div className="hidden lg:block bg-white rounded-2xl shadow-soft border border-surface-200 p-12 text-center">
          <h3 className="text-lg font-medium text-surface-900 mb-2">No exams found</h3>
          <p className="text-surface-600 mb-6">
            {exams?.data ? 'No exams match your search criteria.' : 'Start by adding your first exam.'}
          </p>
          <button
            onClick={handleAddExam}
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors duration-200"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Exam
          </button>
        </div>
      )}

      {/* Exams Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {isExamsLoading ? (
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
          filteredExams.map((exam: Exam) => (
            <div key={exam.id} className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-brand-800">
                          {exam.title[0]}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-surface-900">
                        {exam.title}
                      </h3>
                    </div>

                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-surface-500">Subject</p>
                                             <p className="text-surface-900">{(exam as any).subject || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-surface-500">Exam Date</p>
                      <p className="text-surface-900">{exam.exam_date || 'Not set'}</p>
                    </div>
                    {visibleColumns.slice(0, 2).map(col => (
                      <div key={col.field_name}>
                        <p className="text-surface-500">{col.label}</p>
                        <p className="text-surface-900">
                          {(() => {
                            let value;
                            if (exam.dynamic_data && exam.dynamic_data[col.field_name] !== undefined) {
                              value = exam.dynamic_data[col.field_name];
                            } else if ((exam as any)[col.field_name] !== undefined) {
                            value = (exam as any)[col.field_name];
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
                    onClick={() => setShowUserMenu(showUserMenu === exam.id ? null : exam.id)}
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                  
                  {showUserMenu === exam.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-surface-200 py-2 z-50">
                      <button
                        onClick={() => handleEditExam(exam)}
                        className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200">
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam)}
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
              (exams as any)?.has_prev 
                ? 'text-surface-700 bg-white border-surface-300 hover:bg-surface-50' 
                : 'text-surface-400 bg-surface-100 border-surface-200 cursor-not-allowed'
            }`}
            disabled={!(exams as any)?.has_prev}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, (exams as any)?.pages || 1) }, (_, i) => {
            const pageNum = i + 1;
            const isCurrentPage = pageNum === ((exams as any)?.page || 1);
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
              (exams as any)?.has_next 
                ? 'text-surface-700 bg-white border-surface-300 hover:bg-surface-50' 
                : 'text-surface-400 bg-surface-100 border-surface-200 cursor-not-allowed'
            }`}
            disabled={!(exams as any)?.has_next}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Exam Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900">
          {selectedExam
            ? `Edit Exam - ${selectedExam.title}`
            : 'Add New Exam'
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
              initialData={selectedExam ? mapExamToFormData(selectedExam) : undefined}
              onCancel={handleFormClose}
                isEditMode={!!selectedExam}
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
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Delete Exam</h3>
            <p className="text-surface-600 mb-6">
              Are you sure you want to delete {examToDelete ? examToDelete.title : 'this exam'}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeletingExam}
                className="px-4 py-2 text-sm font-medium text-surface-700 bg-white border border-surface-300 rounded-lg hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeletingExam}
                className="px-4 py-2 text-sm font-medium text-white bg-error-600 border border-transparent rounded-lg hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingExam ? 'Deleting...' : 'Delete Exam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsPage;
