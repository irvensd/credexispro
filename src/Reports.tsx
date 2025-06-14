import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function formatDate(dateVal: any) {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') return new Date(dateVal).toLocaleDateString();
  if (dateVal.seconds) return new Date(dateVal.seconds * 1000).toLocaleDateString();
  return '';
}

const Reports = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [clientsSnap, tasksSnap, disputesSnap] = await Promise.all([
        getDocs(collection(db, 'clients')),
        getDocs(collection(db, 'tasks')),
        getDocs(collection(db, 'disputes')),
      ]);
      setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTasks(tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setDisputes(disputesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    })();
  }, []);

  // Summary stats
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const resolvedDisputes = disputes.filter(d => d.status === 'Resolved').length;
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;

  // Simple trend data for charts
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const clientsByMonth = months.map(m => clients.filter(c => {
    const dateVal = c.createdAt || c.joinDate;
    let date;
    if (typeof dateVal === 'string') date = new Date(dateVal);
    else if (dateVal && dateVal.seconds) date = new Date(dateVal.seconds * 1000);
    else return false;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` === m;
  }).length);
  const revenueByMonth = months.map(m => clients.filter(c => {
    const dateVal = c.createdAt || c.joinDate;
    let date;
    if (typeof dateVal === 'string') date = new Date(dateVal);
    else if (dateVal && dateVal.seconds) date = new Date(dateVal.seconds * 1000);
    else return false;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` === m;
  }).reduce((sum, c) => sum + (c.totalPaid || 0), 0));

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Business Reports</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-indigo-600 text-3xl mb-2">👥</span>
          <div className="text-2xl font-bold">{clients.length}</div>
          <div className="text-gray-600">Total Clients</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-green-600 text-3xl mb-2">💰</span>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <div className="text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-blue-600 text-3xl mb-2">✅</span>
          <div className="text-2xl font-bold">{resolvedDisputes}</div>
          <div className="text-gray-600">Resolved Disputes</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-purple-600 text-3xl mb-2">📝</span>
          <div className="text-2xl font-bold">{pendingTasks}</div>
          <div className="text-gray-600">Pending Tasks</div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Client Growth (Last 6 Months)</h2>
          <div className="flex items-end gap-2 h-40">
            {clientsByMonth.map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-8 rounded-t-lg bg-indigo-400 transition-all" style={{ height: `${val * 12}px` }}></div>
                <span className="text-xs text-gray-500 mt-1">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend (Last 6 Months)</h2>
          <div className="flex items-end gap-2 h-40">
            {revenueByMonth.map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-8 rounded-t-lg bg-green-400 transition-all" style={{ height: `${val / 100 * 12}px` }}></div>
                <span className="text-xs text-gray-500 mt-1">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filterable Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Clients</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs">
                <th className="text-left font-normal pb-2">Name</th>
                <th className="text-left font-normal pb-2">Email</th>
                <th className="text-left font-normal pb-2">Status</th>
                <th className="text-left font-normal pb-2">Joined</th>
                <th className="text-left font-normal pb-2">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-2 font-medium text-gray-900">{client.firstName} {client.lastName}</td>
                  <td className="py-2 text-gray-700">{client.email}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      client.status === 'Active' ? 'bg-green-100 text-green-700' :
                      client.status === 'Inactive' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">{formatDate(client.createdAt || client.joinDate)}</td>
                  <td className="py-2 text-gray-900">${(client.totalPaid || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Disputes Table */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Disputes</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs">
                <th className="text-left font-normal pb-2">Client</th>
                <th className="text-left font-normal pb-2">Type</th>
                <th className="text-left font-normal pb-2">Status</th>
                <th className="text-left font-normal pb-2">Priority</th>
                <th className="text-left font-normal pb-2">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map(dispute => (
                <tr key={dispute.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-2 font-medium text-gray-900">{dispute.client}</td>
                  <td className="py-2 text-gray-700">{dispute.type}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      dispute.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      dispute.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      dispute.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      dispute.status === 'Submitted' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-700">{dispute.priority}</td>
                  <td className="py-2 text-gray-500">{formatDate(dispute.lastUpdated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto mb-10">
        <h2 className="text-lg font-semibold mb-4">Tasks</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs">
              <th className="text-left font-normal pb-2">Title</th>
              <th className="text-left font-normal pb-2">Status</th>
              <th className="text-left font-normal pb-2">Priority</th>
              <th className="text-left font-normal pb-2">Assignee</th>
              <th className="text-left font-normal pb-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2 font-medium text-gray-900">{task.title}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    task.status === 'blocked' ? 'bg-red-100 text-red-700' :
                    task.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-2 text-gray-700">{task.priority}</td>
                <td className="py-2 text-gray-700">{task.assignee?.name || '-'}</td>
                <td className="py-2 text-gray-500">{formatDate(task.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Export Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          onClick={() => exportTableToCSV(clients, 'clients.csv')}
        >
          Export Clients CSV
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => exportTableToCSV(disputes, 'disputes.csv')}
        >
          Export Disputes CSV
        </button>
        <button
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          onClick={() => exportTableToCSV(tasks, 'tasks.csv')}
        >
          Export Tasks CSV
        </button>
      </div>
    </div>
  );
};

function exportTableToCSV(data: any[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [keys.join(',')].concat(
    data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default Reports; 