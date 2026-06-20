export interface Plan {
  id: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  annualPrice: number;
  maxStaff: number;
  maxServices: number;
  maxCustomers: number;
  hasCustomDomain: boolean;
  hasReports: boolean;
  hasWhatsAppNotifications: boolean;
  sortOrder: number;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: string;
  billingPeriod: string;
  startDate: string;
  endDate: string | null;
  trialEndDate: string | null;
  mpSubscriptionId: string | null;
  mpPreferenceId: string | null;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  mpPaymentId: string | null;
  paymentMethod: string | null;
  paymentDate: string;
}

export interface CreateSubscriptionRequest {
  planId: string;
  billingPeriod: string;
}
