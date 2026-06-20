export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isVip: boolean;
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  isVip?: boolean;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  isVip?: boolean;
}
