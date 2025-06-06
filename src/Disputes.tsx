import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, X, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockDisputes = [
  { 
    id: '1',
    client: 'John Doe',
    type: 'Credit Card',
    creditor: 'Chase',
    status: 'In Progress',
    submitted: '2 days ago',
    lastUpdated: '1 hour ago',
    priority: 'High',
    notes: 'Waiting for response from creditor.'
  },
  { 
    id: '2',
    client: 'Jane Smith',
    type: 'Medical Bill',
    creditor: 'Medical Center',
    status: 'Completed',
    submitted: '1 week ago',
    lastUpdated: '2 days ago',
    priority: 'Medium',
    notes: 'Successfully removed from credit report.'
  },
  { 
    id: '3',
    client: 'Sarah Lee',
    type: 'Collection',
    creditor: 'ABC Collections',
    status: 'Pending',
    submitted: '3 days ago',
    lastUpdated: '3 days ago',
    priority: 'High',
    notes: 'Initial dispute letter sent.'
  },
  { 
    id: '4',
    client: 'Mike D',
    type: 'Credit Card',
    creditor: 'Bank of America',
    status: 'In Progress',
    submitted: '5 days ago',
    lastUpdated: '1 day ago',
    priority: 'Medium',
    notes: 'Follow-up letter sent.'
  },
];

const emptyDispute = { 
  id: '',
  client: '',
  type: '',
  creditor: '',
  status: 'Pending',
  submitted: 'just now',
  lastUpdated: 'just now',
  priority: 'Medium',
  notes: ''
};

const PAGE_SIZE = 10;

export default function Disputes() {
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<typeof mockDisputes>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof mockDisputes[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyDispute });
  const [formError, setFormError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setDisputes(mockDisputes);
      setLoading(false);
    }, 1200);
  }, []);

  const filtered = disputes.filter(d =>
    d.client.toLowerCase().includes(search.toLowerCase()) ||
    d.creditor.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk actions
  const allChecked = paginated.length > 0 && paginated.every(d => checked.includes(d.id));
  const someChecked = paginated.some(d => checked.includes(d.id));

  function handleAddDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client.trim() || !form.creditor.trim() || !form.type.trim()) {
      setFormError('Client, Creditor, and Type are required.');
      return;
    }
    if (editIndex !== null) {
      // Edit
      setDisputes(disputes => disputes.map((d, i) => i === editIndex ? { ...form } : d));
    } else {
      // Add
      setDisputes([{ ...form, id: Math.random().toString(36).substr(2, 9) }, ...disputes]);
    }
    setShowAdd(false);
    setForm({ ...emptyDispute });
    setFormError('');
    setEditIndex(null);
  }

  function handleEdit(dispute: typeof mockDisputes[0], idx: number) {
    setForm(dispute);
    setEditIndex(idx);
    setShowAdd(true);
  }

  function handleCheck(id: string, checkedVal: boolean) {
    setChecked(prev => checkedVal ? [...prev, id] : prev.filter(e => e !== id));
  }

  function handleCheckAll(checkedVal: boolean) {
    setChecked(checkedVal ? paginated.map(d => d.id) : checked.filter(e => !paginated.map(d => d.id).includes(e)));
  }

  function handleBulkDelete() {
    setDisputes(disputes => disputes.filter(d => !checked.includes(d.id)));
    setChecked([]);
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Disputes</h1>
        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-base" onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyDispute }); }}>
          New Dispute
        </button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
            placeholder="Search disputes..."
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
          <span className="text-4xl mb-2">📝</span>
          <span>No disputes found.</span>
        </div>
      ) : (
        <motion.table initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full text-sm bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead>
            <tr className="text-gray-400 text-xs bg-gray-50">
              <th className="py-3 px-4"><input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }} onChange={e => handleCheckAll(e.target.checked)} /></th>
              <th className="text-left font-normal py-3 px-4">Client</th>
              <th className="text-left font-normal py-3 px-4">Type</th>
              <th className="text-left font-normal py-3 px-4">Creditor</th>
              <th className="text-left font-normal py-3 px-4">Status</th>
              <th className="text-left font-normal py-3 px-4">Priority</th>
              <th className="text-left font-normal py-3 px-4">Last Updated</th>
              <th className="text-left font-normal py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((dispute, idx) => (
              <tr key={dispute.id} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                <td className="py-3 px-4"><input type="checkbox" checked={checked.includes(dispute.id)} onChange={e => handleCheck(dispute.id, e.target.checked)} /></td>
                <td className="py-3 px-4 font-medium text-gray-900">{dispute.client}</td>
                <td className="py-3 px-4 text-gray-700">{dispute.type}</td>
                <td className="py-3 px-4 text-gray-700">{dispute.creditor}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(dispute.status)}
                    <span className="text-gray-700">{dispute.status}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(dispute.priority)}`}>{dispute.priority}</span>
                </td>
                <td className="py-3 px-4 text-gray-500">{dispute.lastUpdated}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="View" onClick={() => setSelected(dispute)}><Eye className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="Edit" onClick={() => handleEdit(dispute, (page - 1) * PAGE_SIZE + idx)}><Edit className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-red-100 transition" title="Delete" onClick={() => setDisputes(disputes => disputes.filter(d => d.id !== dispute.id))}><Trash2 className="w-4 h-4 text-red-500" /></button>
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
              <div className="font-bold text-lg text-gray-900">Dispute Details</div>
              <button onClick={() => setSelected(null)} className="p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <div className="text-xs text-gray-400 mb-1">Client</div>
                <div className="font-semibold text-gray-900">{selected.client}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Type</div>
                <div className="text-gray-700">{selected.type}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Creditor</div>
                <div className="text-gray-700">{selected.creditor}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selected.status)}
                  <span className="text-gray-700">{selected.status}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Priority</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(selected.priority)}`}>{selected.priority}</span>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Submitted</div>
                <div className="text-gray-500">{selected.submitted}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Last Updated</div>
                <div className="text-gray-500">{selected.lastUpdated}</div>
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
              <button onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyDispute }); }} className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="font-bold text-lg text-gray-900 mb-4">{editIndex !== null ? 'Edit Dispute' : 'New Dispute'}</div>
              <form className="space-y-4" onSubmit={handleAddDispute}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Client *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type *</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                    <option value="">Select Type</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Medical Bill">Medical Bill</option>
                    <option value="Collection">Collection</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Creditor *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.creditor} onChange={e => setForm(f => ({ ...f, creditor: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Priority</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <textarea className="w-full border rounded px-3 py-2 text-sm" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                {formError && <div className="text-xs text-red-500">{formError}</div>}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyDispute }); }}>Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">{editIndex !== null ? 'Save Changes' : 'Create Dispute'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 