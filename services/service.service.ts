import { api } from "@/lib/api";
import type { Service, CreateServiceRequest, UpdateServiceRequest } from "@/types/service";

export const serviceService = {
  getAll: () => api.get<Service[]>("/services"),

  getById: (id: string) => api.get<Service>(`/services/${id}`),

  create: (data: CreateServiceRequest) =>
    api.post<Service>("/services", data),

  update: (id: string, data: UpdateServiceRequest) =>
    api.put<Service>(`/services/${id}`, data),

  delete: (id: string) => api.delete<void>(`/services/${id}`),
};
