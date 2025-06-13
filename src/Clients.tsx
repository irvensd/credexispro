import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import { useClients } from './hooks/useClients';
import AddEditClientModal from './components/AddEditClientModal';
import { Search } from 'lucide-react';
import type { Client } from './types/Client';

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clients, loading, error } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('clients.title')}</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {t('clients.addNew')}
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('clients.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div
            key={client.id}
            onClick={() => navigate(`/clients/${client.id}`)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <p className="text-gray-600">{client.email}</p>
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              client.status === 'active' ? 'bg-green-100 text-green-800' :
              client.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {client.status}
            </span>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddEditClientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            // Refresh clients list
          }}
        />
      )}
    </div>
  );
};

export default Clients; 