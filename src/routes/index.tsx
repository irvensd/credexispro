import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import CookiePolicy from '../pages/legal/CookiePolicy';
import TermsOfService from '../pages/legal/TermsOfService';
import GDPRCompliance from '../pages/legal/GDPRCompliance';
import { PerformanceTestPage } from '../pages/performance/PerformanceTestPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'legal/privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'legal/cookies',
        element: <CookiePolicy />,
      },
      {
        path: 'legal/terms',
        element: <TermsOfService />,
      },
      {
        path: 'legal/gdpr',
        element: <GDPRCompliance />,
      },
      {
        path: 'performance',
        element: <PerformanceTestPage />,
      },
    ],
  },
]); 