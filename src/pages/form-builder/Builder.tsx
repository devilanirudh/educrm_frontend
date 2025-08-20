import React, { useState } from 'react';
import { Box } from '@mui/material';
import FieldPalette from '../../components/form-builder/FieldPalette';
import Canvas from '../../components/form-builder/Canvas';
import PropertyEditor from '../../components/form-builder/PropertyEditor';
import TopBar from '../../components/form-builder/TopBar';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import { formService } from '../../services/formService';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';

export default function Builder() {
  const schema = useFormBuilderStore(s => s.schema);
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await formService.saveSchema(schema);
      dispatch(setNotification({
        type: 'success',
        message: 'Form saved successfully!',
      }));
    } catch (error) {
      dispatch(setNotification({
        type: 'error',
        message: 'Failed to save form.',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <TopBar onSave={handleSave} isSaving={isSaving} />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <FieldPalette />
        <Canvas />
        <PropertyEditor />
      </Box>
    </Box>
  );
}