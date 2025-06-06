import { useState, useEffect } from 'react';
import { UserPlus, Search, Eye, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockClients = [
  { name: 'John Doe', email: 'john.doe@example.com', status: 'Active', added: 'about 1 hour ago', phone: '555-1234', notes: 'VIP client, prefers email.' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Active', added: '2 days ago', phone: '555-5678', notes: 'Follow up next week.' },
  { name: 'Sarah Lee', email: 'sarah.lee@example.com', status: 'Inactive', added: '1 week ago', phone: '555-8765', notes: 'No recent activity.' },
  { name: 'Mike D', email: 'mike.d@example.com', status: 'Active', added: '3 weeks ago', phone: '555-4321', notes: 'Interested in premium plan.' },
];

const emptyClient = { name: '', email: '', status: 'Active', phone: '', notes: '', added: 'just now' };

const PAGE_SIZE = 10;

export default function Clients() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<typeof mockClients>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof mockClients[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyClient });
  const [formError, setFormError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setClients(mockClients);
      setLoading(false);
    }, 1200);
  }, []);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk actions
  const allChecked = paginated.length > 0 && paginated.every(c => checked.includes(c.email));
  const someChecked = paginated.some(c => checked.includes(c.email));

  function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }
    if (editIndex !== null) {
      // Edit
      setClients(clients => clients.map((c, i) => i === editIndex ? { ...form } : c));
    } else {
      // Add
      setClients([{ ...form }, ...clients]);
    }
    setShowAdd(false);
    setForm({ ...emptyClient });
    setFormError('');
    setEditIndex(null);
  }

  function handleEdit(client: typeof mockClients[0], idx: number) {
    setForm(client);
    setEditIndex(idx);
    setShowAdd(true);
  }

  function handleCheck(email: string, checkedVal: boolean) {
    setChecked(prev => checkedVal ? [...prev, email] : prev.filter(e => e !== email));
  }

  function handleCheckAll(checkedVal: boolean) {
    setChecked(checkedVal ? paginated.map(c => c.email) : checked.filter(e => !paginated.map(c => c.email).includes(e)));
  }

  function handleBulkDelete() {
    setClients(clients => clients.filter(c => !checked.includes(c.email)));
    setChecked([]);
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-base" onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyClient }); }}>
          <UserPlus className="w-5 h-5" /> Add Client
        </button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        {someChecked && (
          <button className="ml-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={handleBulkDelete}>
            Delete Selected
          </button>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <span className="text-4xl mb-2">👥</span>
          <span>No clients found.</span>
        </div>
      ) : (
        <motion.table initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full text-sm bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead>
            <tr className="text-gray-400 text-xs bg-gray-50">
              <th className="py-3 px-4"><input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }} onChange={e => handleCheckAll(e.target.checked)} /></th>
              <th className="text-left font-normal py-3 px-4">Name</th>
              <th className="text-left font-normal py-3 px-4">Email</th>
              <th className="text-left font-normal py-3 px-4">Status</th>
              <th className="text-left font-normal py-3 px-4">Added</th>
              <th className="text-left font-normal py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((client, idx) => (
              <tr key={client.email} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                <td className="py-3 px-4"><input type="checkbox" checked={checked.includes(client.email)} onChange={e => handleCheck(client.email, e.target.checked)} /></td>
                <td className="py-3 px-4 font-medium text-gray-900">{client.name}</td>
                <td className="py-3 px-4 text-gray-700">{client.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{client.status}</span>
                </td>
                <td className="py-3 px-4 text-gray-500">{client.added}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="View" onClick={() => setSelected(client)}><Eye className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="Edit" onClick={() => handleEdit(client, (page - 1) * PAGE_SIZE + idx)}><Edit className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-red-100 transition" title="Delete" onClick={() => setClients(clients => clients.filter(c => c.email !== client.email))}><Trash2 className="w-4 h-4 text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      )}
      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="font-bold text-lg text-gray-900">Client Details</div>
              <button onClick={() => setSelected(null)} className="p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <div className="text-xs text-gray-400 mb-1">Name</div>
                <div className="font-semibold text-gray-900">{selected.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Email</div>
                <div className="text-gray-700">{selected.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selected.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{selected.status}</span>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Phone</div>
                <div className="text-gray-700">{selected.phone}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Added</div>
                <div className="text-gray-500">{selected.added}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Notes</div>
                <div className="text-gray-700">{selected.notes}</div>
              </div>
            </div>
          </motion.div>
        )}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
              <button onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyClient }); }} className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="font-bold text-lg text-gray-900 mb-4">{editIndex !== null ? 'Edit Client' : 'Add Client'}</div>
              <form className="space-y-4" onSubmit={handleAddClient}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <textarea className="w-full border rounded px-3 py-2 text-sm" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                {formError && <div className="text-xs text-red-500">{formError}</div>}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyClient }); }}>Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">{editIndex !== null ? 'Save Changes' : 'Add Client'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 