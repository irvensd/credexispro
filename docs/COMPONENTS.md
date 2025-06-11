# Component Documentation

## Layout Components

### AppLayout
The main layout component that wraps the entire application.

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Features:**
- Responsive sidebar navigation
- Topbar with user profile and notifications
- Theme switching
- Mobile-friendly design

### Sidebar
Navigation sidebar component with collapsible menu.

```typescript
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}
```

**Features:**
- Collapsible menu
- Active route highlighting
- Nested menu support
- Mobile responsiveness

## Form Components

### FormInput
Reusable form input component with validation.

```typescript
interface FormInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}
```

**Features:**
- Form validation
- Error handling
- Label support
- Disabled state
- Required field indication

### FormSelect
Custom select component with search and multi-select support.

```typescript
interface FormSelectProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  multiple?: boolean;
  searchable?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}
```

**Features:**
- Search functionality
- Multi-select support
- Custom styling
- Keyboard navigation
- Clear selection

## UI Components

### Button
Custom button component with various styles and states.

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

**Features:**
- Multiple variants
- Loading state
- Icon support
- Disabled state
- Full width option

### Modal
Modal dialog component with animations.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
```

**Features:**
- Smooth animations
- Multiple sizes
- Close on backdrop click
- Keyboard support
- Focus management

### Toast
Notification component for displaying messages.

```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}
```

**Features:**
- Multiple types
- Auto-dismiss
- Progress bar
- Stack multiple toasts
- Custom duration

## Feature Components

### ClientCard
Card component for displaying client information.

```typescript
interface ClientCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
  };
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}
```

**Features:**
- Client details display
- Edit and delete actions
- Status indicators
- Responsive design

### TaskList
Component for displaying and managing tasks.

```typescript
interface TaskListProps {
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
  }>;
  onStatusChange?: (taskId: string, status: string) => void;
  onDelete?: (taskId: string) => void;
}
```

**Features:**
- Task filtering
- Status updates
- Due date display
- Delete functionality
- Drag and drop support

## Usage Examples

### Form with Validation
```tsx
import { FormInput, FormSelect } from '@/components/form';

function MyForm() {
  return (
    <form>
      <FormInput
        name="email"
        label="Email"
        type="email"
        required
        error={errors.email}
      />
      <FormSelect
        name="role"
        label="Role"
        options={roleOptions}
        required
        error={errors.role}
      />
    </form>
  );
}
```

### Modal with Content
```tsx
import { Modal, Button } from '@/components/ui';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
        size="md"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Toast Notifications
```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { success, error } = useToast();

  const handleSuccess = () => {
    success('Operation completed successfully!');
  };

  const handleError = () => {
    error('An error occurred');
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Show Success</Button>
      <Button onClick={handleError}>Show Error</Button>
    </div>
  );
}
``` 