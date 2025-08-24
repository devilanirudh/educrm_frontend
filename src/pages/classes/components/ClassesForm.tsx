import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from '../../../hooks/useForm';
import { useTeachersDropdown } from '../../../hooks/useTeachers';
import TailwindFormRenderer from '../../../components/form-builder/TailwindFormRenderer';

interface ClassesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => Promise<void>;
  classData?: any;
  readOnly?: boolean;
}

const ClassesForm: React.FC<ClassesFormProps> = ({
  isOpen,
  onClose,
  onSave,
  classData,
  readOnly = false
}) => {
  const { formSchema, isFormSchemaLoading } = useForm('class_form');
  const { teachers, isTeachersLoading } = useTeachersDropdown();

  // Create enhanced form schema with dynamic teacher options
  const enhancedFormSchema = React.useMemo(() => {
    if (!formSchema) return null;

    const enhancedSchema = { ...formSchema };
    enhancedSchema.fields = formSchema.fields.map(field => {
      if (field.field_name === 'class_teacher_id') {
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
      return field;
    });

    return enhancedSchema;
  }, [formSchema, teachers]);

  // Function to map class data to form fields
  const mapClassToFormData = (cls: any): Record<string, any> => {
    if (!cls || !formSchema) return {};

    const formData: Record<string, any> = {};

    formSchema.fields.forEach(field => {
      let value: any = undefined;

      if (cls.dynamic_data && cls.dynamic_data[field.field_name] !== undefined) {
        value = cls.dynamic_data[field.field_name];
      } else if ((cls as any)[field.field_name] !== undefined) {
        value = (cls as any)[field.field_name];
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

  const handleFormSave = async (data: any) => {
    if (onSave) {
      await onSave(data);
    } else {
      console.log('Form data:', data);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">
            {classData
              ? `${readOnly ? 'View' : 'Edit'} Class - ${classData.name}`
              : 'Add New Class'
            }
          </h3>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {enhancedFormSchema ? (
          <TailwindFormRenderer
            schema={enhancedFormSchema}
            onSubmit={handleFormSave}
            initialData={classData ? mapClassToFormData(classData) : undefined}
            onCancel={onClose}
            isEditMode={!!classData}
          />
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            <span className="ml-2 text-surface-600">
              {isFormSchemaLoading ? 'Loading form...' : isTeachersLoading ? 'Loading teachers...' : 'Loading...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesForm;
