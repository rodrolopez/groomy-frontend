export interface FinancialSummary {
  totalIncome: number;
  totalCommissions: number;
  netRevenue: number;
  completedAppointments: number;
  pendingCommissions: number;
  paidCommissions: number;
  incomeByService: IncomeByItem[];
  incomeByStaff: IncomeByStaff[];
}

export interface IncomeByItem {
  serviceName: string;
  total: number;
  count: number;
}

export interface IncomeByStaff {
  staffName: string;
  total: number;
  count: number;
  commission: number;
}

export interface Transaction {
  id: string;
  appointmentId: string;
  staffId: string;
  staffName: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  commissionAmount: number;
  netAmount: number;
  transactionDate: string;
  notes: string | null;
}

export interface PendingCommission {
  staffId: string;
  staffName: string;
  totalIncome: number;
  totalCommission: number;
}

export interface CreatePayoutRequest {
  staffId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  notes?: string;
}
