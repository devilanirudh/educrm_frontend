import React from "react";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const PropertyEditor: React.FC = () => {
  const { selectedField, updateField } = useFormBuilderStore();

  if (!selectedField) {
    return (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select a field to edit its properties
        </Typography>
      </Paper>
    );
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    updateField(selectedField.id, { ...selectedField, [name]: newValue });
  };

  const handleOptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newOptions = [...(selectedField.options || [])];
    newOptions[index] = { ...newOptions[index], [name]: value };
    updateField(selectedField.id, { options: newOptions });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Field Properties
      </Typography>
      <TextField
        label="Label"
        name="label"
        value={selectedField.label}
        onChange={handleFieldChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Field Name"
        name="field_name"
        value={selectedField.field_name}
        onChange={handleFieldChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Placeholder"
        name="placeholder"
        value={selectedField.placeholder || ""}
        onChange={handleFieldChange}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="is_required"
            checked={selectedField.is_required}
            onChange={handleFieldChange}
          />
        }
        label="Required"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="is_filterable"
            checked={selectedField.is_filterable}
            onChange={handleFieldChange}
          />
        }
        label="Filterable"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="is_visible_in_listing"
            checked={selectedField.is_visible_in_listing}
            onChange={handleFieldChange}
          />
        }
        label="Visible in Listing"
      />

      {(selectedField.field_type === "select" ||
        selectedField.field_type === "radio") && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Options
          </Typography>
          {selectedField.options?.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField
                label="Label"
                name="label"
                value={option.label}
                onChange={(e) => handleOptionChange(index, e)}
                size="small"
              />
              <TextField
                label="Value"
                name="value"
                value={option.value}
                onChange={(e) => handleOptionChange(index, e)}
                size="small"
              />
              <IconButton
                onClick={() => {
                  const newOptions = [...(selectedField.options || [])];
                  newOptions.splice(index, 1);
                  updateField(selectedField.id, { options: newOptions });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              const newOptions = [
                ...(selectedField.options || []),
                {
                  id: Date.now(),
                  label: "New Option",
                  value: "new_option",
                },
              ];
              updateField(selectedField.id, { options: newOptions });
            }}
            variant="outlined"
            size="small"
          >
            Add Option
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default PropertyEditor;