import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Paper,
} from '@mui/material';
import type { FormSchema, FormField, OptionsField } from '../../types/formBuilder';

interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
}

const RenderField: React.FC<{
  field: FormField;
  value: any;
  error: string | undefined;
  onChange: (value: any) => void;
}> = ({ field, value, error, onChange }) => {
  const commonProps = {
    name: field.name,
    label: field.label,
    required: field.required,
    helperText: error || field.helpText,
    error: !!error,
    fullWidth: true,
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <TextField
          {...commonProps}
          type={field.type}
          placeholder={field.placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'textarea':
      return (
        <TextField
          {...commonProps}
          multiline
          rows={4}
          placeholder={field.placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'date':
      return (
        <TextField
          {...commonProps}
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      );
    case 'checkbox':
      return (
        <FormControl error={!!error} required={field.required}>
          <FormControlLabel
            control={
              <Checkbox
                name={field.name}
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
              />
            }
            label={field.label}
          />
          <FormHelperText>{error || field.helpText}</FormHelperText>
        </FormControl>
      );
    case 'select':
      const selectField = field as OptionsField;
      return (
        <FormControl fullWidth error={!!error} required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            name={field.name}
            value={value ?? ''}
            label={field.label}
            onChange={(e) => onChange(e.target.value)}
          >
            {selectField.options.map((opt) => (
              <MenuItem key={opt.id} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error || field.helpText}</FormHelperText>
        </FormControl>
      );
    case 'radio':
      const radioField = field as OptionsField;
      return (
        <FormControl error={!!error} required={field.required}>
          <FormLabel>{field.label}</FormLabel>
          <RadioGroup
            name={field.name}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          >
            {radioField.options.map((opt) => (
              <FormControlLabel
                key={opt.id}
                value={opt.value}
                control={<Radio />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
          <FormHelperText>{error || field.helpText}</FormHelperText>
        </FormControl>
      );
    case 'file':
      return (
        <FormControl error={!!error} required={field.required}>
          <FormLabel>{field.label}</FormLabel>
          <TextField
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.files ? e.target.files[0] : null)
            }
          />
          <FormHelperText>{error || field.helpText}</FormHelperText>
        </FormControl>
      );
    default:
      return null;
  }
};

const FormRenderer: React.FC<FormRendererProps> = ({ schema, onSubmit }) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    schema.fields.forEach((field) => {
      if (field.required && !data[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(data);
    }
  };

  const handleChange = (fieldName: string, value: any) => {
    setData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h4" gutterBottom>
          {schema.title}
        </Typography>
        {schema.description && (
          <Typography paragraph color="text.secondary">
            {schema.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          {schema.fields.map((field) => (
            <RenderField
              key={field.id}
              field={field}
              value={data[field.name]}
              error={errors[field.name]}
              onChange={(value) => handleChange(field.name, value)}
            />
          ))}
          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FormRenderer;