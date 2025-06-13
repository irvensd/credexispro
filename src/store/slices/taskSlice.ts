import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskTemplate, TaskFilter } from '../../types/task';
import type { TaskState } from '../../types/store';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/constants';

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  templates: [],
  loading: false,
  error: null,
  filters: {
    status: [],
    priority: [],
    assignedTo: [],
  }
};

export const fetchTasks = createAsyncThunk<Task[], TaskFilter>(
  'tasks/fetchTasks',
  async (filters) => {
    const response = await api.get<Task[]>(API_ENDPOINTS.TASKS.LIST, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    });
    return response.data;
  }
);

export const createTask = createAsyncThunk<Task, Partial<Task>>(
  'tasks/createTask',
  async (task) => {
    const response = await api.post<Task>(API_ENDPOINTS.TASKS.CREATE, task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk<Task, { id: string; task: Partial<Task> }>(
  'tasks/updateTask',
  async ({ id, task }) => {
    const response = await api.put<Task>(`${API_ENDPOINTS.TASKS.UPDATE}/${id}`, task);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk<string, string>(
  'tasks/deleteTask',
  async (id) => {
    await api.delete(`${API_ENDPOINTS.TASKS.DELETE}/${id}`);
    return id;
  }
);

export const fetchTemplates = createAsyncThunk<TaskTemplate[]>(
  'tasks/fetchTemplates',
  async () => {
    const response = await api.get<TaskTemplate[]>(API_ENDPOINTS.TASKS.TEMPLATES);
    return response.data;
  }
);

export const createTemplate = createAsyncThunk<TaskTemplate, Partial<TaskTemplate>>(
  'tasks/createTemplate',
  async (template) => {
    const response = await api.post<TaskTemplate>(API_ENDPOINTS.TASKS.TEMPLATES, template);
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
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<TaskState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          if (state.selectedTask?.id === action.payload.id) {
            state.selectedTask = action.payload;
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(fetchTemplates.fulfilled, (state, action: PayloadAction<TaskTemplate[]>) => {
        state.templates = action.payload;
      })
      .addCase(createTemplate.fulfilled, (state, action: PayloadAction<TaskTemplate>) => {
        state.templates.push(action.payload);
      });
  }
});

export const { setSelectedTask, clearError, setFilters, clearFilters } = taskSlice.actions;
export default taskSlice.reducer; 