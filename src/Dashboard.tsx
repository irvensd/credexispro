import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight,
  ArrowDownRight,
  Download,
  UserPlus,
  FilePlus
} from 'lucide-react';
import toast from 'react-hot-toast';

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
        <StatCard title="Total Clients" value={0} change={0} icon={Users} trend="up" />
        <StatCard title="Active Clients" value={0} icon={Users} />
        <StatCard title="Monthly Revenue" value={0} prefix="$" change={0} icon={DollarSign} trend="up" />
        <StatCard title="Avg. Credit Increase" value={0} suffix=" pts" icon={TrendingUp} />
      </div>
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Completed Cases" value={0} icon={CheckCircle} />
        <StatCard title="Total Disputes" value={0} icon={FileText} />
        <StatCard title="Resolved Disputes" value={0} icon={CheckCircle} />
        <StatCard title="Pending Disputes" value={0} icon={AlertTriangle} />
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full" />
            {[]}
          </div>
        </div>
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {[]}
          </div>
        </div>
      </div>
      {/* Top Performing Clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[]}
        </div>
      </div>
    </div>
  );
} 