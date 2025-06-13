import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, X, CheckCircle2, Clock, AlertCircle, ClipboardPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const mockTasks = [
  { 
    id: '1',
    title: 'Follow up with John Doe',
    type: 'Client Call',
    priority: 'High',
    status: 'Pending',
    dueDate: '2024-03-20',
    assignedTo: 'Mike D',
    client: 'John Doe',
    notes: 'Discuss credit report updates'
  },
  { 
    id: '2',
    title: 'Send dispute letter',
    type: 'Document',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2024-03-21',
    assignedTo: 'Mike D',
    client: 'Jane Smith',
    notes: 'Prepare and send dispute letter to Experian'
  },
  { 
    id: '3',
    title: 'Review credit report',
    type: 'Review',
    priority: 'High',
    status: 'Completed',
    dueDate: '2024-03-19',
    assignedTo: 'Mike D',
    client: 'Sarah Lee',
    notes: 'Analyze recent credit report changes'
  },
  { 
    id: '4',
    title: 'Schedule consultation',
    type: 'Appointment',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2024-03-22',
    assignedTo: 'Mike D',
    client: 'Mike D',
    notes: 'Set up initial consultation call'
  },
];

const emptyTask = { 
  id: '',
  title: '',
  type: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
  assignedTo: 'Mike D',
  client: '',
  notes: ''
};

const PAGE_SIZE = 10;

export default function Tasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<typeof mockTasks>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof mockTasks[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyTask });
  const [formError, setFormError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1200);
  }, []);

  const filtered = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.client.toLowerCase().includes(search.toLowerCase()) ||
      task.type.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'pending' && task.status === 'Pending') ||
      (filter === 'in-progress' && task.status === 'In Progress') ||
      (filter === 'completed' && task.status === 'Completed');

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk actions
  const allChecked = paginated.length > 0 && paginated.every(t => checked.includes(t.id));

  // Calendar events
  const calendarEvents = filtered.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    resource: task,
  }));

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.client.trim() || !form.dueDate) {
      setFormError('Title, Client, and Due Date are required.');
      toast.error('Title, Client, and Due Date are required.');
      return;
    }
    if (editIndex !== null) {
      // Edit
      setTasks(tasks => tasks.map((t, i) => i === editIndex ? { ...form } : t));
      toast.success('Task updated!');
    } else {
      // Add
      setTasks([{ ...form, id: Math.random().toString(36).substr(2, 9) }, ...tasks]);
      toast.success('Task added!');
    }
    setShowAdd(false);
    setForm({ ...emptyTask });
    setFormError('');
    setEditIndex(null);
  }

  function handleEdit(task: typeof mockTasks[0], idx: number) {
    setForm(task);
    setEditIndex(idx);
    setShowAdd(true);
  }

  function handleCheck(id: string, checkedVal: boolean) {
    setChecked(prev => checkedVal ? [...prev, id] : prev.filter(e => e !== id));
  }

  function handleCheckAll(checkedVal: boolean) {
    setChecked(checkedVal ? paginated.map(t => t.id) : checked.filter(e => !paginated.map(t => t.id).includes(e)));
  }

  function handleBulkDelete() {
    setTasks(tasks => tasks.filter(t => !checked.includes(t.id)));
    setChecked([]);
    toast.success('Selected tasks deleted!');
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

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="tasks-page"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 80, damping: 20 }}
        className="space-y-8 p-4 sm:p-8 bg-gray-50 min-h-screen"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Task & Calendar Management</h1>
            <p className="text-base sm:text-lg text-gray-500 mt-1">Create, track, and manage all your tasks and deadlines</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base w-full sm:w-auto"
            onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyTask }); }}
          >
            <ClipboardPlus className="w-5 h-5" /> New Task
          </button>
        </motion.div>
        {/* Top controls: search, selection count, delete button */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex flex-row items-center gap-2 w-full">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {checked.length > 0 && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-gray-600">{checked.length} selected</span>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium shadow-none"
                >
                  <Trash2 size={20} />
                  Delete Selected
                </button>
              </div>
            )}
          </div>
          {/* Filter buttons row */}
          <div className="flex flex-wrap gap-2 mt-1">
            {['all', 'pending', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-base font-semibold border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${filter === f ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-400'}`}
                onClick={() => setFilter(f as typeof filter)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-0.5"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => handleCheckAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-4 py-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-12 bg-gray-100 rounded"></div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No tasks found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((task, idx) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={checked.includes(task.id)}
                            onChange={(e) => handleCheck(task.id, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {task.title.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-500">ID: {task.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {task.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{task.client}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{task.dueDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelected(task)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(task, idx)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setTasks(tasks.filter(t => t.id !== task.id));
                                toast.success('Task deleted!');
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && paginated.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} tasks
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        {/* Task Details Modal */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Title</div>
                  <div className="font-semibold text-gray-900">{selected.title}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Type</div>
                  <div className="text-gray-700">{selected.type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Client</div>
                  <div className="text-gray-700">{selected.client}</div>
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
                  <div className="text-xs text-gray-400 mb-1">Due Date</div>
                  <div className="text-gray-500">{formatDate(selected.dueDate)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Assigned To</div>
                  <div className="text-gray-700">{selected.assignedTo}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Notes</div>
                  <div className="text-gray-700">{selected.notes}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Add/Edit Task Modal */}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{editIndex !== null ? 'Edit Task' : 'New Task'}</h2>
                <button 
                  onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyTask }); }} 
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form className="p-6 space-y-4 flex-1 overflow-y-auto" onSubmit={handleAddTask}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Title *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type *</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                    <option value="">Select Type</option>
                    <option value="Client Call">Client Call</option>
                    <option value="Document">Document</option>
                    <option value="Review">Review</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Client *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} required />
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
                  <label className="block text-xs text-gray-500 mb-1">Due Date *</label>
                  <input 
                    type="date" 
                    className="w-full border rounded px-3 py-2 text-sm" 
                    value={form.dueDate} 
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <textarea className="w-full border rounded px-3 py-2 text-sm" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                {formError && <div className="text-xs text-red-500">{formError}</div>}
              </form>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyTask }); }}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  {editIndex !== null ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 