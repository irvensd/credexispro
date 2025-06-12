import type { Task, TaskTemplate, TaskFilter } from './task';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  emailVerified: boolean;
  passwordResetRequested: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
}

export interface TaskState {
  tasks: Task[];
  templates: TaskTemplate[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  filters: TaskFilter;
}

export interface ThemeSettings {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  sound: boolean;
}

export interface SettingsState {
  theme: ThemeSettings;
  notifications: NotificationSettings;
  language: string;
  timezone: string;
  dateFormat: string;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  clients: ClientsState;
  tasks: TaskState;
  settings: SettingsState;
} 