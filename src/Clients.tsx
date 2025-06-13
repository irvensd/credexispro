import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  UserPlus,
  User,
  Users,
  BarChart2,
  UserCheck,
  UserX,
  Calendar,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import AddEditClientModal from './components/AddEditClientModal';
import ClientDetailPage from './components/ClientDetailPage';
import type { Client } from './types/Client';
import toast from 'react-hot-toast';
import React from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

type ClientStatus = 'Active' | 'Inactive' | 'Completed' | 'All';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ show: boolean; clientId: string | null }>({ show: false, clientId: null });
  const [filters, setFilters] = useState({
    joinDate: '',
    minScore: '',
    maxScore: '',
    plan: '',
  });
  const [plan, setPlan] = useState('basic'); // For testing, default to 'basic'
  const planOptions = ['basic', 'pro', 'enterprise'];
  const user = { plan };

  const clientsPerPage = 10;

  const fetchClients = async () => {
    setLoading(true);
    try {
      const clientsRef = collection(db, 'clients');
      const snapshot = await getDocs(clientsRef);
      const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + clientsPerPage);

  // Metrics
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const inactiveClients = clients.filter(c => c.status === 'Inactive').length;
  const completedClients = clients.filter(c => c.status === 'Completed').length;
  const avgCreditScore = Math.round(clients.reduce((sum, c) => sum + (c.creditScore || 0), 0) / clients.length);
  const newClientsThisMonth = clients.filter(c => new Date(c.joinDate).getMonth() === new Date().getMonth()).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      await fetchClients();
      toast.success('Client deleted');
    } catch (error) {
      toast.error('Failed to delete client');
      console.error(error);
    }
    setShowActionsMenu(null);
  };

  const handleSaveClient = async (clientData: Omit<Client, 'id'> & { id?: string }) => {
    try {
      if (clientData.id) {
        // Update existing client
        const clientRef = doc(db, 'clients', clientData.id);
        const { id, ...data } = clientData;
        await updateDoc(clientRef, data);
        toast.success('Client updated');
      } else {
        // Add new client
        await addDoc(collection(db, 'clients'), clientData);
        toast.success('Client added');
      }
      await fetchClients();
    } catch (error) {
      toast.error('Failed to save client');
      console.error(error);
    }
    setEditingClient(null);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(null);
    setEditingClient(client);
    setShowAddModal(true);
    setShowActionsMenu(null);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowActionsMenu(null);
  };

  const handleBackFromDetail = () => {
    setSelectedClient(null);
  };

  const handleDeleteClick = (clientId: string) => {
    setShowDeleteConfirm({ show: true, clientId });
  };

  const handleDeleteConfirm = async () => {
    if (showDeleteConfirm.clientId) {
      await handleDeleteClient(showDeleteConfirm.clientId);
      setShowDeleteConfirm({ show: false, clientId: null });
    }
  };

  // Add shimmer skeleton CSS
  const shimmer = `\n  @keyframes shimmer {\n    0% { background-position: -400px 0; }\n    100% { background-position: 400px 0; }\n  }\n`;

  return (
    <>
      {selectedClient ? (
        <ClientDetailPage
          client={selectedClient}
          onBack={handleBackFromDetail}
          onEdit={handleEditClient}
          onDelete={handleDeleteClick}
        />
      ) : (
        <div className="p-6 max-w-[1600px] mx-auto">
          {/* Plan badge, dropdown, and client limit info */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 rounded bg-gray-200 text-xs font-semibold uppercase">{user.plan}</span>
            <select
              value={plan}
              onChange={e => setPlan(e.target.value)}
              className="px-2 py-1 rounded border border-gray-300 text-xs bg-white"
            >
              {planOptions.map(opt => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
            {user.plan === 'basic' && <div className="text-xs text-gray-500 ml-4">Basic plan: Up to 50 clients</div>}
            {user.plan === 'pro' && <div className="text-xs text-gray-500 ml-4">Pro plan: Up to 200 clients</div>}
            {user.plan === 'enterprise' && <div className="text-xs text-gray-500 ml-4">Enterprise plan: Unlimited clients</div>}
            {((user.plan === 'basic' && totalClients >= 50) || (user.plan === 'pro' && totalClients >= 200)) && (
              <div className="text-xs text-red-500 font-semibold ml-4">You have reached your client limit for the {user.plan} plan. Upgrade to add more clients.</div>
            )}
          </div>
          {/* Header & Metrics */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                <p className="text-gray-600 mt-1">Manage your clients, track progress, and view details</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={20} />
                Add Client
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <Users className="text-blue-600" size={28} />
                <div>
                  <p className="text-sm text-gray-600">Total Clients</p>
                  <h3 className="text-2xl font-bold mt-1">{totalClients}</h3>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <UserCheck className="text-green-600" size={28} />
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <h3 className="text-2xl font-bold mt-1">{activeClients}</h3>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <UserX className="text-yellow-600" size={28} />
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <h3 className="text-2xl font-bold mt-1">{inactiveClients}</h3>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <BarChart2 className="text-purple-600" size={28} />
                <div>
                  <p className="text-sm text-gray-600">Avg. Credit Score</p>
                  <h3 className="text-2xl font-bold mt-1">{avgCreditScore}</h3>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <Calendar className="text-orange-600" size={28} />
                <div>
                  <p className="text-sm text-gray-600">New This Month</p>
                  <h3 className="text-2xl font-bold mt-1">{newClientsThisMonth}</h3>
                </div>
              </div>
            </div>
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAdvancedFilters(v => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal size={20} />
                Filters
                {showAdvancedFilters ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
              </button>
            </div>
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as ClientStatus)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                      <input
                        type="date"
                        value={filters.joinDate}
                        onChange={e => setFilters(f => ({ ...f, joinDate: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Credit Score</label>
                      <input
                        type="number"
                        value={filters.minScore}
                        onChange={e => setFilters(f => ({ ...f, minScore: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Plan</label>
                      <input
                        type="text"
                        value={filters.plan}
                        onChange={e => setFilters(f => ({ ...f, plan: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-0.5"
          >
            {loading ? (
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
            ) : paginatedClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <UserPlus className="w-16 h-16 text-indigo-200 mb-4" />
                <div className="text-2xl font-semibold text-gray-500 mb-2">No clients found</div>
                <div className="text-gray-400 mb-6">Add your first client to get started.</div>
                <button
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base"
                  onClick={() => { setShowAddModal(true); setEditingClient(null); }}
                >
                  <UserPlus className="w-5 h-5" /> New Client
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <motion.table className="w-full text-base bg-white rounded-2xl shadow-xl">
                  <thead>
                    <tr className="text-gray-400 text-xs bg-gray-50">
                      <th className="py-4 px-4 font-semibold tracking-wide">Name</th>
                      <th className="py-4 px-4 hidden sm:table-cell font-semibold tracking-wide">Email</th>
                      <th className="py-4 px-4 hidden md:table-cell font-semibold tracking-wide">Phone</th>
                      <th className="py-4 px-4 font-semibold tracking-wide">Status</th>
                      <th className="py-4 px-4 hidden sm:table-cell font-semibold tracking-wide">Credit Score</th>
                      <th className="py-4 px-4 hidden md:table-cell font-semibold tracking-wide">Progress</th>
                      <th className="py-4 px-4 font-semibold tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginatedClients.map((client, idx) => (
                        <motion.tr
                          key={client.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ delay: 0.05 * idx, duration: 0.4 }}
                          className="border-t border-gray-100 hover:bg-indigo-50 transition-colors group"
                        >
                          <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-base font-semibold">{client.firstName} {client.lastName}</span>
                              <span className="text-xs text-gray-500 sm:hidden">{client.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell text-gray-700 whitespace-nowrap">{client.email}</td>
                          <td className="py-4 px-4 hidden md:table-cell text-gray-700 whitespace-nowrap">{client.phone}</td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getStatusColor(client.status)} shadow-sm`}>{client.status}</span>
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell text-gray-700 whitespace-nowrap">{client.creditScore}</td>
                          <td className="py-4 px-4 hidden md:table-cell whitespace-nowrap">
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className={`${getProgressColor(client.progress)} h-2 rounded-full`} style={{ width: `${client.progress}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{client.progress}%</span>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button className="p-2 rounded hover:bg-indigo-100 focus:bg-indigo-200 transition shadow-sm" title="View" onClick={() => handleViewClient(client)}><Eye className="w-5 h-5 text-indigo-600" /></button>
                              <button className="p-2 rounded hover:bg-indigo-100 focus:bg-indigo-200 transition shadow-sm" title="Edit" onClick={() => handleEditClient(client)}><Edit3 className="w-5 h-5 text-indigo-600" /></button>
                              <button className="p-2 rounded hover:bg-red-100 focus:bg-red-200 transition shadow-sm" title="Delete" onClick={() => handleDeleteClick(client.id)}><Trash2 className="w-5 h-5 text-red-500" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </motion.table>
              </div>
            )}
            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex justify-center items-center gap-2 mt-8"
              >
                <button
                  className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-base text-gray-500">Page {currentPage} of {totalPages}</span>
                <button
                  className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddEditClientModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingClient(null); }}
        onSave={handleSaveClient}
        client={editingClient}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Client</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this client? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm({ show: false, clientId: null })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Client
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
} 