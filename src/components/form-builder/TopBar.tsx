import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';

interface TopBarProps {
  onSave: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSave }) => {
  const { schema, setMeta } = useFormBuilderStore();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ mr: 2 }}>
        Form Builder
      </Typography>
      <TextField
        label="Form Title"
        value={schema.title}
        onChange={(e) => setMeta({ title: e.target.value })}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Form Description"
        value={schema.description ?? ''}
        onChange={(e) => setMeta({ description: e.target.value })}
        variant="outlined"
        size="small"
        sx={{ flex: 1 }}
      />
      <Button variant="contained" startIcon={<Save />} onClick={onSave}>
        Save Form
      </Button>
    </Box>
  );
};

export default TopBar;