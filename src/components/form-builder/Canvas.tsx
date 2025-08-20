import React from 'react';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, Typography } from '@mui/material';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

function SortableItem({ id, label, type, selected, onClick }: { id: string; label: string; type: string; selected: boolean; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      elevation={selected ? 4 : 1}
      sx={{
        p: 2,
        mb: 1,
        borderColor: selected ? 'primary.main' : 'transparent',
        borderWidth: 2,
        borderStyle: 'solid',
        '&:hover': {
          borderColor: 'primary.light',
        },
      }}
    >
      <Typography variant="subtitle1">{label}</Typography>
      <Typography variant="caption" color="text.secondary">{type}</Typography>
    </Paper>
  );
}

export default function Canvas() {
  const sensors = useSensors(useSensor(PointerSensor));
  const { schema, moveField, selectField, selectedId } = useFormBuilderStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = schema.fields.findIndex(f => f.id === String(active.id));
      const newIndex = schema.fields.findIndex(f => f.id === String(over.id));
      moveField(oldIndex, newIndex);
    }
  };

  return (
    <Box sx={{ flex: 1, p: 3, backgroundColor: 'action.hover', overflowY: 'auto' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={schema.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {schema.fields.map(f => (
            <SortableItem
              key={f.id}
              id={f.id}
              label={f.label}
              type={f.type}
              selected={selectedId === f.id}
              onClick={() => selectField(f.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
      {schema.fields.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography color="text.secondary">
            Click a field in the left palette to add it here.
          </Typography>
        </Box>
      )}
    </Box>
  );
}