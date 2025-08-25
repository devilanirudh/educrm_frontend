import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from '../../hooks/useForm';
import { useAssignmentDropdowns, useTeacherClasses, useTeacherClassSubjects } from '../../hooks/useAssignments';
import TailwindFormRenderer from '../form-builder/TailwindFormRenderer';

interface AssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => Promise<void>;
  assignmentData?: any;
  readOnly?: boolean;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  assignmentData,
  readOnly = false
}) => {
  const { formSchema, isFormSchemaLoading } = useForm('assignment_form');
  const { teachers, isTeachersLoading } = useAssignmentDropdowns();
  const { classes, isClassesLoading } = useTeacherClasses(assignmentData?.teacher_id || null);
  const { subjects, isSubjectsLoading } = useTeacherClassSubjects(
    assignmentData?.teacher_id || null, 
    assignmentData?.class_id || null
  );

  // Create enhanced form schema with dynamic dropdown options
  const enhancedFormSchema = React.useMemo(() => {
    if (!formSchema) return null;

    const enhancedSchema = { ...formSchema };
    enhancedSchema.fields = formSchema.fields.map(field => {
      if (field.field_name === 'teacher_id') {
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
      if (field.field_name === 'class_id') {
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
      if (field.field_name === 'subject_id') {
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
      return field;
    });

    return enhancedSchema;
  }, [formSchema, teachers, classes, subjects]);

  // Function to map assignment data to form fields
  const mapAssignmentToFormData = (assignment: any): Record<string, any> => {
    if (!assignment || !formSchema) return {};

    const formData: Record<string, any> = {};

    formSchema.fields.forEach(field => {
      let value: any = undefined;

      if (assignment.dynamic_data && assignment.dynamic_data[field.field_name] !== undefined) {
        value = assignment.dynamic_data[field.field_name];
      } else if ((assignment as any)[field.field_name] !== undefined) {
        value = (assignment as any)[field.field_name];
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
            {assignmentData
              ? `${readOnly ? 'View' : 'Edit'} Assignment - ${assignmentData.title}`
              : 'Add New Assignment'
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
            initialData={assignmentData ? mapAssignmentToFormData(assignmentData) : undefined}
            onCancel={onClose}
            isEditMode={!!assignmentData}
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

export default AssignmentForm;