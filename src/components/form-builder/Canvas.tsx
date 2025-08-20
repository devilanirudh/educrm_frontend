import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, FileCopy } from '@mui/icons-material';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import type { FormField } from '../../types/formBuilder';

interface SortableFieldProps {
  field: FormField;
}

const SortableField: React.FC<SortableFieldProps> = ({ field }) => {
  const { selectedId, selectField, removeField, duplicateField } = useFormBuilderStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto',
    opacity: isDragging ? 0.7 : 1,
  };

  const isSelected = selectedId === field.id;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isSelected ? 4 : 1}
      onClick={() => selectField(field.id)}
      sx={{
        p: 2,
        mb: 2,
        cursor: 'grab',
        border: 2,
        borderColor: isSelected ? 'primary.main' : 'transparent',
        position: 'relative',
        '&:hover .field-actions': {
          opacity: 1,
        },
      }}
    >
      <Box {...attributes} {...listeners}>
        <Typography variant="subtitle1" component="div">
          {field.label} {field.required && '*'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Type: {field.type} | Name: {field.name}
        </Typography>
      </Box>
      <Box
        className="field-actions"
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          display: 'flex',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        <Tooltip title="Duplicate">
          <IconButton size="small" onClick={() => duplicateField(field.id)}>
            <FileCopy fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={() => removeField(field.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

const Canvas: React.FC = () => {
  const sensors = useSensors(useSensor(PointerSensor));
  const { schema, moveField, addField, selectField } = useFormBuilderStore();
  const { setNodeRef } = useDroppable({ id: 'canvas-droppable' });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && !String(active.id).startsWith('palette-')) {
      const oldIndex = schema.fields.findIndex((f) => f.id === active.id);
      const newIndex = schema.fields.findIndex((f) => f.id === over.id);
      moveField(oldIndex, newIndex);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !String(active.id).startsWith('palette-')) return;

    const type = active.data.current?.type;
    if (!type) return;

    // This logic is simplified; a real implementation might show a placeholder
    // and only add the field on DragEnd over the canvas.
    // For now, we add it immediately.
    const overIndex = schema.fields.findIndex((f) => f.id === over.id);
    if (overIndex !== -1) {
      // This part is tricky with the current setup.
      // A better approach is to handle adding on DragEnd.
    }
  };

  const handleDragEndForPalette = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id === 'canvas-droppable' && String(active.id).startsWith('palette-')) {
      const type = active.data.current?.type;
      if (type) {
        addField(type, schema.fields.length);
      }
    } else {
      handleDragEnd(event);
    }
  };

  return (
    <Box sx={{ flex: 1, p: 3, backgroundColor: 'grey.50', overflowY: 'auto' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndForPalette}
        onDragOver={handleDragOver}
      >
        <Box ref={setNodeRef} sx={{ minHeight: '100%' }}>
          <SortableContext items={schema.fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {schema.fields.map((field) => (
              <SortableField key={field.id} field={field} />
            ))}
          </SortableContext>
        </Box>
        {schema.fields.length === 0 && (
          <Box
            onClick={() => selectField(undefined)}
            sx={{
              textAlign: 'center',
              p: 4,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">
              Drag and drop fields from the left panel here.
            </Typography>
          </Box>
        )}
      </DndContext>
    </Box>
  );
};

export default Canvas;