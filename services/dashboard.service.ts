import { api } from "@/lib/api";

export interface DashboardStats {
  todayAppointments: number;
  weeklyAppointments: number;
  activeStaff: number;
  totalCustomers: number;
  todayIncome: number;
  weeklyIncome: number;
  pendingAppointments: number;
  completedToday: number;
}

export const dashboardService = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats"),
};
