// import React from 'react';
// import { useFormBuilderStore } from '../../store/useFormBuilderStore';
// import { Box, TextField, Button, Paper } from '@mui/material';
// import { Save as SaveIcon } from '@mui/icons-material';

// interface TopBarProps {
//   onSave: () => void;
//   isSaving: boolean;
// }

// export default function TopBar({ onSave, isSaving }: TopBarProps) {
//   const { schema, setMeta } = useFormBuilderStore();

//   return (
//     <Paper
//       elevation={0}
//       square
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: 2,
//         p: 2,
//         borderBottom: 1,
//         borderColor: 'divider',
//       }}
//     >
//       <TextField
//         label="Form Title"
//         value={schema.title}
//         onChange={e => setMeta({ title: e.target.value })}
//         size="small"
//         sx={{ width: 300 }}
//       />
//       <TextField
//         label="Description"
//         value={schema.description ?? ''}
//         onChange={e => setMeta({ description: e.target.value })}
//         size="small"
//         fullWidth
//       />
//       <Button
//         variant="contained"
//         startIcon={<SaveIcon />}
//         onClick={onSave}
//         disabled={isSaving}
//       >
//         {isSaving ? 'Saving...' : 'Save'}
//       </Button>
//     </Paper>
//   );
// }
import React from 'react';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import { Box, TextField, Button, Paper, MenuItem } from '@mui/material'; // 🆕 NEW: Added MenuItem
import { Save as SaveIcon } from '@mui/icons-material';

interface TopBarProps {
  onSave: () => void;
  isSaving: boolean;
}

export default function TopBar({ onSave, isSaving }: TopBarProps) {
  const { schema, setMeta, setEntityType } = useFormBuilderStore(); // 🆕 NEW: Destructured setEntityType

  return (
    <Paper
      elevation={0}
      square
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <TextField
        label="Form Title"
        value={schema.title}
        onChange={e => setMeta({ title: e.target.value })}
        size="small"
        sx={{ width: 300 }}
      />
      <TextField
        label="Description"
        value={schema.description ?? ''}
        onChange={e => setMeta({ description: e.target.value })}
        size="small"
        fullWidth
      />
      {/* 🆕 NEW: Entity Type Selector */}
      <TextField
        select
        label="Form For"
        value={schema.entityType}
        onChange={e => setEntityType(e.target.value)}
        size="small"
        sx={{ width: 150 }}
      >
        <MenuItem value="students">Students</MenuItem>
        <MenuItem value="teachers">Teachers</MenuItem>
        <MenuItem value="classes">Classes</MenuItem>
        <MenuItem value="assignments">Assignments</MenuItem>
        <MenuItem value="exams">Exams</MenuItem>
        {/* Add more entity types as needed */}
      </TextField>
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </Paper>
  );
}
