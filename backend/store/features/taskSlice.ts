import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskTemplate, TaskFilter } from '../../types/task';
import { API_ENDPOINTS } from '../../config/constants';
import { api } from '../../services/api';

interface TaskState {
  tasks: Task[];
  templates: TaskTemplate[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  filters: TaskFilter;
}

const initialState: TaskState = {
  tasks: [],
  templates: [],
  selectedTask: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters: TaskFilter) => {
    const response = await api.get(API_ENDPOINTS.TASKS.LIST, { params: filters });
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Partial<Task>) => {
    const response = await api.post(API_ENDPOINTS.TASKS.CREATE, task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: string; task: Partial<Task> }) => {
    const response = await api.put(`${API_ENDPOINTS.TASKS.UPDATE}/${id}`, task);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    await api.delete(`${API_ENDPOINTS.TASKS.DELETE}/${id}`);
    return id;
  }
);

export const fetchTemplates = createAsyncThunk(
  'tasks/fetchTemplates',
  async () => {
    const response = await api.get(API_ENDPOINTS.TASKS.TEMPLATES);
    return response.data;
  }
);

export const createTemplate = createAsyncThunk(
  'tasks/createTemplate',
  async (template: Partial<TaskTemplate>) => {
    const response = await api.post(API_ENDPOINTS.TASKS.TEMPLATES, template);
    return response.data;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setFilters: (state, action: PayloadAction<TaskFilter>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      // Fetch templates
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      // Create template
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.templates.push(action.payload);
      });
  },
});

export const { setSelectedTask, setFilters, clearFilters } = taskSlice.actions;
export default taskSlice.reducer; 