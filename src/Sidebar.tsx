import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, ChevronLeft, Home, Users, FileText, Briefcase, ListChecks, CreditCard, File, Star, Megaphone, Wrench, User, Settings, HelpCircle, BookOpen } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Why Credexis', path: '/why-credexis', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Clients', path: '/clients', icon: <Users className="w-5 h-5" /> },
  { label: 'Disputes', path: '/disputes', icon: <FileText className="w-5 h-5" /> },
  { label: 'Tasks', path: '/tasks', icon: <ListChecks className="w-5 h-5" /> },
  { label: 'Payments', path: '/payments', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Documents', path: '/documents', icon: <File className="w-5 h-5" /> },
  { label: 'Letter Templates', path: '/letter-templates', badge: 'PRO', icon: <Star className="w-5 h-5" /> },
  { label: 'Marketing', path: '/marketing', badge: 'PRO', icon: <Megaphone className="w-5 h-5" /> },
  { label: 'Credit Tools', path: '/credit-tools', badge: 'PRO', icon: <Wrench className="w-5 h-5" /> },
];

export default function Sidebar({ currentPath }: { currentPath?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`bg-gradient-to-b from-white to-indigo-50 border-r border-gray-200 flex flex-col min-h-screen shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-8'} text-2xl font-bold text-indigo-600 tracking-tight transition-all duration-300`}>
        <span className={`${collapsed ? 'hidden' : 'block'}`}>Credexis</span>
        <button
          className={`ml-auto p-2 rounded hover:bg-indigo-50 transition ${collapsed ? 'mx-auto' : ''}`}
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="w-6 h-6 text-indigo-600" /> : <ChevronLeft className="w-6 h-6 text-indigo-600" />}
        </button>
      </div>
      <nav className={`flex-1 px-4 py-4 space-y-1 ${collapsed ? 'px-2' : ''}`}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer font-medium group ${isActive ? 'bg-indigo-100 text-indigo-700 font-bold shadow-sm' : 'text-gray-700 hover:bg-indigo-50'} ${collapsed ? 'justify-center' : ''}`}
            >
              {/* Active indicator bar */}
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-indigo-500 rounded-full" />}
              <span className="z-10">{item.icon}</span>
              {!collapsed && <span className="z-10">{item.label}</span>}
              {item.badge && !collapsed && (
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{item.badge}</span>
              )}
            </Link>
          ) : null;
        })}
      </nav>
      {/* Roadmap section at the bottom */}
      <div className={`px-4 pt-2 pb-2 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        {collapsed ? (
          <>
            <span className="text-indigo-400 font-bold">E</span>
            <span className="text-green-400 font-bold">C</span>
            <span className="text-yellow-400 font-bold">A</span>
          </>
        ) : (
          <>
            <div className="mb-2 font-semibold text-indigo-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6" /></svg>
              Roadmap
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-8 0V8a4 4 0 018 0v4" /></svg>
                <span className="font-medium text-gray-700">Email Integration</span>
                <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Q3 2024</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                <span className="font-medium text-gray-700">Client Portal</span>
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Q3 2024</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                <span className="font-medium text-gray-700">Automation</span>
                <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Q4 2024</span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={`px-4 py-4 border-t text-xs text-gray-400 bg-gray-50 mt-auto ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && <div className="mb-2 font-semibold text-gray-500">SETTINGS</div>}
        <Link to="/settings" className={`mb-1 block cursor-pointer hover:text-indigo-600 text-gray-500 ${collapsed ? 'text-center' : ''}`}>{collapsed ? <User className="w-5 h-5 mx-auto" /> : 'Your Profile'}</Link>
        <Link to="/account-settings" className={`mb-1 block cursor-pointer hover:text-indigo-600 text-gray-500 ${collapsed ? 'text-center' : ''}`}>{collapsed ? <Settings className="w-5 h-5 mx-auto" /> : 'Settings'}</Link>
        <Link to="/help-support" className={`mb-4 block cursor-pointer hover:text-indigo-600 text-gray-500 ${collapsed ? 'text-center' : ''}`}>{collapsed ? <HelpCircle className="w-5 h-5 mx-auto" /> : 'Help & Support'}</Link>
      </div>
    </aside>
  );
}
