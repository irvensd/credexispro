import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, X, DollarSign, CreditCard, Building2, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const mockPayments = [
  { 
    id: '1',
    client: 'John Doe',
    amount: 299.99,
    type: 'Credit Card',
    status: 'Completed',
    date: '2024-03-15',
    reference: 'PAY-001',
    notes: 'Monthly subscription payment'
  },
  { 
    id: '2',
    client: 'Jane Smith',
    amount: 499.99,
    type: 'Bank Transfer',
    status: 'Pending',
    date: '2024-03-18',
    reference: 'PAY-002',
    notes: 'Initial setup fee'
  },
  { 
    id: '3',
    client: 'Sarah Lee',
    amount: 299.99,
    type: 'Credit Card',
    status: 'Failed',
    date: '2024-03-17',
    reference: 'PAY-003',
    notes: 'Payment declined'
  },
  { 
    id: '4',
    client: 'Mike D',
    amount: 299.99,
    type: 'Bank Transfer',
    status: 'Completed',
    date: '2024-03-16',
    reference: 'PAY-004',
    notes: 'Monthly subscription payment'
  },
];

const emptyPayment = { 
  id: '',
  client: '',
  amount: 0,
  type: 'Credit Card',
  status: 'Pending',
  date: '',
  reference: '',
  notes: ''
};

const PAGE_SIZE = 10;

// Add shimmer skeleton CSS
const shimmer = `\n  @keyframes shimmer {\n    0% { background-position: -400px 0; }\n    100% { background-position: 400px 0; }\n  }\n`;

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<typeof mockPayments>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof mockPayments[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyPayment });
  const [formError, setFormError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 1200);
  }, []);

  const filtered = payments.filter(payment => {
    const matchesSearch = 
      payment.client.toLowerCase().includes(search.toLowerCase()) ||
      payment.reference.toLowerCase().includes(search.toLowerCase()) ||
      payment.type.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'completed' && payment.status === 'Completed') ||
      (filter === 'pending' && payment.status === 'Pending') ||
      (filter === 'failed' && payment.status === 'Failed');

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk actions
  const allChecked = paginated.length > 0 && paginated.every(p => checked.includes(p.id));
  const someChecked = paginated.some(p => checked.includes(p.id));

  function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client.trim() || !form.amount || !form.date) {
      setFormError('Client, Amount, and Date are required.');
      toast.error('Client, Amount, and Date are required.');
      return;
    }
    if (editIndex !== null) {
      // Edit
      setPayments(payments => payments.map((p, i) => i === editIndex ? { ...form } : p));
      toast.success('Payment updated!');
    } else {
      // Add
      const newPayment = {
        ...form,
        id: Math.random().toString(36).substr(2, 9),
        reference: `PAY-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      };
      setPayments([newPayment, ...payments]);
      toast.success('Payment added!');
    }
    setShowAdd(false);
    setForm({ ...emptyPayment });
    setFormError('');
    setEditIndex(null);
  }

  function handleEdit(payment: typeof mockPayments[0], idx: number) {
    setForm(payment);
    setEditIndex(idx);
    setShowAdd(true);
  }

  function handleCheck(id: string, checkedVal: boolean) {
    setChecked(prev => checkedVal ? [...prev, id] : prev.filter(e => e !== id));
  }

  function handleCheckAll(checkedVal: boolean) {
    setChecked(checkedVal ? paginated.map(p => p.id) : checked.filter(e => !paginated.map(p => p.id).includes(e)));
  }

  function handleBulkDelete() {
    setPayments(payments => payments.filter(p => !checked.includes(p.id)));
    setChecked([]);
    toast.success('Selected payments deleted!');
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  }

  function getPaymentTypeIcon(type: string) {
    switch (type) {
      case 'Credit Card':
        return <CreditCard className="w-4 h-4 text-indigo-500" />;
      case 'Bank Transfer':
        return <Building2 className="w-4 h-4 text-green-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-base" onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyPayment }); }}>
          Record Payment
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
            placeholder="Search payments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'failed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('failed')}
          >
            Failed
          </button>
        </div>
        {someChecked && (
          <button className="ml-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={handleBulkDelete}>
            Delete Selected
          </button>
        )}
      </div>
      {loading ? (
        <>
          <style>{shimmer}</style>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 w-full rounded-lg relative overflow-hidden bg-gray-100"
                style={{ position: 'relative' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                    backgroundSize: '400px 100%',
                    animation: 'shimmer 1.2s infinite',
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Wallet className="w-16 h-16 text-indigo-200 mb-4" />
          <div className="text-xl font-semibold text-gray-500 mb-2">No payments found</div>
          <div className="text-gray-400 mb-6">Record your first payment to get started.</div>
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-base"
            onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyPayment }); }}
          >
            <DollarSign className="w-5 h-5" /> Record Payment
          </button>
        </div>
      ) : (
        <motion.table initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full text-sm bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead>
            <tr className="text-gray-400 text-xs bg-gray-50">
              <th className="py-3 px-4"><input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }} onChange={e => handleCheckAll(e.target.checked)} /></th>
              <th className="text-left font-normal py-3 px-4">Client</th>
              <th className="text-left font-normal py-3 px-4">Amount</th>
              <th className="text-left font-normal py-3 px-4">Type</th>
              <th className="text-left font-normal py-3 px-4">Status</th>
              <th className="text-left font-normal py-3 px-4">Date</th>
              <th className="text-left font-normal py-3 px-4">Reference</th>
              <th className="text-left font-normal py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((payment, idx) => (
              <tr key={payment.id} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                <td className="py-3 px-4"><input type="checkbox" checked={checked.includes(payment.id)} onChange={e => handleCheck(payment.id, e.target.checked)} /></td>
                <td className="py-3 px-4 font-medium text-gray-900">{payment.client}</td>
                <td className="py-3 px-4 text-gray-700">{formatCurrency(payment.amount)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {getPaymentTypeIcon(payment.type)}
                    <span className="text-gray-700">{payment.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(payment.status)}
                    <span className="text-gray-700">{payment.status}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{formatDate(payment.date)}</td>
                <td className="py-3 px-4 text-gray-500">{payment.reference}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="View" onClick={() => setSelected(payment)}><Eye className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="Edit" onClick={() => handleEdit(payment, (page - 1) * PAGE_SIZE + idx)}><Edit className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-red-100 transition" title="Delete" onClick={() => { setPayments(payments => payments.filter(p => p.id !== payment.id)); toast.success('Payment deleted!'); }}><Trash2 className="w-4 h-4 text-red-500" /></button>
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
              <div className="font-bold text-lg text-gray-900">Payment Details</div>
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
                <div className="text-xs text-gray-400 mb-1">Amount</div>
                <div className="text-gray-700">{formatCurrency(selected.amount)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Type</div>
                <div className="flex items-center gap-1">
                  {getPaymentTypeIcon(selected.type)}
                  <span className="text-gray-700">{selected.type}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selected.status)}
                  <span className="text-gray-700">{selected.status}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Date</div>
                <div className="text-gray-500">{formatDate(selected.date)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Reference</div>
                <div className="text-gray-500">{selected.reference}</div>
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
              <button onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyPayment }); }} className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="font-bold text-lg text-gray-900 mb-4">{editIndex !== null ? 'Edit Payment' : 'Record Payment'}</div>
              <form className="space-y-4" onSubmit={handleAddPayment}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Client *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Amount *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    className="w-full border rounded px-3 py-2 text-sm" 
                    value={form.amount} 
                    onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) }))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date *</label>
                  <input 
                    type="date" 
                    className="w-full border rounded px-3 py-2 text-sm" 
                    value={form.date} 
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <textarea className="w-full border rounded px-3 py-2 text-sm" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                {formError && <div className="text-xs text-red-500">{formError}</div>}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyPayment }); }}>Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">{editIndex !== null ? 'Save Changes' : 'Record Payment'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 