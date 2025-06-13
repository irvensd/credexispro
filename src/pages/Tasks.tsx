import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority, TaskType } from '../types/task';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TaskModal from '../components/TaskModal';
import type { Client } from '../types/Client';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { activityService } from '../services/activityService';
import { useAuth } from '../contexts/AuthContext';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  resource: Task;
}

const statusSegments = [
  { label: 'All', value: '' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Completed', value: 'completed' },
  { label: 'Blocked', value: 'blocked' },
];

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
    type?: TaskType;
  }>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tasks
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        const tasksData = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(tasksData);

        // Fetch clients
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Client[];
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    const newTask = {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'tasks'), newTask);
    const createdTask = { ...newTask, id: docRef.id } as Task;
    setTasks(prev => [...prev, createdTask]);
    
    // Log activity
    await activityService.logTaskCreated(createdTask.title || 'Untitled Task', user?.id || '');
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!selectedTask) return;
    const updatedTask = { ...selectedTask, ...taskData, updatedAt: new Date().toISOString() };
    await updateDoc(doc(db, 'tasks', selectedTask.id), updatedTask);
    setTasks(prev => prev.map(task => task.id === selectedTask.id ? updatedTask as Task : task));
    
    // Log activity if status changed to completed
    if (taskData.status === 'completed' && selectedTask.status !== 'completed') {
      await activityService.logTaskCompleted(updatedTask.title || 'Untitled Task', user?.id || '');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;
    
    await deleteDoc(doc(db, 'tasks', taskId));
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Log activity for task deletion
    await activityService.logActivity({
      type: 'task_deleted',
      description: `Deleted task: ${taskToDelete.title || 'Untitled Task'}`,
      user: user?.id || ''
    });
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchesStatus = !filter.status || task.status === filter.status;
    const matchesPriority = !filter.priority || task.priority === filter.priority;
    const matchesType = !filter.type || task.type === filter.type;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const events: CalendarEvent[] = filteredTasks.map(task => ({
    id: String(task.id),
    title: task.title,
    start: task.dueDate ? new Date(task.dueDate) : new Date(),
    end: task.dueDate ? new Date(task.dueDate) : new Date(),
    resource: task,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span>List View</span>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${view === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span>Calendar View</span>
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedTask(undefined);
              setShowNewTaskModal(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            New Task
          </button>
        </div>
      </div>

      {view === 'list' && (
        <>
          <div className="flex items-center mb-4 space-x-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded border border-gray-200 w-72"
            />
            <div className="flex space-x-2">
              {statusSegments.map(seg => (
                <button
                  key={seg.value}
                  onClick={() => setFilter({ ...filter, status: seg.value as TaskStatus })}
                  className={`px-4 py-2 rounded font-medium ${filter.status === seg.value || (!filter.status && !seg.value) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {seg.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-0.5">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tasks found. Create a new task to get started.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="h-12">
                    <th className="px-4 py-2 flex items-center">
                      <input type="checkbox" className="w-5 h-5" style={{ verticalAlign: 'middle' }} />
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredTasks.map(task => {
                    const client = clients.find(c => c.id === (task.assignee && task.assignee.id ? task.assignee.id : ''));
                    return (
                      <tr key={task.id} className="h-12 hover:bg-gray-50">
                        <td className="px-4 py-2 flex items-center">
                          <input type="checkbox" className="w-5 h-5" style={{ verticalAlign: 'middle' }} />
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900 flex items-center">{task.title}</td>
                        <td className="px-4 py-2 text-gray-700 flex items-center">{task.type}</td>
                        <td className="px-4 py-2 text-gray-700 flex items-center">{client ? `${client.firstName} ${client.lastName}` : ''}</td>
                        <td className="px-4 py-2 flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'review' ? 'bg-purple-100 text-purple-800' :
                            task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-700 flex items-center">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
                        <td className="px-4 py-2 flex items-center space-x-2">
                          <button className="text-indigo-500 hover:text-indigo-700" title="View">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button onClick={() => { setSelectedTask(task); setShowNewTaskModal(true); }} className="text-blue-500 hover:text-blue-700" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m2 0h.01M17 5a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h1" /></svg>
                          </button>
                          <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {view === 'calendar' && (
        <div className="bg-white rounded-xl shadow p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      )}

      {showNewTaskModal && (
        <TaskModal
          isOpen={showNewTaskModal}
          task={selectedTask}
          onClose={() => {
            setShowNewTaskModal(false);
            setSelectedTask(undefined);
          }}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        />
      )}
    </div>
  );
};

export default Tasks; 