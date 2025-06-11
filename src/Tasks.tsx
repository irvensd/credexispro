import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, X, CheckCircle2, Clock, AlertCircle, Calendar as LucideCalendar, ClipboardPlus } from 'lucide-react';
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

// Add shimmer skeleton CSS
const shimmer = `\n  @keyframes shimmer {\n    0% { background-position: -400px 0; }\n    100% { background-position: 400px 0; }\n  }\n`;

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
  const [view, setView] = useState<'list' | 'calendar'>('list');

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
  const someChecked = paginated.some(t => checked.includes(t.id));

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
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-2"
        >
          <div className="relative w-full">
            <input
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-base bg-white shadow-sm placeholder-gray-400"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
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
          {someChecked && (
            <button className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 focus:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition" onClick={handleBulkDelete}>
              Delete Selected
            </button>
          )}
        </motion.div>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-0.5"
        >
          {view === 'list' ? (
            loading ? (
              <div className="space-y-4 p-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
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
                  </motion.div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <ClipboardPlus className="w-16 h-16 text-indigo-200 mb-4" />
                <div className="text-2xl font-semibold text-gray-500 mb-2">No tasks found</div>
                <div className="text-gray-400 mb-6">Add your first task to get started.</div>
                <button
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base"
                  onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyTask }); }}
                >
                  <LucideCalendar className="w-5 h-5" /> New Task
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <motion.table className="w-full text-base bg-white rounded-2xl shadow-xl">
                  <thead>
                    <tr className="text-gray-400 text-xs bg-gray-50">
                      <th className="py-4 px-4 font-semibold tracking-wide"><input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }} onChange={e => handleCheckAll(e.target.checked)} /></th>
                      <th className="text-left font-semibold py-4 px-4 tracking-wide">Title</th>
                      <th className="text-left font-semibold py-4 px-4 tracking-wide hidden sm:table-cell">Type</th>
                      <th className="text-left font-semibold py-4 px-4 tracking-wide hidden md:table-cell">Client</th>
                      <th className="text-left font-semibold py-4 px-4 tracking-wide">Status</th>
                      <th className="text-left font-semibold py-4 px-4 tracking-wide hidden sm:table-cell">Priority</th>
                      <th className="text-left font-semibold py-4 px-4 tracking-wide hidden md:table-cell">Due Date</th>
                      <th className="text-left font-semibold py-4 px-4 tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginated.map((task, idx) => (
                        <motion.tr
                          key={task.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ delay: 0.05 * idx, duration: 0.4 }}
                          className="border-t border-gray-100 hover:bg-indigo-50 transition-colors group"
                        >
                          <td className="py-4 px-4"><input type="checkbox" checked={checked.includes(task.id)} onChange={e => handleCheck(task.id, e.target.checked)} /></td>
                          <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-base font-semibold">{task.title}</span>
                              <span className="text-xs text-gray-500 sm:hidden">{task.type}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700 whitespace-nowrap hidden sm:table-cell">{task.type}</td>
                          <td className="py-4 px-4 text-gray-700 whitespace-nowrap hidden md:table-cell">{task.client}</td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(task.status)}
                              <span className="text-gray-700">{task.status}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap hidden sm:table-cell">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)} shadow-sm`}>{task.priority}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-500 whitespace-nowrap hidden md:table-cell">{formatDate(task.dueDate)}</td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button className="p-2 rounded hover:bg-indigo-100 focus:bg-indigo-200 transition shadow-sm" title="View" onClick={() => setSelected(task)}><Eye className="w-5 h-5 text-indigo-600" /></button>
                              <button className="p-2 rounded hover:bg-indigo-100 focus:bg-indigo-200 transition shadow-sm" title="Edit" onClick={() => handleEdit(task, (page - 1) * PAGE_SIZE + idx)}><Edit className="w-5 h-5 text-indigo-600" /></button>
                              <button className="p-2 rounded hover:bg-red-100 focus:bg-red-200 transition shadow-sm" title="Delete" onClick={() => { setTasks(tasks => tasks.filter(t => t.id !== task.id)); toast.success('Task deleted!'); }}><Trash2 className="w-5 h-5 text-red-500" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </motion.table>
              </div>
            )
          ) : (
            <div className="h-[600px] sm:h-[700px]">
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month', 'week', 'day']}
                defaultView="month"
                onSelectEvent={(event: any) => {
                  setSelected(event.resource);
                }}
              />
            </div>
          )}
          {/* Pagination Controls */}
          {view === 'list' && !loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex justify-center items-center gap-2 mt-8"
            >
              <button
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="text-base text-gray-500">Page {page} of {totalPages}</span>
              <button
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </motion.div>
          )}
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