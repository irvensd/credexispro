import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchTemplates,
  createTemplate,
  setSelectedTask,
  clearError
} from '../store/slices/taskSlice';
import type { Task, TaskTemplate, TaskFilter } from '../types/task';

export const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    tasks,
    selectedTask,
    templates,
    loading,
    error
  } = useSelector((state: RootState) => state.tasks);

  const loadTasks = (filters: TaskFilter) => {
    dispatch(fetchTasks(filters));
  };

  const addTask = async (task: Partial<Task>) => {
    return dispatch(createTask(task));
  };

  const editTask = async (id: string, task: Partial<Task>) => {
    return dispatch(updateTask({ id, task }));
  };

  const removeTask = async (id: string) => {
    return dispatch(deleteTask(id));
  };

  const loadTemplates = () => {
    dispatch(fetchTemplates());
  };

  const addTemplate = async (template: Partial<TaskTemplate>) => {
    return dispatch(createTemplate(template));
  };

  const selectTask = (task: Task | null) => {
    dispatch(setSelectedTask(task));
  };

  const clearTaskError = () => {
    dispatch(clearError());
  };

  return {
    tasks,
    selectedTask,
    templates,
    loading,
    error,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    loadTemplates,
    addTemplate,
    selectTask,
    clearTaskError
  };
}; 