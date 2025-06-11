import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Task, TaskTemplate, TaskFilter } from '../types/task';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchTemplates,
  createTemplate,
  setSelectedTask,
  setFilters,
  clearFilters,
} from '../store/features/taskSlice';

export const useTasks = () => {
  const dispatch = useDispatch();
  const {
    tasks,
    templates,
    selectedTask,
    loading,
    error,
    filters,
  } = useSelector((state: RootState) => state.tasks);

  const loadTasks = useCallback(
    (filters: TaskFilter) => {
      dispatch(fetchTasks(filters));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (task: Partial<Task>) => {
      return dispatch(createTask(task));
    },
    [dispatch]
  );

  const editTask = useCallback(
    (id: string, task: Partial<Task>) => {
      return dispatch(updateTask({ id, task }));
    },
    [dispatch]
  );

  const removeTask = useCallback(
    (id: string) => {
      return dispatch(deleteTask(id));
    },
    [dispatch]
  );

  const loadTemplates = useCallback(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const addTemplate = useCallback(
    (template: Partial<TaskTemplate>) => {
      return dispatch(createTemplate(template));
    },
    [dispatch]
  );

  const selectTask = useCallback(
    (task: Task | null) => {
      dispatch(setSelectedTask(task));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: TaskFilter) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return {
    tasks,
    templates,
    selectedTask,
    loading,
    error,
    filters,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    loadTemplates,
    addTemplate,
    selectTask,
    updateFilters,
    resetFilters,
  };
}; 