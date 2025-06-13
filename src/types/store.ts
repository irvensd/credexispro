import type { Task, TaskTemplate, TaskFilter } from './task';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
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
  selectedTask: Task | null;
  templates: TaskTemplate[];
  loading: boolean;
  error: string | null;
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
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  tasks: TaskState;
  auth: AuthState;
  clients: ClientsState;
  settings: SettingsState;
}

export type { Task, TaskTemplate, TaskFilter }; 