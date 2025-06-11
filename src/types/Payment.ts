export interface Payment {
  id: number;
  invoiceId: number;
  clientId: number;
  amount: number;
  date: string;
  method: 'Credit Card' | 'ACH' | 'Cash' | 'Check' | 'Other';
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  reference?: string;
} 