import { useState } from 'react';
import type { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Menu, X } from 'lucide-react';
import Topbar from '../Topbar';

interface LayoutProps {
  children: ReactNode;
}

// Temporary Sidebar component until we create the actual one
const Sidebar = () => (
  <div className="h-full bg-white border-r border-gray-200">
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900">Credexis Pro</h2>
    </div>
    <nav className="mt-4">
      {/* Add navigation items here */}
    </nav>
  </div>
);

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
          isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isMobile ? 'ml-0' : 'ml-64'
        }`}
      >
        <Topbar />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 