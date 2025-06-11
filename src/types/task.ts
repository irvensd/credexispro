export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedTo?: number; // Client ID
  createdAt: string;
  updatedAt: string;
  reminderDate?: string;
  category?: 'Appointment' | 'Follow-up' | 'Payment' | 'Document' | 'Other';
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  attachments?: string[]; // URLs to attached files
} 