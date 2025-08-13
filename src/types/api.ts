/**
 * API related TypeScript types
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  code?: string;
}

export interface QueryParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface UploadResponse {
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
}

export interface BulkOperationResponse {
  success_count: number;
  error_count: number;
  errors?: Array<{
    item: any;
    error: string;
  }>;
}

// Notification types
export interface NotificationPayload {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'warning' | 'error' | 'success' | 'reminder';
  action_url?: string;
  action_text?: string;
  data?: Record<string, any>;
  channels: string[];
  is_read: boolean;
  is_sent: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_at?: string;
  sent_at?: string;
  read_at?: string;
  expires_at?: string;
  source_type?: string;
  source_id?: number;
  created_at: string;
  updated_at: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'notification' | 'live_class_update' | 'grade_update' | 'attendance_update' | 'announcement';
  payload: any;
  timestamp: string;
}

// Common entity interfaces
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface AuditableEntity extends BaseEntity {
  created_by?: number;
  updated_by?: number;
}

// Permission types
export type Permission = 
  | 'user:create' | 'user:read' | 'user:update' | 'user:delete' | 'user:list'
  | 'student:create' | 'student:read' | 'student:update' | 'student:delete' | 'student:list'
  | 'teacher:create' | 'teacher:read' | 'teacher:update' | 'teacher:delete' | 'teacher:list'
  | 'class:create' | 'class:read' | 'class:update' | 'class:delete' | 'class:list'
  | 'assignment:create' | 'assignment:read' | 'assignment:update' | 'assignment:delete' | 'assignment:list'
  | 'exam:create' | 'exam:read' | 'exam:update' | 'exam:delete' | 'exam:list'
  | 'fee:create' | 'fee:read' | 'fee:update' | 'fee:delete' | 'fee:list'
  | 'live_class:create' | 'live_class:read' | 'live_class:update' | 'live_class:delete' | 'live_class:list'
  | 'library:create' | 'library:read' | 'library:update' | 'library:delete' | 'library:list'
  | 'transport:create' | 'transport:read' | 'transport:update' | 'transport:delete' | 'transport:list'
  | 'hostel:create' | 'hostel:read' | 'hostel:update' | 'hostel:delete' | 'hostel:list'
  | 'event:create' | 'event:read' | 'event:update' | 'event:delete' | 'event:list'
  | 'cms:create' | 'cms:read' | 'cms:update' | 'cms:delete' | 'cms:list'
  | 'crm:create' | 'crm:read' | 'crm:update' | 'crm:delete' | 'crm:list'
  | 'report:view' | 'report:create' | 'report:export'
  | 'communication:send' | 'communication:read' | 'communication:broadcast';

// Filter and sort types
export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}

export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  [key: string]: any;
}

// Dashboard widget types
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'calendar' | 'activity';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data: any;
  permissions?: Permission[];
}

// File types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  uploaded_at: string;
  uploaded_by: number;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Export configuration
export interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  fields?: string[];
  filters?: SearchFilters;
  filename?: string;
}

// Import configuration
export interface ImportConfig {
  file: File;
  mapping: Record<string, string>;
  skip_header?: boolean;
  dry_run?: boolean;
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primary_color: string;
  secondary_color: string;
  custom_css?: string;
}

// Language types
export interface LanguageOption {
  code: string;
  name: string;
  native_name: string;
  flag?: string;
}

// Menu item types
export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permissions?: Permission[];
  badge?: {
    content: string | number;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  external?: boolean;
  disabled?: boolean;
}
