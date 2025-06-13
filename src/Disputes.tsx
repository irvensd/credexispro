import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, X, AlertCircle, CheckCircle2, Clock, FileWarning, PlusCircle, Filter, ChevronDown, ChevronUp, TrendingUp, FileText, Target, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const emptyDispute = { 
  id: '',
  client: '',
  type: '',
  creditor: '',
  bureau: 'Experian',
  status: 'Draft',
  submitted: '',
  lastUpdated: new Date().toISOString().split('T')[0],
  priority: 'Medium',
  notes: '',
  creditImpact: 0,
  disputeReason: '',
  nextAction: ''
};

const PAGE_SIZE = 10;

const disputeTemplates = [
  {
    id: '1',
    name: 'Late Payment Removal',
    description: 'Template for disputing late payments with supporting documentation',
    bureau: 'All',
    type: 'Late Payment',
    successRate: 85,
    avgImpact: 25,
    steps: [
      'Gather payment receipts',
      'Write dispute letter',
      'Submit to credit bureaus',
      'Follow up after 30 days'
    ]
  },
  {
    id: '2',
    name: 'Collection Account Removal',
    description: 'Template for removing collection accounts with validation request',
    bureau: 'All',
    type: 'Collection',
    successRate: 75,
    avgImpact: 35,
    steps: [
      'Request debt validation',
      'Prepare dispute letter',
      'Submit to collection agency',
      'Monitor credit report'
    ]
  },
  {
    id: '3',
    name: 'Identity Theft Dispute',
    description: 'Comprehensive template for identity theft cases',
    bureau: 'All',
    type: 'Identity Theft',
    successRate: 90,
    avgImpact: 50,
    steps: [
      'File police report',
      'Submit identity theft affidavit',
      'Notify all credit bureaus',
      'Place fraud alerts'
    ]
  }
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'In Progress':
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'Resolved':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'Submitted':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'Draft':
      return <FileWarning className="w-4 h-4 text-gray-500" />;
    case 'Rejected':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
}

export default function Disputes() {
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyDispute });
  const [formError, setFormError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    bureau: '',
    priority: '',
    dateRange: 'all'
  });
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDisputes([]);
      setLoading(false);
    }, 1200);
  }, []);

  const filtered = disputes.filter(d => {
    const matchesSearch = 
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.creditor.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilters = 
      (!filters.status || d.status === filters.status) &&
      (!filters.bureau || d.bureau === filters.bureau) &&
      (!filters.priority || d.priority === filters.priority) &&
      (filters.dateRange === 'all' || 
        (filters.dateRange === 'week' && new Date(d.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filters.dateRange === 'month' && new Date(d.lastUpdated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    return matchesSearch && matchesFilters;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk actions
  const allChecked = paginated.length > 0 && paginated.every(d => checked.includes(d.id));

  function handleAddDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client.trim() || !form.creditor.trim() || !form.type.trim()) {
      setFormError('Client, Creditor, and Type are required.');
      toast.error('Client, Creditor, and Type are required.');
      return;
    }
    
    const currentDate = new Date().toISOString().split('T')[0];
    const disputeData = {
      ...form,
      id: form.id || Math.random().toString(36).substr(2, 9),
      lastUpdated: currentDate,
      submitted: form.status === 'Draft' ? '' : (form.submitted || currentDate)
    };
    
    if (editIndex !== null) {
      // Edit
      setDisputes(disputes => disputes.map((d, i) => i === editIndex ? disputeData : d));
      toast.success('Dispute updated!');
    } else {
      // Add
      setDisputes([disputeData, ...disputes]);
      toast.success('Dispute added!');
    }
    setShowAdd(false);
    setForm({ ...emptyDispute });
    setFormError('');
    setEditIndex(null);
  }

  function handleEdit(dispute: any, idx: number) {
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
    toast.success('Selected disputes deleted!');
  }

  const renderTimeline = (dispute: any) => {
    const timeline = [
      { date: dispute.submitted, action: 'Dispute Submitted', status: 'completed' },
      { date: new Date(dispute.submitted).getTime() + 7 * 24 * 60 * 60 * 1000, action: 'Bureau Acknowledgment', status: 'completed' },
      { date: new Date(dispute.submitted).getTime() + 30 * 24 * 60 * 60 * 1000, action: 'Investigation Complete', status: dispute.status === 'Resolved' ? 'completed' : 'pending' },
      { date: new Date(dispute.submitted).getTime() + 45 * 24 * 60 * 60 * 1000, action: 'Results Updated', status: 'pending' }
    ];

    return (
      <div className="space-y-4">
        {timeline.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              item.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <div>
              <div className="text-sm font-medium text-gray-900">{item.action}</div>
              <div className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
            <p className="text-gray-600 mt-1">Manage and track credit dispute cases</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            New Dispute
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Disputes</p>
                <h3 className="text-2xl font-bold mt-1">{disputes.filter(d => d.status === 'In Progress').length}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                12%
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <h3 className="text-2xl font-bold mt-1">78%</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                5%
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Resolution Time</p>
                <h3 className="text-2xl font-bold mt-1">32 days</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Clock size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-red-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                3 days
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Credit Score Impact</p>
                <h3 className="text-2xl font-bold mt-1">+45 pts</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Target size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                8 pts
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <FileText size={20} />
            Use Template
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            Filters
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bureau</label>
                <select
                  value={filters.bureau}
                  onChange={(e) => setFilters(f => ({ ...f, bureau: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">All Bureaus</option>
                  <option value="Experian">Experian</option>
                  <option value="Equifax">Equifax</option>
                  <option value="TransUnion">TransUnion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(f => ({ ...f, dateRange: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search disputes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {checked.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{checked.length} selected</span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={20} />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Disputes Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creditor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bureau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4">
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
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No disputes found
                  </td>
                </tr>
              ) : (
                paginated.map((dispute, idx) => (
                  <tr key={dispute.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={checked.includes(dispute.id)}
                        onChange={(e) => handleCheck(dispute.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {dispute.client.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{dispute.client}</div>
                          <div className="text-sm text-gray-500">ID: {dispute.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dispute.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{dispute.creditor}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{dispute.bureau}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dispute.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        dispute.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        dispute.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        dispute.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusIcon(dispute.status)}
                        {dispute.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dispute.priority === 'High' ? 'bg-red-100 text-red-800' :
                        dispute.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {dispute.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{dispute.lastUpdated}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(dispute)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEdit(dispute, idx)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setDisputes(disputes.filter(d => d.id !== dispute.id));
                            toast.success('Dispute deleted!');
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={20} />
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
              Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} disputes
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

      {/* Dispute Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Dispute Details</h2>
                    <p className="text-gray-600 mt-1">ID: {selected.id}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Client</h3>
                    <p className="text-gray-900">{selected.client}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                    <p className="text-gray-900">{selected.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Creditor</h3>
                    <p className="text-gray-900">{selected.creditor}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bureau</h3>
                    <p className="text-gray-900">{selected.bureau}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selected.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      selected.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      selected.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      selected.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusIcon(selected.status)}
                      {selected.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selected.priority === 'High' ? 'bg-red-100 text-red-800' :
                      selected.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selected.priority}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                  <div className="space-y-4">
                    {renderTimeline(selected)}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-900">{selected.notes}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Next Action</h3>
                  <p className="text-gray-900">{selected.nextAction}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Dispute Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleAddDispute} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editIndex !== null ? 'Edit Dispute' : 'New Dispute'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {editIndex !== null ? 'Update dispute details' : 'Create a new dispute case'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      setForm({ ...emptyDispute });
                      setFormError('');
                      setEditIndex(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {formError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <input
                      type="text"
                      value={form.client}
                      onChange={(e) => setForm(f => ({ ...f, client: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="Late Payment">Late Payment</option>
                      <option value="Collection Account">Collection Account</option>
                      <option value="Credit Utilization">Credit Utilization</option>
                      <option value="Identity Theft">Identity Theft</option>
                      <option value="Duplicate Account">Duplicate Account</option>
                      <option value="Inquiry Removal">Inquiry Removal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Creditor</label>
                    <input
                      type="text"
                      value={form.creditor}
                      onChange={(e) => setForm(f => ({ ...f, creditor: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter creditor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bureau</label>
                    <select
                      value={form.bureau}
                      onChange={(e) => setForm(f => ({ ...f, bureau: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Experian">Experian</option>
                      <option value="Equifax">Equifax</option>
                      <option value="TransUnion">TransUnion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter dispute notes"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                  <input
                    type="text"
                    value={form.nextAction}
                    onChange={(e) => setForm(f => ({ ...f, nextAction: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter next action"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      setForm({ ...emptyDispute });
                      setFormError('');
                      setEditIndex(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editIndex !== null ? 'Update Dispute' : 'Create Dispute'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Dispute Templates</h2>
                    <p className="text-gray-600 mt-1">Choose a template to start a new dispute</p>
                  </div>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {disputeTemplates.map(template => (
                    <div
                      key={template.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => {
                        setForm({
                          ...emptyDispute,
                          type: template.type,
                          notes: template.description,
                          nextAction: template.steps[0]
                        });
                        setShowTemplates(false);
                        setShowAdd(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <span className="text-sm text-gray-500">{template.bureau}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp size={16} />
                          {template.successRate}% Success
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Target size={16} />
                          +{template.avgImpact} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 