import React, { useState, useMemo } from 'react';
import { EllipsisVerticalIcon, PencilIcon, EyeIcon, TrashIcon, PowerIcon } from '@heroicons/react/24/outline';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import { useForm } from '../../../hooks/useForm';

interface ClassesTableProps {
  classes: any[];
  isLoading: boolean;
  error: any;
  onEditClass: (cls: any) => void;
  onDeleteClass: (cls: any) => void;
  onToggleStatus?: (cls: any) => void;
  readOnly?: boolean;
  visibleColumns?: any[];
  tableVisibleColumns?: string[];
}

const ClassesTable: React.FC<ClassesTableProps> = ({
  classes,
  isLoading,
  error,
  onEditClass,
  onDeleteClass,
  onToggleStatus,
  readOnly = false,
  visibleColumns = [],
  tableVisibleColumns = []
}) => {
  const [showUserMenu, setShowUserMenu] = useState<number | null>(null);

  // Status badge component
  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-success-100 text-success-800' 
          : 'bg-surface-100 text-surface-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (isLoading) {
    return <SkeletonLoader rows={8} />;
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-2xl p-4">
        <p className="text-error-700">Error loading classes: {String(error)}</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-surface-200 p-12 text-center">
        <h3 className="text-lg font-medium text-surface-900 mb-2">No classes found</h3>
        <p className="text-surface-600">
          {readOnly ? 'No classes are assigned to you.' : 'Start by adding your first class.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-surface-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Class
              </th>
              {visibleColumns
                .filter(col => tableVisibleColumns.includes(col.field_name))
                .map(col => (
                  <th key={col.field_name} className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Subjects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {classes.map((cls: any) => (
              <tr key={cls.id} className="hover:bg-surface-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-brand-800">
                          {cls.name[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-surface-900">
                        {cls.name}
                      </div>
                      <div className="text-sm text-surface-500">{cls.grade_level} - {cls.section}</div>
                    </div>
                  </div>
                </td>
                {visibleColumns
                  .filter(col => tableVisibleColumns.includes(col.field_name))
                  .map(col => {
                    // Debug logging for class teacher field
                    if (col.field_name === 'class_teacher_id') {
                      console.log('Class teacher data:', cls.class_teacher);
                    }
                    
                    return (
                      <td key={col.field_name} className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        {col.field_name === 'class_teacher_id' && cls.class_teacher ? 
                          `${cls.class_teacher.first_name || ''} ${cls.class_teacher.last_name || ''}`.trim() || cls.class_teacher.employee_id || '-' :
                          cls[col.field_name] || cls.dynamic_data?.[col.field_name] || '-'
                        }
                      </td>
                    );
                  })}
                <td className="px-6 py-4 whitespace-nowrap">
                  {cls.subjects && cls.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {cls.subjects.map((subject: any, index: number) => (
                        <span
                          key={subject.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800"
                        >
                          {subject.name}
                          {subject.weekly_hours && (
                            <span className="ml-1 text-brand-600">({subject.weekly_hours}h)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-surface-400 text-sm">No subjects assigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(cls.is_active)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button 
                      className="text-surface-400 hover:text-surface-600"
                      onClick={() => setShowUserMenu(showUserMenu === cls.id ? null : cls.id)}
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                    
                    {showUserMenu === cls.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-surface-200 py-2 z-50">
                        <button
                          onClick={() => onEditClass(cls)}
                          className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                        >
                          <PencilIcon className="w-4 h-4 mr-2" />
                          {readOnly ? 'View' : 'Edit'}
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200">
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        {!readOnly && onToggleStatus && (
                          <button
                            onClick={() => onToggleStatus(cls)}
                            className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                          >
                            <PowerIcon className="w-4 h-4 mr-2" />
                            {cls.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        {!readOnly && (
                          <button
                            onClick={() => onDeleteClass(cls)}
                            className="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors duration-200 font-medium"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete Permanently
                          </button>
                        )}
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
  );
};

export default ClassesTable;
