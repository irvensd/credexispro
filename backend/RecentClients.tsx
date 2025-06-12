import { useState, useEffect } from 'react';

const clients = [
  { name: 'John Doe', email: 'john.doe@example.com', status: 'Active', added: 'about 1 hour ago' },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function RecentClients() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof clients>([]);

  useEffect(() => {
    setTimeout(() => {
      setData(clients); // Replace with [] to test empty state
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[180px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900">Recent Clients</div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
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
            {data.map(client => (
              <tr key={client.email} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{getInitials(client.name)}</span>
                  <span className="font-medium text-gray-900">{client.name}</span>
                </td>
                <td className="py-3 text-gray-700">{client.email}</td>
                <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{client.status}</span></td>
                <td className="py-3 text-gray-500">{client.added}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 