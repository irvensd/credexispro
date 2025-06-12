export interface PaymentMethod {
  id: number;
  clientId: number;
  type: 'Credit Card' | 'ACH' | 'Other';
  last4: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  addedAt: string;
  isDefault: boolean;
} 