import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Box } from '@mui/material';
import FieldPalette from '../../components/form-builder/FieldPalette';
import Canvas from '../../components/form-builder/Canvas';
import PropertyEditor from '../../components/form-builder/PropertyEditor';
import TopBar from '../../components/form-builder/TopBar';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import { formService } from '../../services/formService';

export default function Builder() {
  const { schema, addField, moveField } = useFormBuilderStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id.toString().startsWith('field-palette-')) {
      const fieldType = active.data.current?.type;
      if (fieldType) {
        addField(fieldType);
      }
    } else {
      const fromIndex = active.data.current?.index;
      const toIndex = over.data.current?.index;
      if (fromIndex !== undefined && toIndex !== undefined) {
        moveField(fromIndex, toIndex);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await formService.createForm(schema);
      console.log("Form saved successfully!");
    } catch (error) {
      console.error("Failed to save form:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar onSave={handleSave} isSaving={isSaving} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '250px 1fr 300px', flex: 1, overflow: 'hidden' }}>
          <FieldPalette />
          <Canvas />
          <PropertyEditor />
        </Box>
      </Box>
    </DndContext>
  );
}