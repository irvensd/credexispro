import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, ChevronLeft, Home, Users, FileText, Briefcase, ListChecks, CreditCard, File, Star, Megaphone, Wrench, Settings, BookOpen, X, Clock, Target, Award, BarChart2 } from 'lucide-react';

const navItems: { label: string; path: string; icon: React.ReactNode; badge?: string }[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Why Credexis', path: '/why-credexis', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Clients', path: '/clients', icon: <Users className="w-5 h-5" /> },
  { label: 'Disputes', path: '/disputes', icon: <FileText className="w-5 h-5" /> },
  { label: 'Tasks', path: '/tasks', icon: <ListChecks className="w-5 h-5" /> },
  { label: 'Payments', path: '/payments', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Documents', path: '/documents', icon: <File className="w-5 h-5" /> },
  { label: 'Letter Templates', path: '/letter-templates', icon: <Star className="w-5 h-5" /> },
  { label: 'Marketing', path: '/marketing', icon: <Megaphone className="w-5 h-5" /> },
  { label: 'Credit Tools', path: '/credit-tools', icon: <Wrench className="w-5 h-5" /> },
  { label: 'Reports', path: '/reports', icon: <BarChart2 className="w-5 h-5" /> },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);

  // Close mobile menu when route changes
  useEffect(() => {
    setActivePath(window.location.pathname);
    setIsMobileMenuOpen(false);
  }, [window.location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                  Credexis
                </span>
              </Link>
            )}
            {isCollapsed && (
              <Link to="/" className="flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors
                      ${activePath === item.path
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    onClick={() => {
                      setActivePath(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                    {item.badge && !isCollapsed && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Roadmap Section */}
          <div className={`px-4 pt-2 pb-2 ${isCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
            {isCollapsed ? (
              <>
                <span className="text-indigo-400 font-bold">E</span>
                <span className="text-green-400 font-bold">C</span>
                <span className="text-yellow-400 font-bold">A</span>
              </>
            ) : (
              <>
                <div className="mb-2 font-semibold text-indigo-700 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Roadmap
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-700">Email Integration</span>
                    <span className="ml-auto text-xs bg-gradient-to-r from-blue-500/10 to-blue-400/10 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Q3 2024</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-50/50 rounded-lg px-3 py-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-gray-700">Client Portal</span>
                    <span className="ml-auto text-xs bg-gradient-to-r from-green-500/10 to-green-400/10 text-green-700 px-2 py-0.5 rounded-full font-semibold">Q3 2024</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-50/50 rounded-lg px-3 py-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-700">Automation</span>
                    <span className="ml-auto text-xs bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Q4 2024</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings Section */}
          <div className={`px-4 py-4 border-t border-gray-200 text-xs text-gray-400 bg-gradient-to-b from-white to-indigo-50/30 mt-auto ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed && <div className="mb-2 font-semibold text-gray-500">SETTINGS</div>}
            <Link
              to="/settings"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-50/50 hover:text-indigo-600 text-gray-500 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Settings className="w-5 h-5" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`} />
    </>
  );
}
