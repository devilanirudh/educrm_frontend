import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

// Configure persistence for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user', 'token'], // Only persist these fields
};

// Configure persistence for UI slice (optional)
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'language'], // Only persist these fields
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: persistedUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;