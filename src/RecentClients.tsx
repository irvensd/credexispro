import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { Client } from './types/Client';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function RecentClients() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchRecentClients = async () => {
      try {
        const clientsRef = collection(db, 'clients');
        const q = query(clientsRef, orderBy('createdAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        
        const clientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Client[];

        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching recent clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentClients();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[180px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900">Recent Clients</div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">👥</span>
          <span>No recent clients yet.</span>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left font-normal pb-2">Name</th>
              <th className="text-left font-normal pb-2">Email</th>
              <th className="text-left font-normal pb-2">Status</th>
              <th className="text-left font-normal pb-2">Added</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {getInitials(`${client.firstName} ${client.lastName}`)}
                  </span>
                  <span className="font-medium text-gray-900">{`${client.firstName} ${client.lastName}`}</span>
                </td>
                <td className="py-3 text-gray-700">{client.email}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    client.status === 'Active' ? 'bg-green-100 text-green-700' :
                    client.status === 'Inactive' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{formatTimeAgo(client.createdAt || client.joinDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 