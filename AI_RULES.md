# AI Development Rules

This document provides guidelines for the AI developer to follow when working on the E-School Management Platform frontend. Adhering to these rules ensures consistency, maintainability, and quality of the codebase.

## Tech Stack Overview

The application is built on a modern React stack. Key technologies include:

-   **Framework**: React 18 with TypeScript for type safety.
-   **UI Components**: Material-UI (MUI) v5 is the exclusive component library.
-   **State Management**: Redux Toolkit for global UI state and React Query for server state (API data caching).
-   **Routing**: React Router v6 for all client-side navigation.
-   **API Communication**: Axios, with a pre-configured instance for interacting with the backend API.
-   **Forms**: Formik for form state management and Yup for schema-based validation.
-   **Date & Time**: `date-fns` for utility functions, integrated with `@mui/x-date-pickers` for UI components.
-   **Data Visualization**: Recharts for charts and graphs.

## Library Usage Guidelines

To maintain consistency, use the specified libraries for their intended purposes.

### 1. UI and Components

-   **Component Library**: **Exclusively use Material-UI (MUI)** for all UI elements (Buttons, Cards, Tables, etc.). Do not introduce other libraries like Tailwind CSS, Bootstrap, or Shadcn/UI.
-   **Styling**: Use the `sx` prop for component-specific styling. For global styles and theme variables (colors, typography), modify the theme in `src/utils/theme.ts`.
-   **Icons**: Only use icons from the `@mui/icons-material` package.

### 2. State Management

-   **Global UI State**: Use **Redux Toolkit** for state that affects the entire application's UI, such as theme preferences or sidebar visibility. See `src/store/uiSlice.ts`.
-   **Server State**: Use **React Query** for all data fetched from the API. This includes fetching, caching, updating, and invalidating server data. Do not store API data in the Redux store.

### 3. Routing and Navigation

-   **Routing**: All client-side routing must be handled by **React Router**.
-   **Route Configuration**: Define all primary routes within `src/App.tsx`.
-   **Code Splitting**: Use `React.lazy()` to lazy-load page components for better performance, as demonstrated in `src/App.tsx`.

### 4. API Communication

-   **HTTP Client**: All API requests must go through the pre-configured **Axios** instance located at `src/services/api.ts`.
-   **Service Layers**: Organize API calls into dedicated service files based on the resource (e.g., `studentsService` in `src/services/students.ts`).

### 5. Forms

-   **Form Logic**: Use **Formik** for handling form state, submissions, and events.
-   **Validation**: Use **Yup** to define validation schemas for forms.
-   **Implementation**: Follow the existing pattern in `src/pages/auth/LoginPage.tsx` as a reference.

### 6. Data Display

-   **Tables**: Use the standard MUI `<Table>` components for displaying tabular data. Follow the implementation in `src/pages/students/StudentsPage.tsx`.
-   **Charts**: Use the **Recharts** library for any data visualization needs.

### 7. TypeScript

-   **Typing**: Provide explicit TypeScript types for all component props, state, and API data structures.
-   **Type Definitions**: Store shared types in the `src/types` directory (e.g., `src/types/auth.ts`, `src/types/api.ts`).

By following these rules, we can ensure the AI contributes to a clean, consistent, and maintainable codebase.