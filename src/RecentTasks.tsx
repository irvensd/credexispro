import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

const tabs = ['All', 'Pending', 'Completed'];

export default function RecentTasks() {
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      let q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'), limit(6));
      if (activeTab === 'Pending') {
        q = query(collection(db, 'tasks'), where('status', '==', 'Pending'), orderBy('createdAt', 'desc'), limit(6));
      } else if (activeTab === 'Completed') {
        q = query(collection(db, 'tasks'), where('status', '==', 'Completed'), orderBy('createdAt', 'desc'), limit(6));
      }
      const snap = await getDocs(q);
      setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchTasks();
  }, [activeTab]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="font-semibold text-lg flex-1 text-gray-900">Recent Tasks</div>
        <div className="space-x-2">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150 border-none outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-indigo-50 ${activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">📝</span>
          <span>No recent tasks yet.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map(task => (
            <div key={task.id} className="flex items-center p-4 bg-indigo-50 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors group">
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-200 rounded-full mr-3 text-indigo-700 font-bold text-lg group-hover:scale-105 transition-transform">{task.title ? task.title[0] : '?'}</div>
              <div>
                <div className="font-medium text-gray-900">{task.title}</div>
                <div className="text-xs text-gray-500">{task.type || ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 