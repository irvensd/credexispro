import { useState } from 'react';
import type { Invoice } from './types/Invoice';
import type { Client } from './types/Client';

export default function Invoices() {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = invoices.filter(inv => {
    const client = clients.find(c => c.id === inv.clientId);
    const clientName = client ? `${client.firstName} ${client.lastName}` : '';
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <button className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-base">
          New Invoice
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
          placeholder="Search invoices or clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices</h3>
            <p className="mt-2 text-sm text-gray-500">Get started by creating your first invoice.</p>
            <div className="mt-6">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Invoice
              </button>
            </div>
          </div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-gray-400 text-xs bg-gray-50">
              <th className="py-3 px-4 text-left font-normal">Invoice #</th>
              <th className="py-3 px-4 text-left font-normal">Client</th>
              <th className="py-3 px-4 text-left font-normal">Status</th>
              <th className="py-3 px-4 text-left font-normal">Total</th>
              <th className="py-3 px-4 text-left font-normal">Due Date</th>
              <th className="py-3 px-4 text-left font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
                const client = clients.find(c => c.id === inv.clientId);
              return (
                <tr key={inv.id} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 text-gray-700">{client ? `${client.firstName} ${client.lastName}` : ''}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      inv.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      inv.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      inv.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">${inv.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-700">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="text-indigo-500 hover:text-indigo-700" title="View">View</button>
                    <button className="text-blue-500 hover:text-blue-700" title="Edit">Edit</button>
                    <button className="text-red-500 hover:text-red-700" title="Delete">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
} 