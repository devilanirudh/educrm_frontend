import React from 'react';
import { FormSchema, FormField as FormFieldType } from '../../types/form';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface TailwindFormRendererProps {
  schema?: FormSchema;
  onSubmit: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const TailwindFormField: React.FC<{ 
  field: FormFieldType; 
  value: any; 
  onChange: (value: any) => void;
  isEditMode?: boolean;
}> = ({ field, value, onChange, isEditMode = false }) => {
  // Lock required fields in edit mode (these are the base/core fields)
  const isDisabled = field.is_required && isEditMode;
  
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange(file);
              }
            }}
            disabled={isDisabled}
            className={fieldClasses}
          />
          {value && typeof value === 'string' && (
            <div className="mt-2 text-sm text-surface-600">
              Current file: {value}
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

  // Update form data when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData]);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!schema) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-surface-900">{schema.name}</h2>
        {schema.description && (
          <p className="text-sm text-surface-600 mt-1">{schema.description}</p>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto space-y-4">
        {schema.fields.map((field) => {
          const fieldValue = formData[field.field_name];
          
          return (
            <TailwindFormField
              key={field.id}
              field={field}
              value={fieldValue}
              onChange={(value) => handleChange(field.field_name, value)}
              isEditMode={isEditMode}
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
          {isEditMode ? 'Update Student' : 'Add Student'}
        </button>
      </div>
    </form>
  );
};

export default TailwindFormRenderer;
