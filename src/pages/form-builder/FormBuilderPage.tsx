import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import TopBar from "../../components/form-builder/TopBar";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { formService } from "../../services/formService";
import FieldPalette from "../../components/form-builder/FieldPalette";
import Canvas from "../../components/form-builder/Canvas";
import PropertyEditor from "../../components/form-builder/PropertyEditor";

const FormBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const { schema, addField, setMeta, setEntityType } = useFormBuilderStore();

  // Initialize form based on URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    const key = searchParams.get('key');
    
    if (type && key) {
      setMeta({ 
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Form`,
        description: `Form for managing ${type} data` 
      });
      setEntityType(type);
    } else if (type) {
      // Generate a unique key with timestamp if no specific key is provided
      const timestamp = Date.now();
      setMeta({ 
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Form`,
        description: `Form for managing ${type} data` 
      });
      setEntityType(type);
    }
  }, [searchParams, setMeta, setEntityType]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const key = searchParams.get('key');
      let formToSave = { ...schema };
      
      if (key) {
        // Set the form key from URL parameters
        formToSave.key = key;
      } else {
        // Generate a unique key with timestamp if none provided
        const timestamp = Date.now();
        formToSave.key = `form_${timestamp}`;
      }
      
      // Use createOrUpdateForm to handle existing forms
      await formService.createOrUpdateForm(formToSave);
      console.log("Form saved successfully!");
      alert("Form saved successfully! You can now use it in your application.");
    } catch (error: any) {
      console.error("Failed to save form:", error);
      alert("Failed to save form. Please check the console for details and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
        <TopBar onSave={handleSave} isSaving={isSaving} />
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
      </Box>
    </DndContext>
  );
};

export default FormBuilderPage;
