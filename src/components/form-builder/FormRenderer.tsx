import React, { useState } from 'react';
import type { FormSchema, FormField, OptionsField, ImageField, ValidationRules } from '../../types/schema';
import {
  Box, Typography, TextField, Button, Checkbox, FormControlLabel, Select, MenuItem,
  RadioGroup, Radio, FormControl, FormLabel, FormHelperText, InputLabel, Avatar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ImageCropper from './ImageCropper';
import { PhotoCamera } from '@mui/icons-material';

const ImageFieldView: React.FC<{ field: ImageField, value: any, error?: string, onChange: (value: any) => void }> = ({ field, value, error, onChange }) => {
  const [isCropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | undefined>();
  const [croppedImage, setCroppedImage] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result as string));
      reader.readAsDataURL(file);
      setCropperOpen(true);
    }
  };

  const handleSaveCrop = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setCroppedImage(url);
    onChange(blob); // Pass the blob to the form state
  };

  return (
    <FormControl fullWidth error={!!error}>
      <FormLabel required={field.validations?.required} sx={{ mb: 1 }}>{field.label}</FormLabel>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={croppedImage} sx={{ width: 80, height: 80 }} variant="rounded">
          <PhotoCamera />
        </Avatar>
        <Button variant="outlined" component="label">
          Upload Image
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </Button>
      </Box>
      <FormHelperText>{error || field.helpText}</FormHelperText>
      {imageToCrop && (
        <ImageCropper
          open={isCropperOpen}
          onClose={() => setCropperOpen(false)}
          onSave={handleSaveCrop}
          imageSrc={imageToCrop}
          aspect={field.aspectRatio}
        />
      )}
    </FormControl>
  );
};

const FieldView: React.FC<{ field: FormField, value: any, error?: string, onChange: (value: any) => void }> = ({ field, value, error, onChange }) => {
  const commonProps = {
    id: field.id,
    name: field.name,
    label: field.label,
    required: field.validations?.required,
    placeholder: field.placeholder,
    helperText: error || field.helpText,
    error: !!error,
    fullWidth: true,
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return <TextField type={field.type} {...commonProps} value={value ?? ''} onChange={e => onChange(e.target.value)} />;
    case 'textarea':
      return <TextField multiline rows={4} {...commonProps} value={value ?? ''} onChange={e => onChange(e.target.value)} />;
    case 'checkbox':
      return <FormControlLabel control={<Checkbox checked={!!value} onChange={e => onChange(e.target.checked)} name={field.name} />} label={field.label} />;
    case 'date':
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={field.label}
            value={value ? new Date(value) : null}
            onChange={(newValue) => onChange(newValue ? newValue.toISOString() : null)}
            slotProps={{ textField: { ...commonProps, required: field.validations?.required } }}
          />
        </LocalizationProvider>
      );
    case 'file':
      return (
        <FormControl fullWidth error={!!error}>
          <FormLabel required={field.validations?.required} sx={{ mb: 1 }}>{field.label}</FormLabel>
          <TextField type="file" onChange={e => onChange((e.target as HTMLInputElement).files?.[0] ?? null)} />
          <FormHelperText>{error || field.helpText}</FormHelperText>
        </FormControl>
      );
    case 'image':
      return <ImageFieldView field={field as ImageField} value={value} error={error} onChange={onChange} />;
    case 'select':
      return (
        <FormControl fullWidth error={!!error}>
          <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
          <Select labelId={`${field.id}-label`} {...commonProps} label={field.label} value={value ?? ''} onChange={e => onChange(e.target.value)}>
            <MenuItem value=""><em>Select...</em></MenuItem>
            {(field as OptionsField).options.map(o => <MenuItem key={o.id} value={o.value}>{o.label}</MenuItem>)}
          </Select>
          <FormHelperText>{error || field.helpText}</FormHelperText>
        </FormControl>
      );
    case 'radio':
      return (
        <FormControl component="fieldset" error={!!error}>
          <FormLabel component="legend">{field.label}</FormLabel>
          <RadioGroup name={field.name} value={value ?? ''} onChange={e => onChange(e.target.value)}>
            {(field as OptionsField).options.map(o => <FormControlLabel key={o.id} value={o.value} control={<Radio />} label={o.label} />)}
          </RadioGroup>
          <FormHelperText>{error || field.helpText}</FormHelperText>
        </FormControl>
      );
    default:
      return null;
  }
};

interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
}

export default function FormRenderer({ schema, onSubmit }: FormRendererProps) {
  const [data, setData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of schema.fields) {
      const rules = field.validations || {};
      const value = data[field.name];
      if (rules.required && (value === undefined || value === '' || value === null || value === false)) {
        newErrors[field.name] = `${field.label} is required.`;
        continue;
      }
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${rules.minLength} characters.`;
        continue;
      }
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        newErrors[field.name] = `${field.label} must be no more than ${rules.maxLength} characters.`;
        continue;
      }
    }
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
    setData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 'md', mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>{schema.title}</Typography>
      {schema.description && <Typography paragraph color="text.secondary">{schema.description}</Typography>}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        {schema.fields.map(field => (
          <FieldView
            key={field.id}
            field={field}
            value={data[field.name]}
            error={errors[field.name]}
            onChange={value => handleChange(field.name, value)}
          />
        ))}
        <Button type="submit" variant="contained" size="large" sx={{ mt: 2, alignSelf: 'flex-start' }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}