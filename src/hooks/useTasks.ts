import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Task } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time fetch
  useEffect(() => {
    setLoading(true);
    const q = collection(db, 'tasks');
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Add a new task
  const addTask = useCallback(async (task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined fields
      const cleanTask: Record<string, any> = {};
      Object.entries(task).forEach(([key, value]) => {
        if (value !== undefined) cleanTask[key] = value;
      });
      await addDoc(collection(db, 'tasks'), {
        ...cleanTask,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a task
  const editTask = useCallback(async (id: string, task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined fields
      const cleanTask: Record<string, any> = {};
      Object.entries(task).forEach(([key, value]) => {
        if (value !== undefined) cleanTask[key] = value;
      });
      await updateDoc(doc(db, 'tasks', id), {
        ...cleanTask,
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a task
  const removeTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
  };
}; 