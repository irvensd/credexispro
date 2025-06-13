import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  setClients,
  addClient,
  updateClient,
  deleteClient,
  setSelectedClient,
  setLoading,
  setError
} from '../store/slices/clientsSlice';

export const useClients = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state: RootState) => state.clients);

  const fetchClients = async () => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      dispatch(setClients(data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch clients'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createClient = async (clientData: Omit<RootState['clients']['clients'][0], 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      const data = await response.json();
      dispatch(addClient(data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create client'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateClientData = async (id: string, clientData: Partial<RootState['clients']['clients'][0]>) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      const data = await response.json();
      dispatch(updateClient(data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update client'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeClient = async (id: string) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      dispatch(deleteClient(id));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete client'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const selectClient = (client: RootState['clients']['clients'][0] | null) => {
    dispatch(setSelectedClient(client));
  };

  return {
    clients: clients.clients,
    selectedClient: clients.selectedClient,
    loading: clients.loading,
    error: clients.error,
    fetchClients,
    createClient,
    updateClient: updateClientData,
    deleteClient: removeClient,
    selectClient,
  };
}; 