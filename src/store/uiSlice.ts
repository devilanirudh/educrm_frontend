import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  sidebarCollapsed: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setNotification(
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' } | null>
    ) {
      state.notification = action.payload;
    },
  },
});

export const { toggleTheme, setSidebarOpen, toggleSidebar, setNotification } = uiSlice.actions;
export default uiSlice.reducer;