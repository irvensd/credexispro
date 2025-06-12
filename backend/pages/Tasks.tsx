import React, { useState, useEffect } from 'react';
import type { Task } from '../types/task';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TaskModal from '../components/TaskModal';
import type { Client } from '../types/Client';

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
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<{
    status?: Task['status'];
    priority?: Task['priority'];
    type?: Task['type'];
  }>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Fetch tasks from API
    // For now, using mock data
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Client Meeting',
        description: 'Discuss credit repair strategy',
        dueDate: new Date().toISOString(),
        priority: 'high',
        status: 'pending',
        type: 'general',
        assignee: null,
        dependencies: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: { id: '1', name: 'Admin', email: 'admin@example.com' },
        tags: [],
      },
    ];
    setTasks(mockTasks);
  }, []);

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: tasks.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...taskData,
    } as Task;
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!selectedTask) return;
    const updatedTasks = tasks.map(task =>
      task.id === selectedTask.id
        ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Mock clients for demo (replace with real data/fetch in production)
  const clients: Client[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: '', phone: '', address: '', status: 'Active', creditScore: 0, goalScore: 0, joinDate: '', disputes: 0, progress: 0, nextAction: '', totalPaid: 0 },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: '', phone: '', address: '', status: 'Active', creditScore: 0, goalScore: 0, joinDate: '', disputes: 0, progress: 0, nextAction: '', totalPaid: 0 },
    { id: '3', firstName: 'Sarah', lastName: 'Lee', email: '', phone: '', address: '', status: 'Active', creditScore: 0, goalScore: 0, joinDate: '', disputes: 0, progress: 0, nextAction: '', totalPaid: 0 },
    { id: '4', firstName: 'Mike', lastName: 'D', email: '', phone: '', address: '', status: 'Active', creditScore: 0, goalScore: 0, joinDate: '', disputes: 0, progress: 0, nextAction: '', totalPaid: 0 },
  ];

  // Enhanced filter logic
  const filteredTasks = tasks.filter(task => {
    const client = clients.find(c => c.id === (task.assignee ? task.assignee.id : '1'));
    const clientName = client ? `${client.firstName} ${client.lastName}` : '';
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.type || '').toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.type && task.type !== filter.type) return false;
    return true;
  });

  const events: CalendarEvent[] = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
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
                  onClick={() => setFilter({ ...filter, status: seg.value as Task['status'] })}
                  className={`px-4 py-2 rounded font-medium ${filter.status === seg.value || (!filter.status && !seg.value) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {seg.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-0.5">
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
                  const client = clients.find(c => c.id === (task.assignee ? task.assignee.id : '1'));
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
                          task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
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
            style={{ height: 600 }}
            views={['month', 'week', 'day']}
            defaultView="month"
            onSelectEvent={(event: CalendarEvent) => {
              setSelectedTask(event.resource);
              setShowNewTaskModal(true);
            }}
          />
        </div>
      )}

      <TaskModal
        isOpen={showNewTaskModal}
        onClose={() => {
          setShowNewTaskModal(false);
          setSelectedTask(undefined);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
      />
    </div>
  );
};

export default Tasks; 