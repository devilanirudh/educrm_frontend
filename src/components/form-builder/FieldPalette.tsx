import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  TextFields,
  Email,
  Numbers,
  Notes,
  ArrowDropDownCircle,
  CheckBox,
  RadioButtonChecked,
  CalendarToday,
  AttachFile,
} from '@mui/icons-material';
import { useDraggable } from '@dnd-kit/core';
import type { FieldType } from '../../types/formBuilder';

const PALETTE_ITEMS: { type: FieldType; label: string; icon: React.ReactElement }[] = [
  { type: 'text', label: 'Text', icon: <TextFields /> },
  { type: 'email', label: 'Email', icon: <Email /> },
  { type: 'number', label: 'Number', icon: <Numbers /> },
  { type: 'textarea', label: 'Text Area', icon: <Notes /> },
  { type: 'select', label: 'Select', icon: <ArrowDropDownCircle /> },
  { type: 'radio', label: 'Radio Group', icon: <RadioButtonChecked /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckBox /> },
  { type: 'date', label: 'Date', icon: <CalendarToday /> },
  { type: 'file', label: 'File Upload', icon: <AttachFile /> },
];

interface DraggablePaletteItemProps {
  type: FieldType;
  label: string;
  icon: React.ReactElement;
}

const DraggablePaletteItem: React.FC<DraggablePaletteItemProps> = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  return (
    <ListItem disablePadding ref={setNodeRef} {...listeners} {...attributes}>
      <ListItemButton sx={{ opacity: isDragging ? 0.5 : 1 }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

const FieldPalette: React.FC = () => {
  return (
    <Paper
      variant="outlined"
      sx={{ width: 240, borderRight: 1, borderColor: 'divider', height: '100%' }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h3">
          Fields
        </Typography>
      </Box>
      <List>
        {PALETTE_ITEMS.map((item) => (
          <DraggablePaletteItem key={item.type} {...item} />
        ))}
      </List>
    </Paper>
  );
};

export default FieldPalette;