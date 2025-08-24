import React from 'react';
import { FormSchema, FormField as FormFieldType } from '../../types/form';
import { LockClosedIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  console.log('DynamicConfigField render:', { field: field.field_name, value, onChange: !!onChange });
  
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
      console.log('handleAddConfig called:', { newConfig, updatedConfigs });
      setConfigs(updatedConfigs);
      console.log('Calling onChange with:', updatedConfigs);
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
            console.log('Add button clicked');
            console.log('Current newConfig:', newConfig);
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
