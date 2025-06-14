import { useEffect, useState, useCallback } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { Client } from '../types/store';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time fetch
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Add a new client
  const createClient = useCallback(async (client: Partial<Client>) => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined fields
      const cleanClient: Record<string, any> = {};
      Object.entries(client).forEach(([key, value]) => {
        if (value !== undefined) cleanClient[key] = value;
      });
      await addDoc(collection(db, 'clients'), {
        ...cleanClient,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a client
  const updateClient = useCallback(async (id: string, client: Partial<Client>) => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined fields
      const cleanClient: Record<string, any> = {};
      Object.entries(client).forEach(([key, value]) => {
        if (value !== undefined) cleanClient[key] = value;
      });
      await updateDoc(doc(db, 'clients', id), {
        ...cleanClient,
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a client
  const deleteClient = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
  };
}; 