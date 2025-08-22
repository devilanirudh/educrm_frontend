import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  TextFields as TextIcon,
  LooksOne as NumberIcon,
  Event as DateIcon,
  ArrowDropDownCircle as SelectIcon,
  CloudUpload as FileIcon,
  ToggleOn as ToggleIcon,
  Subject as TextAreaIcon,
  Password as PasswordIcon,
  AlternateEmail as EmailIcon,
  Link as UrlIcon,
  Phone as PhoneIcon,
  Image as ImageIcon,
  CheckBox as CheckboxIcon,
  RadioButtonChecked as RadioIcon,
} from "@mui/icons-material";
import { FieldType } from "../../types/form";

interface DraggableFieldProps {
  type: FieldType;
  label: string;
  icon: React.ReactElement;
}

const DraggableField: React.FC<DraggableFieldProps> = ({
  type,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `field-palette-${type}`,
    data: { type },
  });

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        mb: 1,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
          elevation: 2,
        },
        transition: 'all 0.2s',
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={label}
        primaryTypographyProps={{ 
          variant: 'body2',
          fontWeight: 500 
        }}
      />
    </Paper>
  );
};

const FieldPalette: React.FC = () => {
  const fields: DraggableFieldProps[] = [
    { type: "text", label: "Text", icon: <TextIcon /> },
    { type: "number", label: "Number", icon: <NumberIcon /> },
    { type: "date", label: "Date", icon: <DateIcon /> },
    { type: "select", label: "Select", icon: <SelectIcon /> },
    { type: "file", label: "File", icon: <FileIcon /> },
    { type: "textarea", label: "Text Area", icon: <TextAreaIcon /> },
    { type: "email", label: "Email", icon: <EmailIcon /> },
    { type: "image", label: "Image", icon: <ImageIcon /> },
    { type: "checkbox", label: "Checkbox", icon: <CheckboxIcon /> },
    { type: "radio", label: "Radio", icon: <RadioIcon /> },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Form Fields
      </Typography>
      <List sx={{ p: 0 }}>
        {fields.map((field) => (
          <ListItem key={field.type} sx={{ p: 0, mb: 1 }}>
            <DraggableField {...field} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FieldPalette;