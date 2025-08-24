export type FieldType = "text" | "email" | "number" | "textarea" | "select" | "multi-select" | "checkbox" | "radio" | "date" | "file" | "image" | "password" | "url" | "phone" | "toggle" | "dynamic-config";

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
}

export interface FormFieldOption {
  id: number;
  label: string;
  value: string;
  order?: number;
}

export interface FormField {
  id: number;
  field_type: FieldType;
  label: string;
  field_name: string;
  placeholder?: string;
  default_value?: any;
  is_required: boolean;
  is_filterable: boolean;
  is_visible_in_listing: boolean;
  validation_rules?: Record<string, any>;
  options?: FormFieldOption[];
  order?: number;
  config?: Record<string, any>;
}

export interface FormSchema {
  id: number;
  name: string;
  key: string;
  description: string;
  fields: FormField[];
  entityType?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}