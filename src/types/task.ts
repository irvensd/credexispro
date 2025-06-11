export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked';
export type TaskType = 'general' | 'dispute' | 'client' | 'document' | 'payment';

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TaskDependency {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface TaskComment {
  id: string;
  content: string;
  author: TaskAssignee;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: TaskAssignee | null;
  dependencies: TaskDependency[];
  comments: TaskComment[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: TaskAssignee;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
  templateId?: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  estimatedHours?: number;
  checklist: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  tags: string[];
  createdBy: TaskAssignee;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  assignee?: string[];
  tags?: string[];
  dueDate?: {
    from: string;
    to: string;
  };
  search?: string;
} 