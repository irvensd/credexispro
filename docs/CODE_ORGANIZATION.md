# Code Organization

## Project Structure

```
src/
├── api/                 # API integration layer
│   ├── client.ts       # Axios instance and interceptors
│   ├── auth.ts         # Authentication endpoints
│   ├── clients.ts      # Client management endpoints
│   └── tasks.ts        # Task management endpoints
│
├── components/         # React components
│   ├── common/        # Reusable UI components
│   ├── layout/        # Layout components
│   ├── forms/         # Form components
│   └── features/      # Feature-specific components
│
├── config/            # Configuration files
│   ├── constants.ts   # Application constants
│   ├── routes.ts      # Route definitions
│   └── security.ts    # Security configuration
│
├── hooks/             # Custom React hooks
│   ├── useAuth.ts     # Authentication hook
│   ├── useForm.ts     # Form handling hook
│   └── useApi.ts      # API integration hook
│
├── layouts/           # Page layouts
│   ├── MainLayout.tsx # Main application layout
│   └── AuthLayout.tsx # Authentication layout
│
├── pages/             # Page components
│   ├── auth/         # Authentication pages
│   ├── clients/      # Client management pages
│   └── tasks/        # Task management pages
│
├── store/             # State management
│   ├── index.ts      # Store configuration
│   ├── slices/       # Redux slices
│   └── selectors/    # Redux selectors
│
├── styles/            # Global styles
│   ├── globals.css   # Global CSS
│   └── themes/       # Theme configurations
│
├── types/             # TypeScript type definitions
│   ├── api.ts        # API types
│   ├── auth.ts       # Authentication types
│   └── models.ts     # Data model types
│
├── utils/             # Utility functions
│   ├── api.ts        # API utilities
│   ├── auth.ts       # Authentication utilities
│   └── validation.ts # Validation utilities
│
└── App.tsx           # Root component
```

## Code Organization Principles

### 1. Feature-First Organization
- Group related code by feature
- Keep feature-specific code close together
- Minimize cross-feature dependencies

### 2. Layer Separation
- Clear separation between UI, business logic, and data access
- Use dependency injection for better testability
- Maintain unidirectional data flow

### 3. Component Structure
```typescript
// Example component structure
import { FC } from 'react';
import { useFeature } from '@/hooks/useFeature';
import { FeatureType } from '@/types/feature';
import { FeatureComponent } from './FeatureComponent';
import styles from './Feature.module.css';

interface FeatureProps {
  // Props interface
}

export const Feature: FC<FeatureProps> = (props) => {
  // Custom hooks
  const { data, loading, error } = useFeature();

  // Event handlers
  const handleAction = () => {
    // Action logic
  };

  // Render helpers
  const renderContent = () => {
    // Content rendering logic
  };

  // Main render
  return (
    <div className={styles.container}>
      {renderContent()}
    </div>
  );
};
```

### 4. File Naming Conventions
- Use PascalCase for components: `UserProfile.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use kebab-case for styles: `user-profile.module.css`
- Use `.test.ts` or `.spec.ts` for tests
- Use `.types.ts` for type definitions

### 5. Import Organization
```typescript
// 1. React and third-party imports
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

// 2. Absolute imports from src
import { Button } from '@/components/common';
import { useAuth } from '@/hooks';

// 3. Relative imports
import { UserCard } from './UserCard';
import styles from './styles.module.css';

// 4. Type imports
import type { User } from './types';
```

### 6. State Management
- Use Redux for global state
- Use React Context for theme/auth
- Use local state for UI state
- Use custom hooks for reusable logic

### 7. Error Handling
```typescript
// Error boundary component
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}
```

### 8. Testing Organization
```
__tests__/
├── components/       # Component tests
├── hooks/           # Hook tests
├── utils/           # Utility tests
└── integration/     # Integration tests
```

### 9. Documentation
- Use JSDoc for function documentation
- Include README files in feature directories
- Document complex business logic
- Keep documentation close to code

### 10. Code Quality
- Use ESLint for code linting
- Use Prettier for code formatting
- Use TypeScript for type safety
- Follow consistent naming conventions

## Best Practices

1. **Component Design**
   - Keep components small and focused
   - Use composition over inheritance
   - Implement proper prop types
   - Use proper error boundaries

2. **State Management**
   - Use appropriate state management solutions
   - Keep state as local as possible
   - Implement proper loading states
   - Handle errors gracefully

3. **Performance**
   - Implement proper memoization
   - Use code splitting
   - Optimize bundle size
   - Implement proper caching

4. **Testing**
   - Write unit tests for utilities
   - Write component tests
   - Write integration tests
   - Maintain good test coverage

5. **Maintenance**
   - Keep dependencies updated
   - Remove unused code
   - Document changes
   - Follow semantic versioning 