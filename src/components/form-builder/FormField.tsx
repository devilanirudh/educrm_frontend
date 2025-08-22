import React, { useRef } from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Switch,
  Select,
  MenuItem,
  Button,
  Paper,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { FormField as FormFieldType } from "../../types/formBuilder";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

interface FormFieldProps {
  field: FormFieldType;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  onSelect?: () => void;
  isBaseField?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  index,
  moveField,
  onSelect,
  isBaseField = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { removeField } = useFormBuilderStore();

  const opacity = 1;

  const handleDelete = () => {
    if (isBaseField) {
      alert("Base fields cannot be deleted. They are part of the core schema.");
      return;
    }
    removeField(field.id);
  };

  const renderField = () => {
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
            placeholder={field.placeholder}
            type={field.field_type}
            fullWidth
            disabled
          />
        );
      case "textarea":
        return (
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            multiline
            rows={4}
            fullWidth
            disabled
          />
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={<Checkbox disabled />}
            label={field.label}
          />
        );
      case "toggle":
        return (
          <FormControlLabel control={<Switch disabled />} label={field.label} />
        );
      case "select":
        return (
          <Select label={field.label} fullWidth disabled>
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      case "file":
      case "image":
        return (
          <Button variant="contained" component="label" disabled>
            Upload {field.label}
            <input type="file" hidden />
          </Button>
        );
      default:
        return <p>Unsupported field type</p>;
    }
  };

  return (
    <Box sx={{ opacity }}>
      <Paper
        ref={ref}
        elevation={2}
        sx={{ 
          p: 2, 
          mb: 2, 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          border: isBaseField ? 2 : 1,
          borderColor: isBaseField ? 'primary.main' : 'divider',
        }}
        onClick={onSelect}
      >
        <Box sx={{ cursor: 'move' }}>
          <DragIndicatorIcon />
        </Box>
        <Box sx={{ flexGrow: 1, ml: 2 }}>{renderField()}</Box>
        <Tooltip 
          title={isBaseField ? "Base fields cannot be deleted" : "Delete field"}
          placement="top"
        >
          <IconButton 
            onClick={handleDelete}
            disabled={isBaseField}
            sx={{ 
              color: isBaseField ? 'text.disabled' : 'error.main',
              '&:hover': {
                color: isBaseField ? 'text.disabled' : 'error.dark'
              }
            }}
          >
            {isBaseField ? <LockIcon /> : <DeleteIcon />}
          </IconButton>
        </Tooltip>
      </Paper>
    </Box>
  );
};