import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Typography, // Imported Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { studentsService, Student, StudentCreateRequest } from '../../services/students';
import { classesService, Class } from '../../services/classes'; // To fetch available classes

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: StudentCreateRequest) => void;
  initialData?: Student | null;
  isSaving: boolean;
}

const validationSchema = Yup.object({
  user_data: Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid').optional(),
    date_of_birth: Yup.date().nullable().required('Date of Birth is required'),
    gender: Yup.string().oneOf(['Male', 'Female', 'Other']).required('Gender is required'),
    address: Yup.string().optional(),
    city: Yup.string().optional(),
    state: Yup.string().optional(),
    country: Yup.string().optional(),
    postal_code: Yup.string().optional(),
  }).required('User data is required'),
  admission_number: Yup.string().required('Admission number is required'),
  admission_date: Yup.date().nullable().required('Admission date is required'),
  current_class_id: Yup.number().nullable().required('Current Class is required'),
  section: Yup.string().optional(),
  academic_year: Yup.string().required('Academic Year is required'),
  admission_type: Yup.string().required('Admission Type is required'),
  previous_school: Yup.string().optional(),
  medical_conditions: Yup.string().optional(),
  allergies: Yup.string().optional(),
  emergency_contact_name: Yup.string().optional(),
  emergency_contact_phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid').optional(),
  emergency_contact_relationship: Yup.string().optional(),
  transport_required: Yup.boolean().optional(),
  hostel_required: Yup.boolean().optional(),
  blood_group: Yup.string().optional(),
  height: Yup.number().optional(),
  weight: Yup.number().optional(),
  nationality: Yup.string().optional(),
  religion: Yup.string().optional(),
  caste: Yup.string().optional(),
  mother_tongue: Yup.string().optional(),
});

const StudentForm: React.FC<StudentFormProps> = ({ open, onClose, onSave, initialData, isSaving }) => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    if (open) {
      // Fetch classes when the form opens
      classesService.getClasses({ per_page: 100 })
        .then(response => setClasses(response.data))
        .catch(error => console.error('Failed to fetch classes:', error));
    }
  }, [open]);

  const formik = useFormik<StudentCreateRequest>({
    initialValues: {
      user_data: {
        email: initialData?.user.email || '',
        first_name: initialData?.user.first_name || '',
        last_name: initialData?.user.last_name || '',
        password: '', // Password should usually not be pre-filled or updated via user profile
        phone: initialData?.user.phone || '',
        date_of_birth: initialData?.user.date_of_birth || '',
        gender: initialData?.user.gender || '',
        address: initialData?.user.address || '',
        city: initialData?.user.city || '',
        state: initialData?.user.state || '',
        country: initialData?.user.country || '',
        postal_code: initialData?.user.postal_code || '',
      },
      admission_number: initialData?.admission_number || '',
      admission_date: initialData?.admission_date || '',
      current_class_id: initialData?.current_class_id || undefined,
      section: initialData?.section || '',
      academic_year: initialData?.academic_year || '2023-2024', // Default academic year
      admission_type: initialData?.admission_type || 'New', // Default admission type
      previous_school: initialData?.previous_school || '',
      medical_conditions: initialData?.medical_conditions || '',
      allergies: initialData?.allergies || '',
      emergency_contact_name: initialData?.emergency_contact_name || '',
      emergency_contact_phone: initialData?.emergency_contact_phone || '',
      emergency_contact_relationship: initialData?.emergency_contact_relationship || '',
      transport_required: initialData?.transport_required || false,
      hostel_required: initialData?.hostel_required || false,
      blood_group: initialData?.blood_group || '',
      height: initialData?.height || undefined,
      weight: initialData?.weight || undefined,
      nationality: initialData?.nationality || '',
      religion: initialData?.religion || '',
      caste: initialData?.caste || '',
      mother_tongue: initialData?.mother_tongue || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialData ? 'Edit Student' : 'Add New Student'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Personal Information</Typography>
            <TextField
              name="user_data.first_name"
              label="First Name"
              value={formik.values.user_data.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.first_name && Boolean(formik.errors.user_data?.first_name)}
              helperText={formik.touched.user_data?.first_name && formik.errors.user_data?.first_name}
              fullWidth
            />
            <TextField
              name="user_data.last_name"
              label="Last Name"
              value={formik.values.user_data.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.last_name && Boolean(formik.errors.user_data?.last_name)}
              helperText={formik.touched.user_data?.last_name && formik.errors.user_data?.last_name}
              fullWidth
            />
            <TextField
              name="user_data.email"
              label="Email Address"
              type="email"
              value={formik.values.user_data.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.email && Boolean(formik.errors.user_data?.email)}
              helperText={formik.touched.user_data?.email && formik.errors.user_data?.email}
              fullWidth
            />
            {!initialData && ( // Only show password fields for new student creation
              <TextField
                name="user_data.password"
                label="Password"
                type="password"
                value={formik.values.user_data.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.user_data?.password && Boolean(formik.errors.user_data?.password)}
                helperText={formik.touched.user_data?.password && formik.errors.user_data?.password}
                fullWidth
              />
            )}
            <TextField
              name="user_data.phone"
              label="Phone Number"
              value={formik.values.user_data.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.phone && Boolean(formik.errors.user_data?.phone)}
              helperText={formik.touched.user_data?.phone && formik.errors.user_data?.phone}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={formik.values.user_data.date_of_birth ? new Date(formik.values.user_data.date_of_birth) : null}
                onChange={(date) => formik.setFieldValue('user_data.date_of_birth', date ? date.toISOString().split('T')[0] : null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    onBlur: formik.handleBlur,
                    error: formik.touched.user_data?.date_of_birth && Boolean(formik.errors.user_data?.date_of_birth),
                    helperText: formik.touched.user_data?.date_of_birth && formik.errors.user_data?.date_of_birth,
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl fullWidth error={formik.touched.user_data?.gender && Boolean(formik.errors.user_data?.gender)}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                name="user_data.gender"
                value={formik.values.user_data.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
              {formik.touched.user_data?.gender && formik.errors.user_data?.gender && (
                <FormLabel error>{formik.errors.user_data?.gender}</FormLabel>
              )}
            </FormControl>

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Admission Details</Typography>
            <TextField
              name="admission_number"
              label="Admission Number"
              value={formik.values.admission_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.admission_number && Boolean(formik.errors.admission_number)}
              helperText={formik.touched.admission_number && formik.errors.admission_number}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Admission Date"
                value={formik.values.admission_date ? new Date(formik.values.admission_date) : null}
                onChange={(date) => formik.setFieldValue('admission_date', date ? date.toISOString().split('T')[0] : null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    onBlur: formik.handleBlur,
                    error: formik.touched.admission_date && Boolean(formik.errors.admission_date),
                    helperText: formik.touched.admission_date && formik.errors.admission_date,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              select
              name="current_class_id"
              label="Current Class"
              value={formik.values.current_class_id ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.current_class_id && Boolean(formik.errors.current_class_id)}
              helperText={formik.touched.current_class_id && formik.errors.current_class_id}
              fullWidth
            >
              <MenuItem value=""><em>Select Class</em></MenuItem>
              {classes.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name} {c.section ? `- ${c.section}` : ''}</MenuItem>
              ))}
            </TextField>
            <TextField
              name="academic_year"
              label="Academic Year"
              value={formik.values.academic_year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.academic_year && Boolean(formik.errors.academic_year)}
              helperText={formik.touched.academic_year && formik.errors.academic_year}
              fullWidth
            />
            <TextField
              name="admission_type"
              label="Admission Type"
              select
              value={formik.values.admission_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.admission_type && Boolean(formik.errors.admission_type)}
              helperText={formik.touched.admission_type && formik.errors.admission_type}
              fullWidth
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem>
            </TextField>
            <TextField
              name="previous_school"
              label="Previous School"
              value={formik.values.previous_school}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.previous_school && Boolean(formik.errors.previous_school)}
              helperText={formik.touched.previous_school && formik.errors.previous_school}
              fullWidth
            />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Contact & Address</Typography>
            <TextField
              name="user_data.address"
              label="Address"
              value={formik.values.user_data.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.address && Boolean(formik.errors.user_data?.address)}
              helperText={formik.touched.user_data?.address && formik.errors.user_data?.address}
              fullWidth
            />
            <TextField
              name="user_data.city"
              label="City"
              value={formik.values.user_data.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.city && Boolean(formik.errors.user_data?.city)}
              helperText={formik.touched.user_data?.city && formik.errors.user_data?.city}
              fullWidth
            />
            <TextField
              name="user_data.state"
              label="State"
              value={formik.values.user_data.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.state && Boolean(formik.errors.user_data?.state)}
              helperText={formik.touched.user_data?.state && formik.errors.user_data?.state}
              fullWidth
            />
            <TextField
              name="user_data.country"
              label="Country"
              value={formik.values.user_data.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.country && Boolean(formik.errors.user_data?.country)}
              helperText={formik.touched.user_data?.country && formik.errors.user_data?.country}
              fullWidth
            />
            <TextField
              name="user_data.postal_code"
              label="Postal Code"
              value={formik.values.user_data.postal_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_data?.postal_code && Boolean(formik.errors.user_data?.postal_code)}
              helperText={formik.touched.user_data?.postal_code && formik.errors.user_data?.postal_code}
              fullWidth
            />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Emergency Contact</Typography>
            <TextField
              name="emergency_contact_name"
              label="Emergency Contact Name"
              value={formik.values.emergency_contact_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.emergency_contact_name && Boolean(formik.errors.emergency_contact_name)}
              helperText={formik.touched.emergency_contact_name && formik.errors.emergency_contact_name}
              fullWidth
            />
            <TextField
              name="emergency_contact_phone"
              label="Emergency Contact Phone"
              value={formik.values.emergency_contact_phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.emergency_contact_phone && Boolean(formik.errors.emergency_contact_phone)}
              helperText={formik.touched.emergency_contact_phone && formik.errors.emergency_contact_phone}
              fullWidth
            />
            <TextField
              name="emergency_contact_relationship"
              label="Emergency Contact Relationship"
              value={formik.values.emergency_contact_relationship}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.emergency_contact_relationship && Boolean(formik.errors.emergency_contact_relationship)}
              helperText={formik.touched.emergency_contact_relationship && formik.errors.emergency_contact_relationship}
              fullWidth
            />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Other Details</Typography>
            <TextField
              name="blood_group"
              label="Blood Group"
              value={formik.values.blood_group}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.blood_group && Boolean(formik.errors.blood_group)}
              helperText={formik.touched.blood_group && formik.errors.blood_group}
              fullWidth
            />
            <TextField
              name="height"
              label="Height (cm)"
              type="number"
              value={formik.values.height ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.height && Boolean(formik.errors.height)}
              helperText={formik.touched.height && formik.errors.height}
              fullWidth
            />
            <TextField
              name="weight"
              label="Weight (kg)"
              type="number"
              value={formik.values.weight ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.weight && Boolean(formik.errors.weight)}
              helperText={formik.touched.weight && formik.errors.weight}
              fullWidth
            />
            <TextField
              name="nationality"
              label="Nationality"
              value={formik.values.nationality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nationality && Boolean(formik.errors.nationality)}
              helperText={formik.touched.nationality && formik.errors.nationality}
              fullWidth
            />
            <TextField
              name="religion"
              label="Religion"
              value={formik.values.religion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.religion && Boolean(formik.errors.religion)}
              helperText={formik.touched.religion && formik.errors.religion}
              fullWidth
            />
            <TextField
              name="caste"
              label="Caste"
              value={formik.values.caste}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.caste && Boolean(formik.errors.caste)}
              helperText={formik.touched.caste && formik.errors.caste}
              fullWidth
            />
            <TextField
              name="mother_tongue"
              label="Mother Tongue"
              value={formik.values.mother_tongue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mother_tongue && Boolean(formik.errors.mother_tongue)}
              helperText={formik.touched.mother_tongue && formik.errors.mother_tongue}
              fullWidth
            />
            <TextField
              name="medical_conditions"
              label="Medical Conditions"
              multiline
              rows={2}
              value={formik.values.medical_conditions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.medical_conditions && Boolean(formik.errors.medical_conditions)}
              helperText={formik.touched.medical_conditions && formik.errors.medical_conditions}
              fullWidth
            />
            <TextField
              name="allergies"
              label="Allergies"
              multiline
              rows={2}
              value={formik.values.allergies}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.allergies && Boolean(formik.errors.allergies)}
              helperText={formik.touched.allergies && formik.errors.allergies}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentForm;