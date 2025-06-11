# State Management Documentation

## Redux Store Setup

The application uses Redux Toolkit for state management. The store is configured with the following slices:

### Store Configuration

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './features/authSlice';
import { clientsReducer } from './features/clientsSlice';
import { tasksReducer } from './features/tasksSlice';
import { settingsReducer } from './features/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    tasks: tasksReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Redux Slices

### Auth Slice

```typescript
// src/store/features/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});
```

### Clients Slice

```typescript
// src/store/features/clientsSlice.ts
interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
};

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(c => c.id !== action.payload);
    },
  },
});
```

### Tasks Slice

```typescript
// src/store/features/tasksSlice.ts
interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
});
```

## Custom Hooks

### useAppDispatch and useAppSelector

```typescript
// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// src/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Usage Examples

### Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/features/authSlice';

function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    try {
      dispatch(loginStart());
      const response = await loginApi(credentials);
      dispatch(loginSuccess(response));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

### Using Redux with Async Actions

```typescript
// src/store/features/clientsSlice.ts
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// In component
function ClientsList() {
  const dispatch = useAppDispatch();
  const { clients, loading, error } = useAppSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

## Best Practices

1. **Type Safety**
   - Use TypeScript for all Redux code
   - Define proper interfaces for state and actions
   - Use typed hooks (useAppDispatch, useAppSelector)

2. **State Structure**
   - Keep state normalized
   - Use selectors for derived data
   - Avoid duplicating data

3. **Performance**
   - Use memoization for expensive computations
   - Implement proper loading states
   - Handle errors appropriately

4. **Testing**
   - Test reducers in isolation
   - Mock API calls in tests
   - Test async actions
   - Verify state updates 