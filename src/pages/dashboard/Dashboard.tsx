import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Activity, BarChart2, Clock, Users } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setTotalUsers(usersSnapshot.size);

      // Fetch recent activity (last 5)
      try {
        const activityQuery = query(collection(db, 'activity'), orderBy('timestamp', 'desc'), limit(5));
        const activitySnapshot = await getDocs(activityQuery);
        setRecentActivity(activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        setRecentActivity([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.email}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-green-100 p-2">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-yellow-100 p-2">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">0ms</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-purple-100 p-2">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No recent activity to display</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-3 flex items-center justify-between">
                <span className="text-gray-700">{activity.description || 'Activity'}</span>
                <span className="text-xs text-gray-400">{activity.timestamp ? new Date(activity.timestamp.seconds * 1000).toLocaleString() : ''}</span>
              </li>
          ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 