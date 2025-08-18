# E-School Management Platform - Component Documentation

## Overview

The E-School Management Platform frontend is built using React 18 with TypeScript, Material-UI, and a modular component architecture. This document provides comprehensive information about the component structure, usage patterns, and best practices.

## Component Architecture

### Design Principles

1. **Atomic Design**: Components are organized from atoms to organisms
2. **Reusability**: Components are designed to be reusable across different contexts
3. **Accessibility**: All components follow WCAG 2.1 AA guidelines
4. **Performance**: Components use React.memo, useMemo, and useCallback for optimization
5. **Type Safety**: Full TypeScript support with strict type checking

### Component Categories

```
src/components/
├── common/           # Reusable UI components
├── layout/           # Layout and navigation components
├── forms/            # Form-specific components
├── charts/           # Data visualization components
└── domain/           # Domain-specific components
```

## Common Components

### LoadingSpinner

A versatile loading indicator component.

```tsx
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With message
<LoadingSpinner message="Loading students..." />

// Full screen overlay
<LoadingSpinner fullScreen message="Initializing application..." />

// Custom size and color
<LoadingSpinner size={60} color="secondary" />
```

**Props:**
- `size?: number` - Spinner size in pixels (default: 40)
- `message?: string` - Optional loading message
- `fullScreen?: boolean` - Show as full screen overlay
- `overlay?: boolean` - Show as positioned overlay
- `color?: 'primary' | 'secondary' | 'inherit'` - Spinner color

### ErrorBoundary

React error boundary for catching and displaying errors gracefully.

```tsx
import ErrorBoundary from '@/components/common/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches JavaScript errors in component tree
- Displays user-friendly error message
- Provides retry functionality
- Development mode shows detailed error information
- Automatic error reporting in production

### ProtectedRoute

Route protection component with role-based access control.

```tsx
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Basic protection (requires authentication)
<ProtectedRoute>
  <AdminPanel />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requiredRoles={['admin', 'teacher']}>
  <TeacherPortal />
</ProtectedRoute>

// Permission-based protection
<ProtectedRoute requiredPermissions={['student:read', 'student:update']}>
  <StudentManagement />
</ProtectedRoute>
```

**Props:**
- `children: ReactNode` - Protected component
- `requiredRoles?: UserRole[]` - Required user roles
- `requiredPermissions?: Permission[]` - Required permissions
- `fallback?: ReactNode` - Custom unauthorized component

## Layout Components

### Layout

Main application layout wrapper.

```tsx
import Layout from '@/components/layout/Layout';

<Layout>
  <YourPageContent />
</Layout>
```

**Features:**
- Responsive design with mobile navigation
- Collapsible sidebar
- Theme switching support
- Header with user menu
- Footer with links

### Header

Application header with navigation and user controls.

```tsx
import Header from '@/components/layout/Header';

<Header onMobileMenuToggle={handleToggle} />
```

**Features:**
- Mobile menu toggle
- User profile dropdown
- Notifications badge
- Theme switcher
- Search functionality

### Sidebar

Navigation sidebar with role-based menu items.

```tsx
import Sidebar from '@/components/layout/Sidebar';

<Sidebar 
  mobileOpen={mobileOpen}
  onMobileClose={handleClose}
/>
```

**Features:**
- Hierarchical navigation menu
- Role-based menu filtering
- Active route highlighting
- Collapsible sections
- Responsive behavior

### AuthLayout

Special layout for authentication pages.

```tsx
import AuthLayout from '@/components/layout/AuthLayout';

<AuthLayout>
  <LoginForm />
</AuthLayout>
```

**Features:**
- Centered content layout
- Branding and marketing content
- Responsive design
- Background graphics

## Form Components

### FormField

Enhanced form field wrapper with validation.

```tsx
import FormField from '@/components/forms/FormField';

<FormField
  name="email"
  label="Email Address"
  type="email"
  required
  validation={emailValidation}
  helperText="Enter your school email address"
/>
```

### SearchBox

Search input with autocomplete and filters.

```tsx
import SearchBox from '@/components/forms/SearchBox';

<SearchBox
  placeholder="Search students..."
  onSearch={handleSearch}
  onFilterChange={handleFilters}
  filters={[
    { key: 'class', label: 'Class', options: classOptions },
    { key: 'status', label: 'Status', options: statusOptions }
  ]}
/>
```

### FileUpload

Drag-and-drop file upload component.

```tsx
import FileUpload from '@/components/forms/FileUpload';

<FileUpload
  accept="image/*,.pdf"
  maxSize={10 * 1024 * 1024} // 10MB
  multiple
  onUpload={handleUpload}
  onError={handleError}
/>
```

## Chart Components

### StatCard

Statistical information display card.

```tsx
import StatCard from '@/components/charts/StatCard';

<StatCard
  title="Total Students"
  value={1250}
  change={+5.2}
  icon={<School />}
  color="primary"
  trend="up"
/>
```

### LineChart

Line chart for time-series data.

```tsx
import LineChart from '@/components/charts/LineChart';

<LineChart
  data={attendanceData}
  xKey="date"
  yKey="percentage"
  title="Attendance Trends"
  height={300}
/>
```

### BarChart

Bar chart for categorical data.

```tsx
import BarChart from '@/components/charts/BarChart';

<BarChart
  data={gradeDistribution}
  xKey="grade"
  yKey="count"
  title="Grade Distribution"
  color="secondary"
/>
```

### PieChart

Pie chart for proportion visualization.

```tsx
import PieChart from '@/components/charts/PieChart';

<PieChart
  data={subjectData}
  labelKey="subject"
  valueKey="students"
  title="Students by Subject"
/>
```

## Data Components

### DataTable

Enhanced data table with sorting, filtering, and pagination.

```tsx
import DataTable from '@/components/common/DataTable';

<DataTable
  columns={studentColumns}
  data={students}
  loading={isLoading}
  pagination
  sortable
  filterable
  selectable
  onSelectionChange={handleSelection}
  onRowClick={handleRowClick}
  actions={[
    { label: 'Edit', icon: <Edit />, onClick: handleEdit },
    { label: 'Delete', icon: <Delete />, onClick: handleDelete }
  ]}
/>
```

### DataGrid

Advanced data grid with inline editing.

```tsx
import DataGrid from '@/components/common/DataGrid';

<DataGrid
  columns={gradeColumns}
  rows={grades}
  editable
  onCellEdit={handleCellEdit}
  groupBy="subject"
  aggregation={{
    score: 'average',
    count: 'sum'
  }}
/>
```

## Modal Components

### Modal

Base modal component.

```tsx
import Modal from '@/components/common/Modal';

<Modal
  open={isOpen}
  onClose={handleClose}
  title="Student Details"
  size="medium"
  actions={[
    <Button onClick={handleClose}>Cancel</Button>,
    <Button variant="contained" onClick={handleSave}>Save</Button>
  ]}
>
  <StudentForm />
</Modal>
```

### ConfirmDialog

Confirmation dialog for destructive actions.

```tsx
import ConfirmDialog from '@/components/common/ConfirmDialog';

<ConfirmDialog
  open={showConfirm}
  title="Delete Student"
  message="Are you sure you want to delete this student? This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={handleCancel}
  severity="error"
/>
```

## Navigation Components

### Breadcrumbs

Navigation breadcrumbs.

```tsx
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Students', href: '/students' },
    { label: 'John Doe' }
  ]}
/>
```

### Tabs

Tab navigation component.

```tsx
import Tabs from '@/components/navigation/Tabs';

<Tabs
  value={activeTab}
  onChange={handleTabChange}
  tabs={[
    { label: 'Overview', value: 'overview', icon: <Dashboard /> },
    { label: 'Grades', value: 'grades', icon: <Grade /> },
    { label: 'Attendance', value: 'attendance', icon: <Check /> }
  ]}
/>
```

## Utility Components

### StatusChip

Status indicator chip.

```tsx
import StatusChip from '@/components/common/StatusChip';

<StatusChip
  status="active"
  variant="outlined"
  size="small"
/>
```

### Avatar

User avatar with fallback.

```tsx
import Avatar from '@/components/common/Avatar';

<Avatar
  src={user.profilePicture}
  name={user.fullName}
  size="large"
  online={user.isOnline}
/>
```

### Badge

Notification badge.

```tsx
import Badge from '@/components/common/Badge';

<Badge
  count={unreadCount}
  max={99}
  color="error"
>
  <NotificationIcon />
</Badge>
```

## Form Patterns

### Basic Form

```tsx
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  email: Yup.string().email('Invalid email').required('Email is required')
});

const MyForm = () => {
  const formik = useFormik({
    initialValues: { firstName: '', email: '' },
    validationSchema,
    onSubmit: handleSubmit
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        name="firstName"
        label="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      />
    </form>
  );
};
```

### Multi-step Form

```tsx
import MultiStepForm from '@/components/forms/MultiStepForm';

<MultiStepForm
  steps={[
    { label: 'Personal Info', component: PersonalInfoStep },
    { label: 'Academic Info', component: AcademicInfoStep },
    { label: 'Review', component: ReviewStep }
  ]}
  onComplete={handleComplete}
  validationSchemas={[step1Schema, step2Schema, step3Schema]}
/>
```

## Best Practices

### Component Creation

1. **Use TypeScript interfaces for props**
```tsx
interface MyComponentProps {
  title: string;
  optional?: boolean;
  onAction: (data: any) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, optional = false, onAction }) => {
  // Component implementation
};
```

2. **Use React.memo for performance**
```tsx
const MyComponent = React.memo<MyComponentProps>(({ title, onAction }) => {
  // Component implementation
});
```

3. **Extract custom hooks**
```tsx
const useStudentData = (studentId: string) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStudent(studentId).then(setStudent).finally(() => setLoading(false));
  }, [studentId]);
  
  return { student, loading };
};
```

### Styling

1. **Use theme-based styling**
```tsx
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
  }
}));
```

2. **Use sx prop for dynamic styles**
```tsx
<Box
  sx={{
    p: 2,
    backgroundColor: isActive ? 'primary.main' : 'grey.100',
    '&:hover': { backgroundColor: 'primary.light' }
  }}
>
```

### State Management

1. **Use local state for component-specific data**
```tsx
const [isOpen, setIsOpen] = useState(false);
```

2. **Use Redux for global state**
```tsx
const user = useSelector((state: RootState) => state.auth.user);
const dispatch = useDispatch();
```

3. **Use React Query for server state**
```tsx
const { data: students, isLoading } = useQuery(
  ['students', filters],
  () => fetchStudents(filters)
);
```

### Error Handling

1. **Use error boundaries**
2. **Provide user-friendly error messages**
3. **Implement retry mechanisms**
4. **Log errors for debugging**

### Testing

1. **Write unit tests for components**
2. **Test user interactions**
3. **Mock external dependencies**
4. **Use accessibility testing**

## Accessibility Guidelines

1. **Use semantic HTML elements**
2. **Provide ARIA labels and descriptions**
3. **Ensure keyboard navigation**
4. **Maintain color contrast ratios**
5. **Provide alternative text for images**
6. **Use focus indicators**

## Performance Optimization

1. **Use React.memo for expensive components**
2. **Implement virtual scrolling for large lists**
3. **Lazy load components and routes**
4. **Optimize bundle size with code splitting**
5. **Use service workers for caching**

This documentation provides a comprehensive guide to the component architecture and usage patterns in the E-School Management Platform frontend.
