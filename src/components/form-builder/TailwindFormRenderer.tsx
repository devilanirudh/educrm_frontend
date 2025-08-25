import React from 'react';
import { FormSchema, FormField as FormFieldType } from '../../types/form';
import { LockClosedIcon, PlusIcon, TrashIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useAssignmentDropdowns, useTeacherClasses, useTeacherClassSubjects } from '../../hooks/useAssignments';
import { useExamTeachers, useExamTeacherClasses, useExamTeacherClassSubjects } from '../../hooks/useExams';
import { getUploadBaseURL } from '../../services/api';

// Helper function to determine file type and get appropriate icon
const getFileInfo = (fileUrl: string) => {
  // Add type checking to prevent errors
  if (!fileUrl || typeof fileUrl !== 'string') {
    return { type: 'file', icon: '📎', label: 'View File' };
  }
  
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
    return { type: 'image', icon: '🖼️', label: 'View Image' };
  } else if (extension === 'pdf') {
    return { type: 'pdf', icon: '📄', label: 'View PDF' };
  } else if (['doc', 'docx'].includes(extension || '')) {
    return { type: 'document', icon: '📝', label: 'View Document' };
  } else {
    return { type: 'file', icon: '📎', label: 'View File' };
  }
};

interface TailwindFormRendererProps {
  schema?: FormSchema;
  onSubmit: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
  onCancel?: () => void;
  isEditMode?: boolean;
}

interface DynamicConfigFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  isDisabled: boolean;
}

const DynamicConfigField: React.FC<DynamicConfigFieldProps> = ({ field, value, onChange, isDisabled }) => {
  // Initialize configs from value or empty array
  const [configs, setConfigs] = React.useState<Array<{class: string, section: string, subject: string}>>(
    Array.isArray(value) ? value : []
  );
  const [newConfig, setNewConfig] = React.useState({ class: '', section: '', subject: '' });

  // Update configs when value changes (for edit mode)
  React.useEffect(() => {
    if (Array.isArray(value)) {
      setConfigs(value);
    }
  }, [value]);

  const handleAddConfig = () => {
    if (newConfig.class && newConfig.section && newConfig.subject) {
      const updatedConfigs = [...configs, { ...newConfig }];
      setConfigs(updatedConfigs);
      onChange(updatedConfigs);
      setNewConfig({ class: '', section: '', subject: '' });
    }
  };

  const handleRemoveConfig = (index: number) => {
    const updatedConfigs = configs.filter((_, i) => i !== index);
    setConfigs(updatedConfigs);
    onChange(updatedConfigs);
  };

  const getFieldOptions = (fieldName: string) => {
    const config = field.config as any;
    const fieldConfig = config?.fields?.find((f: any) => f.name === fieldName);
    return fieldConfig?.options || [];
  };

  return (
    <div className="space-y-4">
      {/* Current configurations */}
      {configs.map((config, index) => (
        <div key={index} className="flex items-center space-x-2 p-3 bg-surface-50 rounded-lg">
          <span className="text-sm font-medium">
            Grade {config.class} {config.section} - {config.subject}
          </span>
          <button
            type="button"
            onClick={() => handleRemoveConfig(index)}
            disabled={isDisabled}
            className="ml-auto p-1 text-error-500 hover:text-error-700 disabled:opacity-50"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Add new configuration */}
      <div className="flex items-center space-x-2">
        <select
          value={newConfig.class}
          onChange={(e) => setNewConfig({ ...newConfig, class: e.target.value })}
          disabled={isDisabled}
          className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Select Class</option>
          {getFieldOptions('class').map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={newConfig.section}
          onChange={(e) => setNewConfig({ ...newConfig, section: e.target.value })}
          disabled={isDisabled}
          className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Select Section</option>
          {getFieldOptions('section').map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={newConfig.subject}
          onChange={(e) => setNewConfig({ ...newConfig, subject: e.target.value })}
          disabled={isDisabled}
          className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Select Subject</option>
          {getFieldOptions('subject').map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            handleAddConfig();
          }}
          disabled={isDisabled || !newConfig.class || !newConfig.section || !newConfig.subject}
          className="px-3 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TailwindFormField: React.FC<{ 
  field: FormFieldType; 
  value: any; 
  onChange: (value: any) => void;
  isEditMode?: boolean;
  isDisabled?: boolean;
  schema?: any;
}> = ({ field, value, onChange, isEditMode = false, isDisabled: externalDisabled = false, schema }) => {
  // Lock required fields in edit mode (these are the base/core fields)
  // const internalDisabled = field.is_required && isEditMode;
  // const isDisabled = externalDisabled || internalDisabled;
  const isDisabled = externalDisabled;
  const baseFieldClasses = "w-full px-3 py-2 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";
  const disabledClasses = "bg-surface-100 text-surface-500 cursor-not-allowed";
  
  const fieldClasses = `${baseFieldClasses} ${isDisabled ? disabledClasses : ''}`;

  switch (field.field_type) {
    case "text":
    case "number":
    case "email":
    case "password":
    case "url":
    case "phone":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-error-500 ml-1">*</span>}
            {isDisabled && (
              <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
            )}
          </label>
          <input
            type={field.field_type === "password" ? "password" : field.field_type === "email" ? "email" : field.field_type === "number" ? "number" : "text"}
            name={field.field_name}
            placeholder={field.placeholder}
            required={field.is_required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            className={fieldClasses}
          />
        </div>
      );
    case "date":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-error-500 ml-1">*</span>}
            {isDisabled && (
              <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
            )}
          </label>
          <input
            type="date"
            name={field.field_name}
            placeholder={field.placeholder}
            required={field.is_required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            className={fieldClasses}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-error-500 ml-1">*</span>}
            {isDisabled && (
              <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
            )}
          </label>
          <textarea
            name={field.field_name}
            placeholder={field.placeholder}
            required={field.is_required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            rows={4}
            className={fieldClasses}
          />
        </div>
      );
    case "checkbox":
      return (
        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name={field.field_name}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={isDisabled}
              className={`rounded border-surface-300 text-brand-600 focus:ring-brand-500 mr-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <span className={`text-sm ${isDisabled ? 'text-surface-500' : 'text-surface-700'}`}>
              {field.label}
              {field.is_required && <span className="text-error-500 ml-1">*</span>}
              {isDisabled && (
                <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
              )}
            </span>
          </label>
        </div>
      );
    case "select":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-error-500 ml-1">*</span>}
            {isDisabled && (
              <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
            )}
          </label>
          <select
            name={field.field_name}
            required={field.is_required}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            className={fieldClasses}
          >
            {field.placeholder && (
              <option value="" disabled>
                {field.placeholder}
              </option>
            )}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "multi-select":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-error-500 ml-1">*</span>}
            {isDisabled && (
              <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
            )}
          </label>
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name={field.field_name}
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option.value]);
                    } else {
                      onChange(currentValues.filter(v => v !== option.value));
                    }
                  }}
                  disabled={isDisabled}
                  className={`rounded border-surface-300 text-brand-600 focus:ring-brand-500 mr-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <span className={`text-sm ${isDisabled ? 'text-surface-500' : 'text-surface-700'}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      );
    case "dynamic-config":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-error-500 ml-1">*</span>}
            {isDisabled && (
              <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
            )}
          </label>
          <DynamicConfigField 
            field={field} 
            value={value} 
            onChange={onChange} 
            isDisabled={isDisabled} 
          />
        </div>
      );
    case "file":
    case "image":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {field.label}
            {field.is_required && <span className="text-error-500 ml-1">*</span>}
            {isDisabled && (
              <LockClosedIcon className="w-4 h-4 inline ml-2 text-surface-400" title="Required field - cannot be modified in edit mode" />
            )}
          </label>
          <input
            type="file"
            name={field.field_name}
            accept={field.field_type === "image" ? "image/*" : "*/*"}
            required={field.is_required}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  // Upload file to server based on form type
                  let result;
                  if (schema?.key === 'exam_form') {
                    const { examsService } = await import('../../services/exams');
                    result = await examsService.uploadFile(file);
                  } else {
                    const { assignmentsService } = await import('../../services/assignments');
                    result = await assignmentsService.uploadFile(file);
                  }
                  onChange(result.file_url); // Store the file URL
                } catch (error) {
                  console.error('Error uploading file:', error);
                  // Fallback to storing file object
                  onChange(file);
                }
              }
            }}
            disabled={isDisabled}
            className={fieldClasses}
          />
          {value && typeof value === 'string' && (
            <div className="mt-2">
              {value.startsWith('/uploads/') ? (
                <div className="flex items-center gap-2">
                  {(() => {
                    // Additional safety check
                    if (!value || typeof value !== 'string') {
                      return (
                        <span className="text-sm text-gray-500">
                          Invalid file data
                        </span>
                      );
                    }
                    
                    const fileInfo = getFileInfo(value);
                    const fullUrl = `${getUploadBaseURL()}${value}`;
                    
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => window.open(fullUrl, '_blank')}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          title={fileInfo.label}
                        >
                          <EyeIcon className="w-4 h-4" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = fullUrl;
                            link.download = value.split('/').pop() || 'assignment-file';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          title="Download File"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Download
                        </button>
                        <span className="text-sm text-gray-500">
                          {value.split('/').pop()}
                        </span>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-sm text-surface-600">
                  Current file: {value}
                </div>
              )}
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};

const TailwindFormRenderer: React.FC<TailwindFormRendererProps> = ({ 
  schema, 
  onSubmit, 
  initialData, 
  onCancel, 
  isEditMode = false 
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  // Cascading dropdown hooks for assignment form
  const { teachers, isTeachersLoading } = useAssignmentDropdowns();
  const { classes, isClassesLoading } = useTeacherClasses(formData.teacher_id ? parseInt(formData.teacher_id) : null);
  const { subjects, isSubjectsLoading } = useTeacherClassSubjects(
    formData.teacher_id ? parseInt(formData.teacher_id) : null, 
    formData.class_id ? parseInt(formData.class_id) : null
  );

  // Cascading dropdown hooks for exam form
  const examTeachersQuery = useExamTeachers();
  const examClassesQuery = useExamTeacherClasses(formData.teacher_id ? parseInt(formData.teacher_id) : null);
  const examSubjectsQuery = useExamTeacherClassSubjects(
    formData.teacher_id ? parseInt(formData.teacher_id) : null, 
    formData.class_id ? parseInt(formData.class_id) : null
  );

  // Update form data when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData]);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [fieldName]: value };
      
      // Handle cascading dropdowns for assignment form
      if (fieldName === 'teacher_id') {
        // Clear dependent fields when teacher changes
        newData.class_id = '';
        newData.subject_id = '';
      } else if (fieldName === 'class_id') {
        // Clear subject when class changes
        newData.subject_id = '';
      }
      
      return newData;
    });
  };

  // Create enhanced schema with dynamic options for cascading dropdowns
  const enhancedSchema = React.useMemo(() => {
    if (!schema) return null;

    const enhanced = { ...schema };
    enhanced.fields = schema.fields.map(field => {
      // Handle assignment form dropdowns
      if (field.field_name === 'teacher_id' && schema.key === 'assignment_form') {
        return {
          ...field,
          options: teachers.map((teacher, index) => ({
            id: index + 1,
            value: teacher.value,
            label: teacher.label,
            order: index + 1
          }))
        };
      }
      if (field.field_name === 'class_id' && schema.key === 'assignment_form') {
        return {
          ...field,
          options: classes.map((cls, index) => ({
            id: index + 1,
            value: cls.value,
            label: cls.label,
            order: index + 1
          }))
        };
      }
      if (field.field_name === 'subject_id' && schema.key === 'assignment_form') {
        return {
          ...field,
          options: subjects.map((subject, index) => ({
            id: index + 1,
            value: subject.value,
            label: subject.label,
            order: index + 1
          }))
        };
      }

      // Handle exam form dropdowns
      if (field.field_name === 'teacher_id' && schema.key === 'exam_form') {
        return {
          ...field,
          options: (examTeachersQuery.data?.teachers || []).map((teacher: any, index: number) => ({
            id: index + 1,
            value: teacher.value,
            label: teacher.label,
            order: index + 1
          }))
        };
      }
      if (field.field_name === 'class_id' && schema.key === 'exam_form') {
        return {
          ...field,
          options: (examClassesQuery.data?.classes || []).map((cls: any, index: number) => ({
            id: index + 1,
            value: cls.value,
            label: cls.label,
            order: index + 1
          }))
        };
      }
      if (field.field_name === 'subject_id' && schema.key === 'exam_form') {
        return {
          ...field,
          options: (examSubjectsQuery.data?.subjects || []).map((subject: any, index: number) => ({
            id: index + 1,
            value: subject.value,
            label: subject.label,
            order: index + 1
          }))
        };
      }

      return field;
    });

    return enhanced;
  }, [schema, teachers, classes, subjects, examTeachersQuery.data, examClassesQuery.data, examSubjectsQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!enhancedSchema) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-surface-900">{enhancedSchema.name}</h2>
        {enhancedSchema.description && (
          <p className="text-sm text-surface-600 mt-1">{enhancedSchema.description}</p>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto space-y-4">
        {enhancedSchema.fields.map((field) => {
          const fieldValue = formData[field.field_name];
          
          // Add loading states for cascading dropdowns
          let isFieldDisabled = false;
          if (field.field_name === 'class_id' && !formData.teacher_id) {
            isFieldDisabled = true;
          }
          if (field.field_name === 'subject_id' && (!formData.teacher_id || !formData.class_id)) {
            isFieldDisabled = true;
          }
          
          return (
            <TailwindFormField
              key={field.id}
              field={field}
              value={fieldValue}
              onChange={(value) => handleChange(field.field_name, value)}
              isEditMode={isEditMode}
              isDisabled={isFieldDisabled}
              schema={enhancedSchema}
            />
          );
        })}
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel} 
            className="px-4 py-2 text-sm font-medium text-surface-700 bg-surface-100 rounded-xl hover:bg-surface-200 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors duration-200"
        >
          {isEditMode ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default TailwindFormRenderer;

export { TailwindFormField };
