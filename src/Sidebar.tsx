import { Link } from 'react-router-dom';

type NavItem = {
  label: string;
  path?: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Why Credexis', path: '/why-credexis' },
  { label: 'Clients', path: '/clients' },
  { label: 'Disputes', path: '/disputes' },
  { label: 'Tasks' },
  { label: 'Payments' },
  { label: 'Documents' },
  { label: 'Letter Templates', badge: 'PRO' },
  { label: 'Marketing', badge: 'PRO' },
  { label: 'Credit Tools', badge: 'PRO' },
];

export default function Sidebar({ currentPath }: { currentPath?: string }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen shadow-sm">
      <div className="h-16 flex items-center px-8 text-2xl font-bold text-indigo-600 tracking-tight">Credexis</div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-gray-700 font-medium group ${currentPath === item.path ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-indigo-50'}`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{item.badge}</span>
              )}
            </Link>
          ) : (
            <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer text-gray-700 font-medium group">
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{item.badge}</span>
              )}
            </div>
          )
        ))}
      </nav>
      <div className="px-4 py-4 border-t text-xs text-gray-400 bg-gray-50">
        <div className="mb-2 font-semibold text-gray-500">SETTINGS</div>
        <div className="mb-1 cursor-pointer hover:text-indigo-600">Your Profile</div>
        <div className="mb-1 cursor-pointer hover:text-indigo-600">Settings</div>
        <div className="mb-4 cursor-pointer hover:text-indigo-600">Help & Support</div>
        <div className="mb-2 font-semibold text-gray-500">ROADMAP</div>
        <div className="mb-1">Email Integration <span className="text-[10px] bg-gray-100 px-1 rounded">Q3 2024</span></div>
        <div className="mb-1">Client Portal <span className="text-[10px] bg-gray-100 px-1 rounded">Q3 2024</span></div>
        <div className="mb-1">Automation <span className="text-[10px] bg-gray-100 px-1 rounded">Q4 2024</span></div>
      </div>
    </aside>
  );
} 