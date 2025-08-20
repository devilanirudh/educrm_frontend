import { create } from "zustand";
import { nanoid } from "nanoid";
import type { FormSchema, FormField, FieldType, OptionsField } from "../types/schema";
import { arrayMove } from "@dnd-kit/sortable";

type State = {
  schema: FormSchema;
  selectedId?: string;
};
type Actions = {
  addField: (type: FieldType) => void;
  updateField: (id: string, patch: Partial<FormField>) => void;
  removeField: (id: string) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
  selectField: (id?: string) => void;
  setMeta: (meta: Partial<Pick<FormSchema, "title" | "description">>) => void;
  setSchema: (schema: FormSchema) => void;
};

const defaultSchema: FormSchema = {
  id: nanoid(),
  title: "Student Registration Form",
  description: "A default form to collect basic student information.",
  fields: [
    { id: nanoid(), type: "text", label: "Full Name", name: "fullName", required: true, placeholder: "e.g. John Doe" },
    { id: nanoid(), type: "email", label: "Email Address", name: "email", required: true, placeholder: "e.g. john.doe@school.edu" },
    { 
      id: nanoid(), 
      type: "select", 
      label: "Current Grade", 
      name: "grade", 
      required: true,
      options: [
        { id: nanoid(), label: "Grade 9", value: "9" },
        { id: nanoid(), label: "Grade 10", value: "10" },
        { id: nanoid(), label: "Grade 11", value: "11" },
        { id: nanoid(), label: "Grade 12", value: "12" },
      ]
    } as OptionsField,
    { id: nanoid(), type: "date", label: "Date of Birth", name: "dob", required: true },
  ]
};

export const useFormBuilderStore = create<State & Actions>((set) => ({
  schema: defaultSchema,
  selectedId: undefined,

  addField: (type) => {
    const base = { id: nanoid(), type, label: "Untitled Field", name: `field_${nanoid(5)}` };
    const field: FormField =
      type === "select" || type === "radio"
        ? { ...base, options: [{ id: nanoid(), label: "Option 1", value: "option1" }] } as OptionsField
        : base;

    set(state => ({ 
      schema: { ...state.schema, fields: [...state.schema.fields, field] }, 
      selectedId: field.id 
    }));
  },

  updateField: (id, patch) => {
    set(state => ({
      schema: { 
        ...state.schema, 
        fields: state.schema.fields.map(f => f.id === id ? { ...f, ...patch } as FormField : f) 
      }
    }));
  },

  removeField: (id) => {
    set(state => ({
      schema: { ...state.schema, fields: state.schema.fields.filter(f => f.id !== id) },
      selectedId: state.selectedId === id ? undefined : state.selectedId
    }));
  },

  moveField: (fromIndex, toIndex) => {
    set(state => ({
      schema: {
        ...state.schema,
        fields: arrayMove(state.schema.fields, fromIndex, toIndex),
      }
    }));
  },

  selectField: (id) => set({ selectedId: id }),

  setMeta: (meta) => set(state => ({ schema: { ...state.schema, ...meta } })),

  setSchema: (schema) => set({ schema, selectedId: undefined }),
}));