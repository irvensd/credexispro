export interface Invoice {
  id: number;
  clientId: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  items: { description: string; amount: number }[];
  total: number;
  paidAmount: number;
  notes?: string;
  paymentMethodId?: number;
} 