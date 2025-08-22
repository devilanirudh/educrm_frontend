import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FeeStructure } from '../../services/fees';

interface FeeStructureFormProps {
  onSubmit: (data: Omit<FeeStructure, 'id'>) => void;
  initialValues?: FeeStructure;
}

const FeeStructureForm: React.FC<FeeStructureFormProps> = ({ onSubmit, initialValues }) => {
  const { handleSubmit, control } = useForm<Omit<FeeStructure, 'id'>>({
    defaultValues: initialValues || {
      name: '',
      category: 'tuition',
      amount: 0,
      due_date: '',
      academic_year: '',
      class_id: undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => <TextField {...field} label="Name" fullWidth margin="normal" />}
      />
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select {...field} label="Category">
              <MenuItem value="tuition">Tuition</MenuItem>
              <MenuItem value="transport">Transport</MenuItem>
              <MenuItem value="library">Library</MenuItem>
              <MenuItem value="exam">Exam</MenuItem>
              <MenuItem value="hostel">Hostel</MenuItem>
              <MenuItem value="miscellaneous">Miscellaneous</MenuItem>
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="amount"
        control={control}
        render={({ field }) => <TextField {...field} label="Amount" type="number" fullWidth margin="normal" />}
      />
      <Controller
        name="due_date"
        control={control}
        render={({ field }) => <TextField {...field} label="Due Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />}
      />
      <Controller
        name="academic_year"
        control={control}
        render={({ field }) => <TextField {...field} label="Academic Year" fullWidth margin="normal" />}
      />
      <Controller
        name="class_id"
        control={control}
        render={({ field }) => <TextField {...field} label="Class ID" type="number" fullWidth margin="normal" />}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default FeeStructureForm;