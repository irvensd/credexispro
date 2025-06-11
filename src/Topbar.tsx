import { useState, useRef, useEffect } from 'react';
import { AlertsDropdown } from './DashboardContent';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Menu, X, HelpCircle, BookOpen } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useMediaQuery } from 'react-responsive';

interface TopbarProps {
  onHelpClick: () => void;
  onQuickStartClick: () => void;
}

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
  '/settings': 'Settings',
  '/reports': 'Reports',
};

export default function Topbar({ onHelpClick, onQuickStartClick }: TopbarProps) {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const title = pageTitles[location.pathname] || 'Dashboard';

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setAlertsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          )}

          {/* Title */}
          <div className="flex-1 flex items-center justify-center sm:justify-start">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {title}
            </h1>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Quick Start Guide */}
            <button
              onClick={onQuickStartClick}
              className="p-2 rounded-full hover:bg-indigo-50 transition-colors"
              aria-label="Quick Start Guide"
            >
              <BookOpen className="h-5 w-5 text-gray-600" />
            </button>

            {/* Help */}
            <button
              onClick={onHelpClick}
              className="p-2 rounded-full hover:bg-indigo-50 transition-colors"
              aria-label="Help & Documentation"
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </button>

            {/* Alerts */}
            <div className="relative" ref={alertsRef}>
              <button
                className="relative p-2 rounded-full hover:bg-indigo-50 transition-colors"
                onClick={() => setAlertsOpen((o) => !o)}
                aria-label="View notifications"
              >
                <span role="img" aria-label="bell" className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <AlertsDropdown open={alertsOpen} />
            </div>

            {/* Theme toggle */}
            <button
              className="p-2 rounded-full hover:bg-indigo-50 transition-colors"
              aria-label="Toggle theme"
            >
              <span role="img" aria-label="theme" className="text-xl">🌞</span>
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className="hidden sm:block font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
                <span className="w-9 h-9 bg-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-700 ring-2 ring-indigo-400">
                  {user?.name?.[0] || 'U'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {Object.entries(pageTitles).map(([path, title]) => (
              <Link
                key={path}
                to={path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === path
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 