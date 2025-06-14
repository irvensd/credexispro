import React, { useState } from 'react';
import { useClients } from './hooks/useClients';
import AddEditClientModal from './components/AddEditClientModal';
import Modal from './components/Modal';
import { Search, Edit, Trash2, PlusCircle } from 'lucide-react';
import type { Client } from './types/store';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Completed', label: 'Completed' },
];

const Clients: React.FC = () => {
  const { clients, createClient, updateClient, deleteClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteClientObj, setDeleteClientObj] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = async (clientData: Partial<Client>) => {
    if (editingClient) {
      await updateClient(editingClient.id, clientData);
      setEditingClient(null);
    } else {
      await createClient(clientData);
    }
    setShowModal(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleDelete = (client: Client) => {
    setDeleteClientObj(client);
  };

  const confirmDelete = async () => {
    if (deleteClientObj) {
      await deleteClient(deleteClientObj.id);
      setDeleteClientObj(null);
    }
  };

  const cancelDelete = () => setDeleteClientObj(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => { setShowModal(true); setEditingClient(null); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" /> New Client
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No clients found.</td>
              </tr>
            )}
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{client.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    client.status === 'Active' ? 'bg-green-100 text-green-800' :
                    client.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                    client.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddEditClientModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditingClient(null); }}
          onSave={handleSave}
          client={editingClient}
        />
      )}
      {deleteClientObj && (
        <Modal
          isOpen={!!deleteClientObj}
          onClose={cancelDelete}
          title="Delete Client"
          description={"Are you sure you want to delete this client? This action cannot be undone."}
        >
          <div className="flex flex-col gap-4">
            <div className="text-gray-900 font-semibold">{deleteClientObj.firstName} {deleteClientObj.lastName}</div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Clients; 