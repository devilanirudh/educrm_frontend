import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  Edit as EditIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import TopBar from "../../components/form-builder/TopBar";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { formService } from "../../services/formService";
import FieldPalette from "../../components/form-builder/FieldPalette";
import Canvas from "../../components/form-builder/Canvas";
import PropertyEditor from "../../components/form-builder/PropertyEditor";
import { FormSchema } from "../../types/form";

const AdvancedFormBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalSchema, setOriginalSchema] = useState<FormSchema | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { schema, addField, setMeta, setEntityType, setSchema } = useFormBuilderStore();

  const entityType = searchParams.get('type');
  const formKey = searchParams.get('key');

  // Initialize form based on URL parameters
  useEffect(() => {
    const initializeForm = async () => {
      if (entityType) {
        try {
          // Try to get existing form first
          let formData;
          if (formKey) {
            try {
              formData = await formService.getForm(formKey);
            } catch (error: any) {
              if (error.response?.status === 404) {
                // Form doesn't exist, create default form
                formData = await formService.getDefaultForm(entityType);
              } else {
                throw error;
              }
            }
          } else {
            // Get or create default form
            formData = await formService.getDefaultForm(entityType);
          }
          
          setSchema(formData);
          setOriginalSchema(formData);
          setMeta({ 
            name: formData.name,
            description: formData.description 
          });
          setEntityType(entityType);
        } catch (error) {
          console.error("Failed to initialize form:", error);
        }
      }
    };

    initializeForm();
  }, [entityType, formKey, setSchema, setMeta, setEntityType]);

  const handleEditForm = () => {
    setShowEditDialog(true);
  };

  const handleConfirmEdit = () => {
    setIsEditMode(true);
    setShowEditDialog(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (originalSchema) {
      setSchema(originalSchema);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formToSave = { ...schema };
      
      if (formKey) {
        formToSave.key = formKey;
      } else {
        formToSave.key = `${entityType}_form`;
      }
      
      await formService.createOrUpdateForm(formToSave);
      console.log("Form saved successfully!");
      
      // Update original schema after successful save
      setOriginalSchema(formToSave);
      setIsEditMode(false);
      
      alert("Form saved successfully! The database schema has been updated.");
    } catch (error: any) {
      console.error("Failed to save form:", error);
      alert("Failed to save form. Please check the console for details and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditMode) {
      alert("Please enable edit mode to modify the form");
      return;
    }

    const { active, over } = event;

    if (over && over.id === "canvas" && active.id.toString().startsWith("field-palette-")) {
      const fieldType = active.id.toString().replace("field-palette-", "") as any;
      
      // Create a new field
      const newField = {
        id: Date.now(),
        field_type: fieldType,
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`,
        field_name: `field_${Date.now()}`,
        is_required: false,
        is_filterable: false,
        is_visible_in_listing: true,
        options: fieldType === "select" || fieldType === "radio" ? [
          { id: 1, label: "Option 1", value: "option1" },
          { id: 2, label: "Option 2", value: "option2" }
        ] : undefined,
      };
      
      addField(newField);
    }
  };

  const getBaseFields = () => {
    if (!originalSchema) return [];
    
    // Return fields that are part of the base schema (cannot be deleted)
    const baseFieldNames = [
      'student_id', 'admission_date', 'academic_year', 'roll_number', 
      'section', 'blood_group', 'transportation_mode', 'is_hosteller'
    ];
    
    return originalSchema.fields.filter(field => 
      baseFieldNames.includes(field.field_name)
    );
  };

  const getCustomFields = () => {
    if (!originalSchema) return [];
    
    // Return fields that are custom additions
    const baseFieldNames = [
      'student_id', 'admission_date', 'academic_year', 'roll_number', 
      'section', 'blood_group', 'transportation_mode', 'is_hosteller'
    ];
    
    return originalSchema.fields.filter(field => 
      !baseFieldNames.includes(field.field_name)
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
        {/* Header */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              {schema.name || `${entityType ? entityType.charAt(0).toUpperCase() + entityType.slice(1) : 'Unknown'} Form`}
            </Typography>
            {!isEditMode && (
              <Chip 
                label="View Mode" 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
            )}
            {isEditMode && (
              <Chip 
                label="Edit Mode" 
                color="warning" 
                variant="outlined" 
                size="small" 
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isEditMode ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditForm}
                color="warning"
              >
                Edit Form
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={isSaving}
                  color="success"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </Box>
        </Paper>

        {/* Info Alert */}
        {!isEditMode && (
          <Alert severity="info" sx={{ m: 2 }}>
            <Typography variant="body2">
              This is the default {entityType} form. Click "Edit Form" to modify the database schema and add custom fields.
              <strong> Base fields cannot be deleted but can be modified.</strong>
            </Typography>
          </Alert>
        )}

        {/* Form Builder Interface */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ width: '20%', bgcolor: 'white', p: 2, overflowY: 'auto' }}>
            <FieldPalette />
          </Box>
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            <Canvas />
          </Box>
          <Box sx={{ width: '25%', bgcolor: 'white', p: 2, overflowY: 'auto' }}>
            <PropertyEditor />
          </Box>
        </Box>

        {/* Edit Confirmation Dialog */}
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
          <DialogTitle>Edit Form Schema</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              You are about to enter edit mode. This will allow you to:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2">
                Add new custom fields to the database schema
              </Typography>
              <Typography component="li" variant="body2">
                Modify existing field properties
              </Typography>
              <Typography component="li" variant="body2">
                Reorder fields
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Base fields (Student ID, Admission Date, etc.) cannot be deleted but can be modified.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmEdit} variant="contained" color="warning">
              Enter Edit Mode
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DndContext>
  );
};

export default AdvancedFormBuilderPage;
