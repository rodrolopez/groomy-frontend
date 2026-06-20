import { api } from "@/lib/api";
import type { Staff, CreateStaffRequest, UpdateStaffRequest } from "@/types/staff";

export const staffService = {
  getAll: () => api.get<Staff[]>("/staff"),

  getById: (id: string) => api.get<Staff>(`/staff/${id}`),

  create: (data: CreateStaffRequest) =>
    api.post<Staff>("/staff", data),

  update: (id: string, data: UpdateStaffRequest) =>
    api.put<Staff>(`/staff/${id}`, data),

  delete: (id: string) => api.delete<void>(`/staff/${id}`),
};
