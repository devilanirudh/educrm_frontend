import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { FormField } from "./FormField";

const Canvas: React.FC = () => {
  const { schema, moveField, selectField } = useFormBuilderStore();
  const { isOver, setNodeRef } = useDroppable({
    id: "canvas",
  });

  // Check if field is a base field (required field) that cannot be deleted
  const isBaseField = (field: any) => {
    return field.is_required === true;
  };

  return (
    <Paper
      ref={setNodeRef}
      elevation={1}
      sx={{
        p: 3,
        bgcolor: isOver ? 'primary.50' : 'white',
        minHeight: 600,
        borderRadius: 2,
        border: isOver ? 2 : 1,
        borderColor: isOver ? 'primary.main' : 'divider',
        borderStyle: 'dashed',
      }}
    >
      {schema.fields.map((field, index) => (
        <Box key={field.id} sx={{ position: 'relative' }}>
          <FormField
            field={field}
            index={index}
            moveField={moveField}
            onSelect={() => selectField(field.id)}
            isBaseField={isBaseField(field)}
          />
          {isBaseField(field) && (
            <Chip
              label="Base Field"
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                fontSize: '0.7rem',
                height: 20
              }}
            />
          )}
        </Box>
      ))}
      {schema.fields.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            Drop fields here to build your form
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Canvas;