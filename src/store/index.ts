import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import clientsReducer from './features/clientsSlice';
import tasksReducer from './features/tasksSlice';
import settingsReducer from './features/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    tasks: tasksReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 