import { lazy } from 'react';
import { ROUTES } from './constants';

// Lazy load components with correct paths
const Home = lazy(() => import('../Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Clients = lazy(() => import('../Clients'));
// const ClientDetails = lazy(() => import('@/pages/clients/ClientDetails')); // Not found, comment out
const Tasks = lazy(() => import('../Tasks'));
// const TaskDetails = lazy(() => import('@/pages/tasks/TaskDetails')); // Not found, comment out
const Settings = lazy(() => import('../pages/settings/Settings'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Route configuration
export const routes = [
  {
    path: ROUTES.HOME,
    element: Home,
    public: true,
  },
  {
    path: ROUTES.LOGIN,
    element: Login,
    public: true,
  },
  {
    path: ROUTES.REGISTER,
    element: Register,
    public: true,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: ForgotPassword,
    public: true,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: ResetPassword,
    public: true,
  },
  {
    path: ROUTES.DASHBOARD,
    element: Dashboard,
    public: false,
  },
  {
    path: ROUTES.CLIENTS,
    element: Clients,
    public: false,
  },
  // {
  //   path: `${ROUTES.CLIENTS}/:id`,
  //   element: ClientDetails,
  //   public: false,
  // },
  {
    path: ROUTES.TASKS,
    element: Tasks,
    public: false,
  },
  // {
  //   path: `${ROUTES.TASKS}/:id`,
  //   element: TaskDetails,
  //   public: false,
  // },
  {
    path: ROUTES.SETTINGS,
    element: Settings,
    public: false,
  },
  {
    path: ROUTES.PROFILE,
    element: Profile,
    public: false,
  },
  {
    path: '*',
    element: NotFound,
    public: true,
  },
] as const;

// Navigation menu items
export const navigationItems = [
  {
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    public: false,
  },
  {
    title: 'Clients',
    path: ROUTES.CLIENTS,
    icon: 'people',
    public: false,
  },
  {
    title: 'Tasks',
    path: ROUTES.TASKS,
    icon: 'task',
    public: false,
  },
  {
    title: 'Settings',
    path: ROUTES.SETTINGS,
    icon: 'settings',
    public: false,
  },
] as const;

// Auth routes
export const authRoutes = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

// Public routes
export const publicRoutes = [
  ROUTES.HOME,
  ...authRoutes,
] as const;

// Route types
export type Route = typeof routes[number];
export type NavigationItem = typeof navigationItems[number];

// Route guards
export const isPublicRoute = (path: string): boolean => {
  return publicRoutes.includes(path as typeof publicRoutes[number]);
};

export const isAuthRoute = (path: string): boolean => {
  return authRoutes.includes(path as typeof authRoutes[number]);
};

// Route helpers
export const getRouteByPath = (path: string): Route | undefined => {
  return routes.find((route) => route.path === path);
};

export const getNavigationItems = (isAuthenticated: boolean): NavigationItem[] => {
  return navigationItems.filter((item) => item.public || isAuthenticated);
}; 