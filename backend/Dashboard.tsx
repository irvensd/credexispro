import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Bell,
  Download,
  UserPlus,
  FilePlus
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for dashboard
const dashboardStats = {
  totalClients: 127,
  activeClients: 89,
  completedCases: 38,
  monthlyRevenue: 12450,
  averageCreditIncrease: 87,
  totalDisputes: 342,
  resolvedDisputes: 256,
  pendingDisputes: 86,
  monthlyGrowth: 12.5,
  revenueGrowth: 8.3,
  clientSatisfaction: 94.2
};

const recentActivity = [
  {
    id: 1,
    type: 'client_added',
    message: 'New client John Smith added',
    time: '2 hours ago',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    id: 2,
    type: 'dispute_resolved',
    message: 'Dispute resolved for Maria Garcia (+25 points)',
    time: '4 hours ago',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: 3,
    type: 'payment_received',
    message: 'Payment received from David Wilson ($49)',
    time: '6 hours ago',
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    id: 4,
    type: 'dispute_submitted',
    message: 'New dispute submitted to Experian',
    time: '8 hours ago',
    icon: FileText,
    color: 'text-yellow-600'
  },
  {
    id: 5,
    type: 'client_milestone',
    message: 'Sarah Johnson reached 700+ credit score',
    time: '1 day ago',
    icon: Target,
    color: 'text-purple-600'
  }
];

const upcomingTasks = [
  {
    id: 1,
    task: 'Follow up with Experian on 3 pending disputes',
    priority: 'High',
    dueDate: 'Today',
    client: 'Multiple clients'
  },
  {
    id: 2,
    task: 'Send monthly progress report to John Smith',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    client: 'John Smith'
  },
  {
    id: 3,
    task: 'Schedule consultation with new lead',
    priority: 'High',
    dueDate: 'Jan 25',
    client: 'Potential Client'
  },
  {
    id: 4,
    task: 'Review and submit TransUnion disputes',
    priority: 'Medium',
    dueDate: 'Jan 26',
    client: 'Emily Davis'
  }
];

const topPerformingClients = [
  {
    id: 1,
    name: 'Michael Brown',
    creditIncrease: 140,
    startScore: 580,
    currentScore: 720,
    progress: 100,
    revenue: 1200
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    creditIncrease: 130,
    startScore: 620,
    currentScore: 750,
    progress: 100,
    revenue: 890
  },
  {
    id: 3,
    name: 'John Smith',
    creditIncrease: 85,
    startScore: 580,
    currentScore: 665,
    progress: 65,
    revenue: 450
  },
  {
    id: 4,
    name: 'David Wilson',
    creditIncrease: 75,
    startScore: 595,
    currentScore: 670,
    progress: 55,
    revenue: 675
  }
];

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('30d');

  const StatCard = ({ title, value, change, icon: Icon, trend, prefix = '', suffix = '' }: {
    title: string;
    value: number | string;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: 'up' | 'down';
    prefix?: string;
    suffix?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {change}% from last month
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
    </motion.div>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your credit repair business performance</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => toast.success('Add Client action!')}>
            <UserPlus size={18} /> Add Client
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={() => toast.success('New Dispute action!')}>
            <FilePlus size={18} /> New Dispute
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => toast.success('Exported!')}>
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Clients" value={dashboardStats.totalClients} change={dashboardStats.monthlyGrowth} icon={Users} trend="up" />
        <StatCard title="Active Clients" value={dashboardStats.activeClients} icon={Users} />
        <StatCard title="Monthly Revenue" value={dashboardStats.monthlyRevenue} prefix="$" change={dashboardStats.revenueGrowth} icon={DollarSign} trend="up" />
        <StatCard title="Avg. Credit Increase" value={dashboardStats.averageCreditIncrease} suffix=" pts" icon={TrendingUp} />
      </div>
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Completed Cases" value={dashboardStats.completedCases} icon={CheckCircle} />
        <StatCard title="Total Disputes" value={dashboardStats.totalDisputes} icon={FileText} />
        <StatCard title="Resolved Disputes" value={dashboardStats.resolvedDisputes} icon={CheckCircle} />
        <StatCard title="Pending Disputes" value={dashboardStats.pendingDisputes} icon={AlertTriangle} />
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full" />
            {recentActivity.map((activity, idx) => (
              <div key={activity.id} className="relative flex items-start gap-4 mb-8 last:mb-0">
                <div className={`absolute left-[-34px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 ${activity.color} border-current shadow-sm`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="ml-2">
                  <div className="font-medium text-gray-900">{activity.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex flex-col gap-1 p-4 rounded-lg border border-gray-100 hover:shadow transition bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{task.task}</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Clock size={14} /> {task.dueDate}
                  <span className="ml-2"><Users size={14} /> {task.client}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Performing Clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topPerformingClients.map(client => (
            <div key={client.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:shadow transition flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{client.name}</div>
                  <div className="text-xs text-gray-500">+{client.creditIncrease} pts</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Start: {client.startScore}</span>
                <span className="text-xs text-gray-500">Current: {client.currentScore}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${client.progress}%` }} />
              </div>
              <div className="text-xs text-gray-500">Revenue: <span className="font-semibold text-green-600">${client.revenue}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 