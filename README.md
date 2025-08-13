# E-School Management Platform - Frontend

A modern, responsive React TypeScript application for the E-School Management Platform.

## Technology Stack

- **React 18**: Modern UI library with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience
- **Material-UI (MUI)**: Modern React component library
- **Redux Toolkit**: Efficient state management
- **React Query**: Server state management and caching
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Hook Form**: Performant forms with easy validation
- **Formik & Yup**: Alternative form handling and validation
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Beautiful and customizable charts
- **Date-fns**: Modern date utility library

## Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── index.html         # Main HTML template
│   ├── favicon.ico        # App favicon
│   └── manifest.json      # PWA manifest
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Common components (buttons, inputs, etc.)
│   │   ├── layout/        # Layout components (header, sidebar, etc.)
│   │   ├── forms/         # Form components
│   │   └── charts/        # Chart components
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── students/      # Student management pages
│   │   ├── teachers/      # Teacher management pages
│   │   ├── classes/       # Class management pages
│   │   ├── assignments/   # Assignment pages
│   │   ├── exams/         # Exam pages
│   │   ├── fees/          # Fee management pages
│   │   ├── live-classes/  # Live class pages
│   │   ├── library/       # Library pages
│   │   ├── transport/     # Transport pages
│   │   ├── hostel/        # Hostel pages
│   │   ├── events/        # Event pages
│   │   ├── cms/           # Content management pages
│   │   ├── crm/           # CRM pages
│   │   ├── reports/       # Reports and analytics pages
│   │   └── communication/ # Communication pages
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication hook
│   │   ├── useApi.ts      # API hook
│   │   └── usePermissions.ts # Permissions hook
│   ├── services/          # API services
│   │   ├── api.ts         # Base API configuration
│   │   ├── auth.ts        # Authentication services
│   │   ├── students.ts    # Student services
│   │   ├── teachers.ts    # Teacher services
│   │   └── ...            # Other service files
│   ├── store/             # Redux store
│   │   ├── index.ts       # Store configuration
│   │   ├── authSlice.ts   # Authentication slice
│   │   ├── uiSlice.ts     # UI state slice
│   │   └── ...            # Other slices
│   ├── types/             # TypeScript type definitions
│   │   ├── auth.ts        # Authentication types
│   │   ├── api.ts         # API response types
│   │   ├── user.ts        # User types
│   │   └── ...            # Other type files
│   ├── utils/             # Utility functions
│   │   ├── constants.ts   # Application constants
│   │   ├── helpers.ts     # Helper functions
│   │   ├── validation.ts  # Validation schemas
│   │   └── formatters.ts  # Data formatters
│   ├── App.tsx            # Main App component
│   ├── index.tsx          # Application entry point
│   └── index.css          # Global styles
├── docs/                  # Documentation
│   ├── components.md      # Component documentation
│   ├── deployment.md      # Deployment guide
│   └── development.md     # Development guide
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## Features

### Core Features
- **Role-based Dashboard**: Different dashboards for Admin, Teacher, Student, and Parent
- **Authentication & Authorization**: JWT-based auth with role permissions
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Theme**: Theme switching capability
- **Real-time Updates**: WebSocket integration for live updates
- **Progressive Web App**: PWA features for mobile app experience

### User Management
- User registration and profile management
- Role-based access control
- Session management
- Password reset functionality

### Academic Management
- Student enrollment and management
- Teacher profiles and scheduling
- Class and subject management
- Assignment creation and submission
- Exam management and grading
- Grade book and progress tracking

### Communication
- In-app messaging
- Notifications (push, email, SMS)
- Announcements and news
- Parent-teacher communication

### Financial Management
- Fee structure management
- Payment processing
- Invoice generation
- Financial reporting

### E-Learning
- Live class integration
- Course content management
- Assignment distribution
- Progress tracking

### Analytics & Reporting
- Student performance analytics
- Attendance reports
- Financial reports
- Custom dashboard widgets

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API running on http://localhost:8000

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api/v1
   REACT_APP_SCHOOL_NAME=Demo School
   REACT_APP_ENABLE_PWA=true
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `REACT_APP_SCHOOL_NAME` | School name for branding | `Demo School` |
| `REACT_APP_ENABLE_PWA` | Enable PWA features | `true` |
| `REACT_APP_THEME_MODE` | Default theme mode | `light` |

## Authentication Flow

1. User logs in with email/username and password
2. Backend returns JWT access and refresh tokens
3. Frontend stores tokens securely
4. API requests include Authorization header
5. Token refresh handled automatically
6. Role-based route protection

## State Management

The application uses Redux Toolkit for state management:

- **Auth Slice**: User authentication state
- **UI Slice**: UI state (theme, sidebar, etc.)
- **Data Slices**: Entity-specific state (students, teachers, etc.)

## API Integration

API services are organized by domain:

- Axios interceptors for request/response handling
- Automatic token refresh
- Error handling and retry logic
- Type-safe API calls with TypeScript

## Component Architecture

- **Atomic Design**: Components organized by complexity
- **Material-UI**: Consistent design system
- **Responsive**: Mobile-first approach
- **Accessible**: ARIA compliance and keyboard navigation

## Testing

- **Unit Tests**: Jest and React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end testing setup

## Performance Optimization

- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Dynamic imports for better performance
- **Memoization**: React.memo and useMemo for optimization
- **Bundle Analysis**: Webpack bundle analyzer integration

## Build and Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, AWS S3
- **Docker**: Containerized deployment
- **CDN**: CloudFront, CloudFlare

### Environment Configuration
- Development: `.env.development`
- Production: `.env.production`
- Local: `.env.local`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow TypeScript best practices
2. Use Material-UI components
3. Write tests for new features
4. Follow the established folder structure
5. Use meaningful commit messages

## License

This project is proprietary software for educational institutions.

## Support

For technical support and documentation, please refer to the documentation folder or contact the development team.
# educrm_frontend
# educrm_frontend
