# API Integration Documentation

## API Client Setup

The application uses Axios for API requests with a configured instance:

```typescript
// src/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## API Endpoints

### Authentication

```typescript
// src/api/auth.ts
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/auth/login', credentials),

  logout: () => api.post('/auth/logout'),

  refreshToken: () => api.post<RefreshTokenResponse>('/auth/refresh'),

  getProfile: () => api.get<User>('/auth/profile'),
};
```

### Clients

```typescript
// src/api/clients.ts
export const clientsApi = {
  getAll: () => api.get<Client[]>('/clients'),

  getById: (id: string) => api.get<Client>(`/clients/${id}`),

  create: (data: CreateClientData) =>
    api.post<Client>('/clients', data),

  update: (id: string, data: UpdateClientData) =>
    api.put<Client>(`/clients/${id}`, data),

  delete: (id: string) => api.delete(`/clients/${id}`),
};
```

### Tasks

```typescript
// src/api/tasks.ts
export const tasksApi = {
  getAll: () => api.get<Task[]>('/tasks'),

  getById: (id: string) => api.get<Task>(`/tasks/${id}`),

  create: (data: CreateTaskData) =>
    api.post<Task>('/tasks', data),

  update: (id: string, data: UpdateTaskData) =>
    api.put<Task>(`/tasks/${id}`, data),

  delete: (id: string) => api.delete(`/tasks/${id}`),

  updateStatus: (id: string, status: TaskStatus) =>
    api.patch<Task>(`/tasks/${id}/status`, { status }),
};
```

## Data Types

### Authentication Types

```typescript
// src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
```

### Client Types

```typescript
// src/types/client.ts
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export type ClientStatus = 'active' | 'inactive' | 'pending';

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  status?: ClientStatus;
}
```

### Task Types

```typescript
// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  clientId: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: TaskStatus;
}
```

## Error Handling

```typescript
// src/utils/error-handling.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || 'An error occurred',
      error.response?.data
    );
  }
  return new ApiError(500, 'An unexpected error occurred');
};
```

## Usage Examples

### Authentication Flow

```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch(loginSuccess({ token, user }));
      
      return user;
    } catch (error) {
      const apiError = handleApiError(error);
      dispatch(loginFailure(apiError.message));
      throw apiError;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('token');
      dispatch(logout());
    }
  };

  return { login, logout, user, token };
};
```

### Client Management

```typescript
// src/hooks/useClients.ts
export const useClients = () => {
  const dispatch = useAppDispatch();
  const { clients, loading, error } = useAppSelector((state) => state.clients);

  const fetchClients = async () => {
    try {
      dispatch(setLoading(true));
      const response = await clientsApi.getAll();
      dispatch(setClients(response.data));
    } catch (error) {
      const apiError = handleApiError(error);
      dispatch(setError(apiError.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createClient = async (data: CreateClientData) => {
    try {
      const response = await clientsApi.create(data);
      dispatch(addClient(response.data));
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
  };
};
```

## Best Practices

1. **Error Handling**
   - Use consistent error handling patterns
   - Provide meaningful error messages
   - Handle network errors gracefully
   - Implement retry logic for failed requests

2. **Type Safety**
   - Define proper TypeScript interfaces
   - Use type guards for runtime checks
   - Validate API responses

3. **Security**
   - Implement proper token management
   - Handle token refresh
   - Sanitize user input
   - Use HTTPS for all requests

4. **Performance**
   - Implement request caching
   - Use request debouncing
   - Handle concurrent requests
   - Implement proper loading states 