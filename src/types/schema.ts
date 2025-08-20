export type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file";

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

export interface OptionsField extends BaseField {
  type: "select" | "radio";
  options: { id: string; label: string; value: string }[];
}

export type FormField = BaseField | OptionsField;

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}