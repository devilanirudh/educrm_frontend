import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PlusIcon, PencilIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useClasses } from '../../hooks/useClasses';
import { useForm } from '../../hooks/useForm';
import ClassesTable from './components/ClassesTable';
import ClassesSearch from './components/ClassesSearch';
import ClassesForm from './components/ClassesForm';

const AdminClassesView: React.FC = () => {
  const navigate = useNavigate();
  const [page] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>([]);
  
  // Refs for click outside detection
  const columnsMenuRef = useRef<HTMLDivElement>(null);

  const { 
    classes, 
    isClassesLoading, 
    classesError, 
    refetchClasses,
    createClass, 
    updateClass, 
    deleteClass,
    toggleClassStatus
  } = useClasses({
    page,
    per_page: 10,
    search: searchTerm || undefined,
  });

  const { formSchema } = useForm('class_form');

  // Visible columns configuration
  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'name', label: 'Class Name', is_visible_in_listing: true },
      { field_name: 'grade_level', label: 'Grade Level', is_visible_in_listing: true },
      { field_name: 'section', label: 'Section', is_visible_in_listing: true },
      { field_name: 'academic_year', label: 'Academic Year', is_visible_in_listing: true },
      { field_name: 'max_students', label: 'Max Students', is_visible_in_listing: true },
      { field_name: 'room_number', label: 'Room Number', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns
  useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const defaultColumns = visibleColumns.slice(0, 4).map(col => col.field_name);
      setTableVisibleColumns(defaultColumns);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

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

  const handleAddClass = () => {
    setSelectedClass(null);
    setIsFormOpen(true);
  };

  const handleEditClass = (cls: any) => {
    setSelectedClass(cls);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClass(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      setError(null);
      if (selectedClass) {
        await updateClass({ id: selectedClass.id, data });
        setSuccessMessage('Class updated successfully!');
      } else {
        await createClass(data);
        setSuccessMessage('Class created successfully!');
      }
      handleFormClose();
      // Refetch the classes data to show the new class
      refetchClasses();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to save class');
    }
  };

  const handleDeleteClass = async (cls: any) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE ${cls.name}? This action cannot be undone.`)) {
      try {
        setError(null);
        await deleteClass(cls.id);
        setSuccessMessage(`Class ${cls.name} has been permanently deleted.`);
        // Refetch the classes data to update the list
        refetchClasses();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error: any) {
        setError(error.message || 'Failed to delete class');
      }
    }
  };

  const handleToggleClassStatus = async (cls: any) => {
    const action = cls.is_active ? 'deactivate' : 'activate';
    try {
      setError(null);
      await toggleClassStatus(cls.id);
      setSuccessMessage(`Class ${cls.name} has been successfully ${action}d.`);
      // Refetch the classes data to update the list
      refetchClasses();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setError(error.message || `Failed to ${action} class`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Classes</h1>
          <p className="mt-1 text-sm text-surface-600">
            Manage class information, schedules, and student enrollments.
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
                      <span className="text-sm text-surface-700">Class</span>
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
            onClick={() => navigate('/form-builder/advanced?type=class')}
            className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Form
          </button>
          <button
            onClick={handleAddClass}
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors duration-200"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Class
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

      {/* Search */}
      <ClassesSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

     
      {/* Classes Table */}
      <ClassesTable
        classes={classes?.data || []}
        isLoading={isClassesLoading}
        error={classesError}
                      onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
              onToggleStatus={handleToggleClassStatus}
        visibleColumns={visibleColumns}
        tableVisibleColumns={tableVisibleColumns}
      />

      {/* Class Form Dialog */}
      {isFormOpen && (
        <ClassesForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
          classData={selectedClass}
        />
      )}
    </div>
  );
};

export default AdminClassesView;
