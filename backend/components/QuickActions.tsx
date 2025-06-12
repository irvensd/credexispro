import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Zap,
  Upload,
  DollarSign,
  Mail,
  UserPlus,
  FilePlus,
  Download,
  FileText,
  Filter,
  ChevronUp,
  ChevronDown,
  Bell,
  Calendar,
  Target,
  Users,
  CreditCard,
  File,
  Star,
  Megaphone,
  Wrench,
  ClipboardList,
  BarChart2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  action: () => void;
  shortcut?: string;
  category: 'client' | 'dispute' | 'document' | 'communication' | 'analytics';
}

export default function QuickActions() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'add-client',
      label: 'Add Client',
      icon: <UserPlus className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Add a new client to your portfolio',
      action: () => {
        navigate('/clients?module=add');
        toast.success('Navigating to Add Client module');
      },
      shortcut: '⌘N',
      category: 'client',
    },
    {
      id: 'new-dispute',
      label: 'New Dispute',
      icon: <FilePlus className="w-5 h-5" />,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Start a new credit dispute',
      action: () => {
        navigate('/disputes?module=new');
        toast.success('Navigating to New Dispute module');
      },
      shortcut: '⌘D',
      category: 'dispute',
    },
    {
      id: 'upload-doc',
      label: 'Upload Document',
      icon: <Upload className="w-5 h-5" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Upload client documents',
      action: () => {
        navigate('/documents?module=upload');
        toast.success('Navigating to Upload Document module');
      },
      shortcut: '⌘U',
      category: 'document',
    },
    {
      id: 'record-payment',
      label: 'Record Payment',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      description: 'Record a new payment',
      action: () => {
        navigate('/payments?module=new');
        toast.success('Navigating to Record Payment module');
      },
      shortcut: '⌘P',
      category: 'client',
    },
    {
      id: 'create-task',
      label: 'Create Task',
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Create a new task or reminder',
      action: () => {
        navigate('/tasks?module=new');
        toast.success('Navigating to Create Task module');
      },
      shortcut: '⌘T',
      category: 'client',
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      icon: <BarChart2 className="w-5 h-5" />,
      color: 'bg-teal-600 hover:bg-teal-700',
      description: 'View client progress and analytics',
      action: () => {
        navigate('/reports?module=view');
        toast.success('Navigating to Reports module');
      },
      shortcut: '⌘R',
      category: 'analytics',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Actions' },
    { id: 'client', label: 'Client Management' },
    { id: 'dispute', label: 'Disputes' },
    { id: 'document', label: 'Documents' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const filteredActions = selectedCategory === 'all'
    ? quickActions
    : quickActions.filter(action => action.category === selectedCategory);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-indigo-500 text-xl">⚡</span>
          <h2 className="font-semibold text-lg text-gray-900">Quick Actions</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.map(action => (
          <motion.button
            key={action.id}
            onClick={action.action}
            className={`flex items-center gap-3 p-4 rounded-xl text-white ${action.color} transition-all hover:shadow-lg group`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              {action.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">{action.label}</div>
              <div className="text-sm text-white/80">{action.description}</div>
            </div>
            {action.shortcut && (
              <div className="text-xs bg-white/20 px-2 py-1 rounded">
                {action.shortcut}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
} 