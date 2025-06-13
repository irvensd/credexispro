export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  status: 'Active' | 'Inactive' | 'Completed';
  creditScore?: number;
  goalScore?: number;
  joinDate: string;
  disputes?: number;
  progress?: number;
  nextAction?: string;
  totalPaid?: number;
  dateOfBirth?: string;
  ssn?: string;
  notes?: string;
  monthlyFee?: number;
  servicePlan?: 'Basic' | 'Pro' | 'Enterprise';
  createdAt?: string;
  updatedAt?: string;
} 