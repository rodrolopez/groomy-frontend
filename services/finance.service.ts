import { api } from "@/lib/api";
import type { FinancialSummary, Transaction, PendingCommission, CreatePayoutRequest } from "@/types/finance";

export const financeService = {
  getSummary: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return api.get<FinancialSummary>(`/finances/summary${qs ? `?${qs}` : ""}`);
  },

  getTransactions: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return api.get<Transaction[]>(`/finances/transactions${qs ? `?${qs}` : ""}`);
  },

  getPendingCommissions: () =>
    api.get<PendingCommission[]>("/finances/pending-commissions"),

  completeAppointment: (appointmentId: string) =>
    api.post<void>(`/finances/complete-appointment/${appointmentId}`, {}),

  createPayout: (data: CreatePayoutRequest) =>
    api.post<void>("/finances/payouts", data),
};
