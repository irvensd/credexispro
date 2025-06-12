import { User, FileText, CheckSquare, TrendingUp, Users, CheckCircle, AlarmClock, Timer } from 'lucide-react';

const widgets = [
  { label: 'Total Clients', value: 1, change: '+12% from last month', icon: <User className="w-6 h-6" />, iconBg: 'bg-indigo-100 text-indigo-600', trend: 'up', trendColor: 'text-green-500' },
  { label: 'Active Disputes', value: 1, change: '+8% from last month', icon: <FileText className="w-6 h-6" />, iconBg: 'bg-blue-100 text-blue-600', trend: 'up', trendColor: 'text-green-500' },
  { label: 'Pending Tasks', value: 1, change: '-5% from last month', icon: <CheckSquare className="w-6 h-6" />, iconBg: 'bg-purple-100 text-purple-600', trend: 'down', trendColor: 'text-red-500' },
  { label: 'Success Rate', value: '0%', change: '+3% from last month', icon: <TrendingUp className="w-6 h-6" />, iconBg: 'bg-green-100 text-green-600', trend: 'up', trendColor: 'text-green-500' },
  { label: 'Active Clients', value: 1, icon: <Users className="w-6 h-6" />, iconBg: 'bg-green-100 text-green-600' },
  { label: 'Resolved Disputes', value: 0, icon: <CheckCircle className="w-6 h-6" />, iconBg: 'bg-green-100 text-green-600' },
  { label: 'High Priority Tasks', value: 1, icon: <AlarmClock className="w-6 h-6" />, iconBg: 'bg-orange-100 text-orange-600' },
  { label: 'Overdue Tasks', value: 0, icon: <Timer className="w-6 h-6" />, iconBg: 'bg-red-100 text-red-600' },
];

export default function DashboardWidgets() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {widgets.map((w) => (
        <div
          key={w.label}
          className="flex items-center p-5 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow group cursor-pointer border border-gray-100"
        >
          <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold mr-4 ${w.iconBg} group-hover:scale-105 transition-transform`}>
            {w.icon}
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900">{w.value}</div>
            <div className="text-sm text-gray-500 font-medium">{w.label}</div>
            {w.change && (
              <div className={`text-xs mt-1 ${w.trendColor}`}>{w.change}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 