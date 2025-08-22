import React from "react";
import { FormSchema, FormField as FormFieldType } from "../../types/form";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";

interface FormRendererProps {
  schema?: FormSchema;
  onSubmit: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
  onCancel?: () => void;
  formKey?: string;
}

const FormField: React.FC<{ field: FormFieldType; value: any; onChange: (value: any) => void }> = ({ field, value, onChange }) => {
  switch (field.field_type) {
    case "text":
    case "number":
    case "email":
    case "password":
    case "url":
    case "phone":
      return (
        <TextField
          label={field.label}
          name={field.field_name}
          placeholder={field.placeholder}
          required={field.is_required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          type={field.field_type === "password" ? "password" : field.field_type === "email" ? "email" : field.field_type === "number" ? "number" : "text"}
          fullWidth
          margin="normal"
        />
      );
    case "date":
      return (
        <TextField
          label={field.label}
          name={field.field_name}
          placeholder={field.placeholder}
          required={field.is_required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      );
    case "textarea":
      return (
        <TextField
          label={field.label}
          name={field.field_name}
          placeholder={field.placeholder}
          required={field.is_required}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
      );
    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              name={field.field_name}
            />
          }
          label={field.label}
        />
      );
    case "select":
      return (
        <FormControl fullWidth margin="normal">
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            label={field.label}
            displayEmpty
          >
            {field.placeholder && (
              <MenuItem value="" disabled>
                {field.placeholder}
              </MenuItem>
            )}
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    default:
      return null;
  }
};

const FormRenderer: React.FC<FormRendererProps> = ({ schema, onSubmit, initialData, onCancel, formKey }) => {
  console.log('🔍 FormRenderer render - initialData:', initialData);
  console.log('🔍 FormRenderer render - initialData keys:', initialData ? Object.keys(initialData) : 'undefined');
  console.log('🔍 FormRenderer render - schema:', schema?.fields?.map(f => f.field_name));
  
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  // Update form data when initialData changes (for edit mode)
  React.useEffect(() => {
    console.log('🔍 FormRenderer useEffect triggered with initialData:', initialData);
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('🔍 Setting form data to:', initialData);
      setFormData(initialData);
    } else {
      console.log('🔍 Clearing form data');
      setFormData({});
    }
  }, [initialData]);

  // Debug: Log current form data
  React.useEffect(() => {
    console.log('🔍 Current form data:', formData);
  }, [formData]);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!schema) {
    // You can render a loading state or return null
    return <div>Loading form...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{schema.name}</h2>
      <p>{schema.description}</p>
      {schema.fields.map((field) => {
        const fieldValue = formData[field.field_name];
        console.log(`🔍 Field ${field.field_name}:`, fieldValue, 'from formData:', formData);
        return (
          <FormField
            key={field.id}
            field={field}
            value={fieldValue}
            onChange={(value) => handleChange(field.field_name, value)}
          />
        );
      })}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              {onCancel && (
                <Button onClick={onCancel} variant="outlined">
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
    </form>
  );
};

export default FormRenderer;