/**
 * UI state Redux slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // Theme and appearance
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Loading states
  globalLoading: boolean;
  pageLoading: boolean;
  
  // Notifications
  notification: NotificationState | null;
  
  // Modals and dialogs
  activeModal: string | null;
  modalData: any;
  
  // Search and filters
  searchQuery: string;
  activeFilters: Record<string, any>;
  
  // Layout preferences
  layout: 'default' | 'compact' | 'spacious';
  language: string;
  
  // Data grid states
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Mobile responsiveness
  isMobile: boolean;
  isTablet: boolean;
  
  // Connection status
  isOnline: boolean;
  
  // Recent items
  recentlyViewed: Array<{
    id: string;
    title: string;
    path: string;
    timestamp: number;
  }>;
  
  // Quick actions
  quickActions: Array<{
    id: string;
    label: string;
    icon: string;
    action: string;
    permissions?: string[];
  }>;
  
  // Dashboard customization
  dashboardWidgets: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    config: any;
  }>;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  sidebarCollapsed: false,
  globalLoading: false,
  pageLoading: false,
  notification: null,
  activeModal: null,
  modalData: null,
  searchQuery: '',
  activeFilters: {},
  layout: 'default',
  language: 'en',
  pageSize: 20,
  sortBy: 'created_at',
  sortOrder: 'desc',
  isMobile: false,
  isTablet: false,
  isOnline: true,
  recentlyViewed: [],
  quickActions: [],
  dashboardWidgets: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Sidebar actions
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    
    // Notification actions
    setNotification: (state, action: PayloadAction<NotificationState>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<{ modalId: string; data?: any }>) => {
      state.activeModal = action.payload.modalId;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    
    // Search and filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.activeFilters = action.payload;
    },
    addFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.activeFilters[action.payload.key] = action.payload.value;
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      delete state.activeFilters[action.payload];
    },
    clearFilters: (state) => {
      state.activeFilters = {};
    },
    
    // Layout actions
    setLayout: (state, action: PayloadAction<'default' | 'compact' | 'spacious'>) => {
      state.layout = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    
    // Data grid actions
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    
    // Responsive actions
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setIsTablet: (state, action: PayloadAction<boolean>) => {
      state.isTablet = action.payload;
    },
    
    // Connection status
    setIsOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    
    // Recently viewed actions
    addRecentlyViewed: (state, action: PayloadAction<{
      id: string;
      title: string;
      path: string;
    }>) => {
      const item = {
        ...action.payload,
        timestamp: Date.now(),
      };
      
      // Remove existing item if present
      state.recentlyViewed = state.recentlyViewed.filter(
        (existing) => existing.id !== item.id
      );
      
      // Add to beginning
      state.recentlyViewed.unshift(item);
      
      // Keep only last 10 items
      state.recentlyViewed = state.recentlyViewed.slice(0, 10);
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    
    // Quick actions
    setQuickActions: (state, action: PayloadAction<typeof initialState.quickActions>) => {
      state.quickActions = action.payload;
    },
    addQuickAction: (state, action: PayloadAction<typeof initialState.quickActions[0]>) => {
      const exists = state.quickActions.find(item => item.id === action.payload.id);
      if (!exists) {
        state.quickActions.push(action.payload);
      }
    },
    removeQuickAction: (state, action: PayloadAction<string>) => {
      state.quickActions = state.quickActions.filter(
        item => item.id !== action.payload
      );
    },
    
    // Dashboard widgets
    setDashboardWidgets: (state, action: PayloadAction<typeof initialState.dashboardWidgets>) => {
      state.dashboardWidgets = action.payload;
    },
    addDashboardWidget: (state, action: PayloadAction<typeof initialState.dashboardWidgets[0]>) => {
      state.dashboardWidgets.push(action.payload);
    },
    updateDashboardWidget: (state, action: PayloadAction<{
      id: string;
      updates: Partial<typeof initialState.dashboardWidgets[0]>;
    }>) => {
      const index = state.dashboardWidgets.findIndex(
        widget => widget.id === action.payload.id
      );
      if (index !== -1) {
        state.dashboardWidgets[index] = {
          ...state.dashboardWidgets[index],
          ...action.payload.updates,
        };
      }
    },
    removeDashboardWidget: (state, action: PayloadAction<string>) => {
      state.dashboardWidgets = state.dashboardWidgets.filter(
        widget => widget.id !== action.payload
      );
    },
    
    // Reset actions
    resetFilters: (state) => {
      state.searchQuery = '';
      state.activeFilters = {};
    },
    resetUIState: (state) => {
      return {
        ...initialState,
        theme: state.theme, // Keep theme preference
        language: state.language, // Keep language preference
        recentlyViewed: state.recentlyViewed, // Keep recent items
      };
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  setGlobalLoading,
  setPageLoading,
  setNotification,
  clearNotification,
  openModal,
  closeModal,
  setSearchQuery,
  setActiveFilters,
  addFilter,
  removeFilter,
  clearFilters,
  setLayout,
  setLanguage,
  setPageSize,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
  setIsMobile,
  setIsTablet,
  setIsOnline,
  addRecentlyViewed,
  clearRecentlyViewed,
  setQuickActions,
  addQuickAction,
  removeQuickAction,
  setDashboardWidgets,
  addDashboardWidget,
  updateDashboardWidget,
  removeDashboardWidget,
  resetFilters,
  resetUIState,
} = uiSlice.actions;

export default uiSlice.reducer;
