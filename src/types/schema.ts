export type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file" | "image";

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  helpText?: string;
  validations?: ValidationRules;
}

export interface OptionsField extends BaseField {
  type: "select" | "radio";
  options: { id: string; label: string; value: string }[];
}

export interface ImageField extends BaseField {
  type: "image";
  aspectRatio?: number;
}

export type FormField = BaseField | OptionsField | ImageField;

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}