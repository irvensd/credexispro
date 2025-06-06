import { useState } from 'react';
import { AlertsDropdown } from './DashboardContent';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/why-credexis': 'Why Credexis',
  '/clients': 'Clients',
  '/disputes': 'Disputes',
  '/tasks': 'Tasks',
  '/payments': 'Payments',
  '/documents': 'Documents',
  '/letter-templates': 'Letter Templates',
  '/marketing': 'Marketing',
  '/credit-tools': 'Credit Tools',
  '/settings': 'Your Profile',
  '/account-settings': 'Settings',
  '/help-support': 'Help & Support',
};

export default function Topbar() {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="text-xl font-bold tracking-tight text-gray-900">{title}</div>
      <div className="flex items-center space-x-4 relative">
        <div className="relative group">
          <button
            className="relative p-2 rounded-full hover:bg-indigo-50 transition-colors"
            onClick={() => setAlertsOpen((o) => !o)}
          >
            <span role="img" aria-label="bell" className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
            View Alerts & Notifications
          </span>
          <AlertsDropdown open={alertsOpen} />
        </div>
        <button className="p-2 rounded-full hover:bg-indigo-50 transition-colors">
          <span role="img" aria-label="theme" className="text-xl">🌞</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">Mike D</span>
          <span className="w-9 h-9 bg-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-700 ring-2 ring-indigo-400">M</span>
        </div>
      </div>
    </header>
  );
} 