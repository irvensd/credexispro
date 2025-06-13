import DashboardWidgets from './DashboardWidgets';
import RecentTasks from './RecentTasks';
import RecentClients from './RecentClients';
import Analytics from './Analytics';
import ClientGrowth from './ClientGrowth';
import { motion } from 'framer-motion';
import { PhoneCall, MessageCircle, Calendar, DollarSign, Mail, User, TrendingUp, Users, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import QuickActions from './components/QuickActions';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

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
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
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
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesRef = collection(db, 'activity');
        const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        
        const activities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));

        setActivities(activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client_added':
        return <User className="w-5 h-5" />;
      case 'dispute_filed':
        return <Zap className="w-5 h-5" />;
      case 'payment_received':
        return <DollarSign className="w-5 h-5" />;
      case 'letter_sent':
        return <Mail className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

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
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">🕒</span>
          <span>No recent activity yet.</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center gap-3 py-3">
              <span className="text-2xl text-indigo-500">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{activity.description}</div>
                <div className="text-xs text-gray-400">{activity.user} &bull; {formatTimeAgo(activity.timestamp)}</div>
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
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const now = new Date();
        const tasksRef = collection(db, 'tasks');
        const q = query(
          tasksRef,
          where('type', '==', 'Appointment'),
          where('status', 'in', ['Pending', 'In Progress'])
        );
        const querySnapshot = await getDocs(q);
        
        const appointments = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            dueDate: doc.data().dueDate?.toDate()
          }))
          .filter(appt => appt.dueDate >= now)
          .sort((a, b) => a.dueDate - b.dueDate)
          .slice(0, 3);

        setAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'Phone Call':
        return <PhoneCall className="w-5 h-5" />;
      case 'Consultation':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const formatAppointmentTime = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

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
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">📅</span>
          <span>No upcoming appointments.</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {appointments.map((appt) => (
            <li key={appt.id} className="flex items-center gap-3 py-3">
              <span className="text-2xl text-indigo-500">{getAppointmentIcon(appt.type)}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-900 font-medium">{appt.client}</div>
                <div className="text-xs text-gray-500">{appt.type} &bull; {formatAppointmentTime(appt.dueDate)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PerformanceTrends = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([
    { label: 'Dispute Success', value: '0%', trend: '+0%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600', chart: 'bar' },
    { label: 'Client Growth', value: '0', trend: '+0', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', chart: 'line' },
    { label: 'Revenue', value: '$0', trend: '+$0', icon: <DollarSign className="w-5 h-5" />, color: 'text-indigo-600', chart: 'bar' },
  ]);
  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      // Dispute Success
      const resolvedSnap = await getDocs(query(collection(db, 'disputes'), where('status', '==', 'Resolved')));
      const totalSnap = await getDocs(collection(db, 'disputes'));
      const disputeSuccess = totalSnap.size > 0 ? Math.round((resolvedSnap.size / totalSnap.size) * 100) : 0;
      // Client Growth (last 30 days)
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      const clientsSnap = await getDocs(collection(db, 'clients'));
      const newClients = clientsSnap.docs.filter(doc => {
        const data = doc.data();
        return data.joinDate && new Date(data.joinDate) >= lastMonth;
      }).length;
      // Revenue (last 30 days)
      let revenue = 0;
      let revenueChange = 0;
      const paymentsSnap = await getDocs(collection(db, 'payments'));
      paymentsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.date && new Date(data.date) >= lastMonth) {
          revenue += Number(data.amount) || 0;
        }
        // Optionally, calculate revenueChange here if you have previous period data
      });
      setData([
        { label: 'Dispute Success', value: `${disputeSuccess}%`, trend: '', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600', chart: 'bar' },
        { label: 'Client Growth', value: `${newClients}`, trend: '', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', chart: 'line' },
        { label: 'Revenue', value: `$${revenue.toLocaleString()}`, trend: '', icon: <DollarSign className="w-5 h-5" />, color: 'text-indigo-600', chart: 'bar' },
      ]);
      setLoading(false);
    };
    fetchTrends();
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
                  {trend.trend && <span className="text-xs font-semibold text-green-500">{trend.trend}</span>}
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

const ClientLeaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setData([]); // Always empty until real data is implemented
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