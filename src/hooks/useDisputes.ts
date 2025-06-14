import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

export interface Dispute {
  id: string;
  client: string;
  type: string;
  creditor: string;
  bureau: string;
  status: 'Draft' | 'Submitted' | 'In Progress' | 'Resolved' | 'Rejected';
  submitted: string;
  lastUpdated: string;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  creditImpact: number;
  disputeReason: string;
  nextAction: string;
  createdAt: string;
}

export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'disputes'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const disputesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Dispute[];
        setDisputes(disputesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching disputes:', error);
        setError('Failed to fetch disputes');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addDispute = async (dispute: Omit<Dispute, 'id' | 'createdAt'>) => {
    try {
      const disputeData = {
        ...dispute,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      await addDoc(collection(db, 'disputes'), disputeData);
      toast.success('Dispute added successfully');
    } catch (error) {
      console.error('Error adding dispute:', error);
      toast.error('Failed to add dispute');
      throw error;
    }
  };

  const updateDispute = async (id: string, dispute: Partial<Dispute>) => {
    try {
      const disputeRef = doc(db, 'disputes', id);
      await updateDoc(disputeRef, {
        ...dispute,
        lastUpdated: new Date().toISOString()
      });
      toast.success('Dispute updated successfully');
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast.error('Failed to update dispute');
      throw error;
    }
  };

  const deleteDispute = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'disputes', id));
      toast.success('Dispute deleted successfully');
    } catch (error) {
      console.error('Error deleting dispute:', error);
      toast.error('Failed to delete dispute');
      throw error;
    }
  };

  const getDisputeStats = () => {
    const activeDisputes = disputes.filter(d => d.status === 'In Progress').length;
    const resolvedDisputes = disputes.filter(d => d.status === 'Resolved').length;
    const totalDisputes = disputes.length;
    const successRate = totalDisputes > 0 ? Math.round((resolvedDisputes / totalDisputes) * 100) : 0;

    return {
      activeDisputes,
      resolvedDisputes,
      totalDisputes,
      successRate
    };
  };

  return {
    disputes,
    loading,
    error,
    addDispute,
    updateDispute,
    deleteDispute,
    getDisputeStats
  };
} 