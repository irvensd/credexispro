import DashboardWidgets from './DashboardWidgets';
import RecentTasks from './RecentTasks';
import RecentClients from './RecentClients';
import Analytics from './Analytics';
import ClientGrowth from './ClientGrowth';
import { motion } from 'framer-motion';
import { PhoneCall, MessageCircle, Calendar, Plus, Zap, Upload, DollarSign, Mail, User, TrendingUp, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

const alertsData = [
  { type: 'urgent', icon: '⚠️', message: 'Overdue Task: Follow up with John Doe', time: '2h ago' },
  { type: 'info', icon: '📄', message: 'New Dispute Filed for Jane Smith', time: '4h ago' },
  { type: 'reminder', icon: '📅', message: 'Upcoming Appointment: Call with Mike D', time: 'Tomorrow 10:00am' },
  { type: 'warning', icon: '🗂️', message: 'Document Expiry: Proof of Address for Sarah Lee', time: '3 days left' },
];

// AlertsDropdown component for Topbar
export function AlertsDropdown({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
      <div className="font-semibold text-base px-4 pt-4 pb-2 text-gray-900 flex items-center gap-2">
        <span className="text-yellow-500 text-lg">🔔</span> Alerts & Notifications
      </div>
      <ul className="divide-y divide-gray-100 px-2 pb-2">
        {alertsData.map((alert, idx) => (
          <li key={idx} className="flex items-center gap-3 py-3">
            <span className={`text-xl ${alert.type === 'urgent' ? 'text-red-500' : alert.type === 'warning' ? 'text-yellow-500' : alert.type === 'reminder' ? 'text-indigo-500' : 'text-blue-500'}`}>{alert.icon}</span>
            <div className="flex-1">
              <div className="text-sm text-gray-900 font-medium">{alert.message}</div>
              <div className="text-xs text-gray-400">{alert.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const appointmentsData = [
  { icon: <PhoneCall className="w-5 h-5" />, client: 'John Doe', type: 'Phone Call', time: 'Today, 2:00pm' },
  { icon: <MessageCircle className="w-5 h-5" />, client: 'Jane Smith', type: 'Consultation', time: 'Tomorrow, 10:00am' },
  { icon: <Calendar className="w-5 h-5" />, client: 'Sarah Lee', type: 'Follow-up', time: 'Friday, 1:30pm' },
];

const activityData = [
  { icon: <User className="w-5 h-5" />, user: 'Mike D', action: 'Added a new client: John Doe', time: '5m ago' },
  { icon: <Zap className="w-5 h-5" />, user: 'Mike D', action: 'Filed a dispute for Jane Smith', time: '1h ago' },
  { icon: <DollarSign className="w-5 h-5" />, user: 'Mike D', action: 'Recorded payment from Sarah Lee', time: '3h ago' },
  { icon: <Mail className="w-5 h-5" />, user: 'Mike D', action: 'Sent a letter to Experian', time: 'Yesterday' },
];

const RecentActivity = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof activityData>([]);
  useEffect(() => {
    setTimeout(() => {
      setData(activityData); // Replace with [] to test empty state
      setLoading(false);
    }, 1200);
  }, []);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 min-h-[120px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
        <span className="text-indigo-500 text-xl">🕒</span> Recent Activity
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">🕒</span>
          <span>No recent activity yet.</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {data.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 py-3">
              <span className="text-2xl text-indigo-500">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{item.action}</div>
                <div className="text-xs text-gray-400">{item.user} &bull; {item.time}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const UpcomingAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof appointmentsData>([]);
  useEffect(() => {
    setTimeout(() => {
      setData(appointmentsData); // Replace with [] to test empty state
      setLoading(false);
    }, 1200);
  }, []);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 min-h-[120px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
        <span className="text-indigo-500 text-xl">📅</span> Upcoming Appointments
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">📅</span>
          <span>No upcoming appointments.</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {data.map((appt, idx) => (
            <li key={idx} className="flex items-center gap-3 py-3">
              <span className="text-2xl text-indigo-500">{appt.icon}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{appt.client}</div>
                <div className="text-xs text-gray-500">{appt.type} &bull; {appt.time}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const quickActions = [
  { icon: <Plus className="w-5 h-5" />, label: 'Add Client' },
  { icon: <Zap className="w-5 h-5" />, label: 'Start Dispute' },
  { icon: <Upload className="w-5 h-5" />, label: 'Upload Doc' },
  { icon: <DollarSign className="w-5 h-5" />, label: 'Record Payment' },
  { icon: <Mail className="w-5 h-5" />, label: 'Send Letter' },
];

const QuickActions = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
    <div className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
      <span className="text-indigo-500 text-xl">⚡</span> Quick Actions
    </div>
    <div className="flex flex-wrap gap-3">
      {quickActions.map((action, idx) => (
        <button
          key={idx}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold shadow hover:bg-indigo-100 transition text-sm"
        >
          <span className="text-lg">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  </div>
);

const trendsData = [
  { label: 'Dispute Success', value: '68%', trend: '+5%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600', chart: 'bar' },
  { label: 'Client Growth', value: '12', trend: '+2', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', chart: 'line' },
  { label: 'Revenue', value: '$2,400', trend: '+$200', icon: <DollarSign className="w-5 h-5" />, color: 'text-indigo-600', chart: 'bar' },
];

const PerformanceTrends = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof trendsData>([]);
  useEffect(() => {
    setTimeout(() => {
      setData(trendsData); // Replace with [] to test empty state
      setLoading(false);
    }, 1200);
  }, []);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 min-h-[120px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
        <span className="text-green-500 text-xl">📊</span> Performance Trends
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">📊</span>
          <span>No performance trends yet.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.map((trend, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
              <span className={`text-2xl ${trend.color}`}>{trend.icon}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{trend.label}</div>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-900">{trend.value}</span>
                  <span className="text-xs font-semibold text-green-500">{trend.trend}</span>
                </div>
                <div className="h-2 mt-2 bg-gradient-to-r from-indigo-200 to-indigo-400 rounded-full w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const leaderboardData = [
  { name: 'John Doe', avatar: <User className="w-6 h-6" />, metric: 'Payments', value: '$1,200' },
  { name: 'Jane Smith', avatar: <User className="w-6 h-6" />, metric: 'Disputes Won', value: '5' },
  { name: 'Sarah Lee', avatar: <User className="w-6 h-6" />, metric: 'Active Disputes', value: '3' },
];

const ClientLeaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof leaderboardData>([]);
  useEffect(() => {
    setTimeout(() => {
      setData(leaderboardData); // Replace with [] to test empty state
      setLoading(false);
    }, 1200);
  }, []);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 min-h-[120px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
        <span className="text-indigo-500 text-xl">🏆</span> Client Leaderboard
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">🏆</span>
          <span>No leaderboard data yet.</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {data.map((client, idx) => (
            <li key={idx} className="flex items-center gap-3 py-3">
              <span className="text-2xl bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">{client.avatar}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{client.name}</div>
                <div className="text-xs text-gray-500">{client.metric}</div>
              </div>
              <span className="font-bold text-indigo-600 text-sm">{client.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function DashboardContent() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  return (
    <div className="space-y-12">
      {showOnboarding && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-indigo-600 text-2xl">🚀</span>
            <span className="text-indigo-900 font-semibold">Welcome to your new dashboard! Explore quick actions, analytics, and more. Need help? Click any <span className='underline'>info</span> icon.</span>
          </div>
          <button
            className="ml-4 px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
            onClick={() => setShowOnboarding(false)}
          >
            Dismiss
          </button>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><DashboardWidgets /></motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><QuickActions /></motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}><UpcomingAppointments /></motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}><RecentTasks /></motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}><RecentActivity /></motion.div>
          </div>
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><Analytics /></motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}><PerformanceTrends /></motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}><ClientLeaderboard /></motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}><ClientGrowth /></motion.div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Clients</h2>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}><RecentClients /></motion.div>
      </div>
    </div>
  );
} 