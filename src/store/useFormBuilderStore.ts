import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';
import type { FormSchema, FormField, FieldType, OptionsField } from '../types/formBuilder';

type State = {
  schema: FormSchema;
  selectedId?: string;
};

type Actions = {
  addField: (type: FieldType, index: number) => void;
  updateField: (id: string, patch: Partial<FormField>) => void;
  removeField: (id: string) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
  selectField: (id?: string) => void;
  setMeta: (meta: Partial<Pick<FormSchema, 'title' | 'description'>>) => void;
  setSchema: (schema: FormSchema) => void;
  duplicateField: (id: string) => void;
};

const defaultSchema: FormSchema = {
  id: 'form-1',
  title: 'Student Registration Form',
  description: 'A simple form to collect basic student information for enrollment.',
  fields: [
    {
      id: nanoid(),
      type: 'text',
      label: 'Full Name',
      name: 'fullName',
      required: true,
      placeholder: 'e.g., Jane Doe',
    },
    {
      id: nanoid(),
      type: 'email',
      label: 'Email Address',
      name: 'email',
      required: true,
      placeholder: 'e.g., jane.doe@example.com',
    },
    {
      id: nanoid(),
      type: 'select',
      label: 'Grade Level',
      name: 'gradeLevel',
      required: true,
      options: [
        { id: nanoid(), label: 'Grade 9', value: '9' },
        { id: nanoid(), label: 'Grade 10', value: '10' },
        { id: nanoid(), label: 'Grade 11', value: '11' },
        { id: nanoid(), label: 'Grade 12', value: '12' },
      ],
    } as OptionsField,
  ],
};

export const useFormBuilderStore = create<State & Actions>((set) => ({
  schema: defaultSchema,
  selectedId: undefined,

  addField: (type, index) => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: `Untitled ${type}`,
      name: `${type}_${nanoid(6)}`,
      ...(type === 'select' || type === 'radio'
        ? {
            options: [{ id: nanoid(), label: 'Option 1', value: 'option1' }],
          }
        : {}),
    } as FormField;

    set((state) => {
      const newFields = [...state.schema.fields];
      newFields.splice(index, 0, newField);
      return {
        schema: { ...state.schema, fields: newFields },
        selectedId: newField.id,
      };
    });
  },

  updateField: (id, patch) => {
    set((state) => ({
      schema: {
        ...state.schema,
        fields: state.schema.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      },
    }));
  },

  removeField: (id) => {
    set((state) => ({
      schema: {
        ...state.schema,
        fields: state.schema.fields.filter((f) => f.id !== id),
      },
      selectedId: state.selectedId === id ? undefined : state.selectedId,
    }));
  },

  moveField: (fromIndex, toIndex) => {
    set((state) => ({
      schema: {
        ...state.schema,
        fields: arrayMove(state.schema.fields, fromIndex, toIndex),
      },
    }));
  },

  selectField: (id) => set({ selectedId: id }),

  setMeta: (meta) => {
    set((state) => ({
      schema: { ...state.schema, ...meta },
    }));
  },

  setSchema: (schema) => set({ schema, selectedId: undefined }),

  duplicateField: (id: string) => {
    set((state) => {
      const fieldToDuplicate = state.schema.fields.find((f) => f.id === id);
      if (!fieldToDuplicate) return state;

      const newField = {
        ...fieldToDuplicate,
        id: nanoid(),
        name: `${fieldToDuplicate.name}_copy`,
      };

      const index = state.schema.fields.findIndex((f) => f.id === id);
      const newFields = [...state.schema.fields];
      newFields.splice(index + 1, 0, newField);

      return {
        schema: { ...state.schema, fields: newFields },
        selectedId: newField.id,
      };
    });
  },
}));