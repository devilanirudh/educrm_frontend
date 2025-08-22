import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { FormSchema, FormField } from "../types/formBuilder";

interface FormBuilderState {
  schema: FormSchema;
  selectedField: FormField | null;
  addField: (field: FormField) => void;
      updateField: (fieldId: number, updatedProperties: Partial<FormField>) => void;
    removeField: (fieldId: number) => void;
    moveField: (fromIndex: number, toIndex: number) => void;
    selectField: (fieldId: number) => void;
  setSchema: (schema: FormSchema) => void;
  setMeta: (meta: Partial<Pick<FormSchema, 'name' | 'description'>>) => void;
  setEntityType: (entityType: string) => void;
}

export const useFormBuilderStore = create<FormBuilderState>()(
  immer((set) => ({
    schema: {
      id: 0,
      name: "Untitled Form",
      key: "untitled-form",
      description: "",
      fields: [],
      entityType: "students",
      is_active: true,
    },
    selectedField: null,
    setSchema: (schema) => set({ schema }),
    addField: (field) =>
      set((state) => {
        state.schema.fields.push(field);
      }),
    updateField: (fieldId, updatedProperties) =>
      set((state) => {
        const field = state.schema.fields.find((f) => f.id === fieldId);
        if (field) {
          Object.assign(field, updatedProperties);
        }
        if (state.selectedField?.id === fieldId) {
          Object.assign(state.selectedField, updatedProperties);
        }
      }),
    removeField: (fieldId) =>
      set((state) => {
        state.schema.fields = state.schema.fields.filter(
          (f) => f.id !== fieldId
        );
        if (state.selectedField?.id === fieldId) {
          state.selectedField = null;
        }
      }),
    moveField: (fromIndex, toIndex) =>
      set((state) => {
        const [movedField] = state.schema.fields.splice(fromIndex, 1);
        state.schema.fields.splice(toIndex, 0, movedField);
      }),
    selectField: (fieldId) =>
      set((state) => {
        state.selectedField =
          state.schema.fields.find((f) => f.id === fieldId) || null;
      }),
    setMeta: (meta) =>
      set((state) => {
        state.schema.name = meta.name ?? state.schema.name;
        state.schema.description = meta.description ?? state.schema.description;
      }),
    setEntityType: (entityType) =>
      set((state) => {
        state.schema.entityType = entityType;
      }),
  }))
);
