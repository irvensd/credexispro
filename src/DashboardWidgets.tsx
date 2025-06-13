import { useEffect, useState } from 'react';
import { User, FileText, CheckSquare, TrendingUp, Users, CheckCircle, AlarmClock, Timer } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function DashboardWidgets() {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    activeDisputes: 0,
    pendingTasks: 0,
    successRate: 0,
    activeClients: 0,
    resolvedDisputes: 0,
    highPriorityTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      // Total Clients
      const clientsSnap = await getDocs(collection(db, 'clients'));
      // Active Clients
      const activeClientsSnap = await getDocs(query(collection(db, 'clients'), where('status', '==', 'Active')));
      // Active Disputes
      const activeDisputesSnap = await getDocs(query(collection(db, 'disputes'), where('status', '==', 'Active')));
      // Resolved Disputes
      const resolvedDisputesSnap = await getDocs(query(collection(db, 'disputes'), where('status', '==', 'Resolved')));
      // Pending Tasks
      const pendingTasksSnap = await getDocs(query(collection(db, 'tasks'), where('status', '==', 'Pending')));
      // High Priority Tasks
      const highPriorityTasksSnap = await getDocs(query(collection(db, 'tasks'), where('priority', '==', 'High')));
      // Overdue Tasks
      const now = new Date();
      const tasksSnap = await getDocs(collection(db, 'tasks'));
      let overdueTasks = 0;
      tasksSnap.forEach(doc => {
        const data = doc.data();
        if (data.dueDate && new Date(data.dueDate) < now && data.status !== 'Completed') {
          overdueTasks++;
        }
      });
      // Success Rate (example: percent of resolved disputes)
      const totalDisputes = activeDisputesSnap.size + resolvedDisputesSnap.size;
      const successRate = totalDisputes > 0 ? Math.round((resolvedDisputesSnap.size / totalDisputes) * 100) : 0;
      setMetrics({
        totalClients: clientsSnap.size,
        activeDisputes: activeDisputesSnap.size,
        pendingTasks: pendingTasksSnap.size,
        successRate,
        activeClients: activeClientsSnap.size,
        resolvedDisputes: resolvedDisputesSnap.size,
        highPriorityTasks: highPriorityTasksSnap.size,
        overdueTasks,
      });
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  const widgets = [
    { label: 'Total Clients', value: metrics.totalClients, icon: <User className="w-6 h-6" />, iconBg: 'bg-indigo-100 text-indigo-600' },
    { label: 'Active Disputes', value: metrics.activeDisputes, icon: <FileText className="w-6 h-6" />, iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Pending Tasks', value: metrics.pendingTasks, icon: <CheckSquare className="w-6 h-6" />, iconBg: 'bg-purple-100 text-purple-600' },
    { label: 'Success Rate', value: loading ? '...' : `${metrics.successRate}%`, icon: <TrendingUp className="w-6 h-6" />, iconBg: 'bg-green-100 text-green-600' },
    { label: 'Active Clients', value: metrics.activeClients, icon: <Users className="w-6 h-6" />, iconBg: 'bg-green-100 text-green-600' },
    { label: 'Resolved Disputes', value: metrics.resolvedDisputes, icon: <CheckCircle className="w-6 h-6" />, iconBg: 'bg-green-100 text-green-600' },
    { label: 'High Priority Tasks', value: metrics.highPriorityTasks, icon: <AlarmClock className="w-6 h-6" />, iconBg: 'bg-orange-100 text-orange-600' },
    { label: 'Overdue Tasks', value: metrics.overdueTasks, icon: <Timer className="w-6 h-6" />, iconBg: 'bg-red-100 text-red-600' },
  ];

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
            <div className="text-2xl font-bold text-gray-900">{loading ? '...' : w.value}</div>
            <div className="text-sm text-gray-500 font-medium">{w.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 