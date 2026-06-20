import { api } from "@/lib/api";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "@/types/customer";

export const customerService = {
  getAll: (search?: string) =>
    api.get<Customer[]>(`/customers${search ? `?search=${search}` : ""}`),

  search: (term: string) =>
    api.get<Customer[]>(`/customers/search/${term}`),

  create: (data: CreateCustomerRequest) =>
    api.post<Customer>("/customers", data),

  update: (id: string, data: UpdateCustomerRequest) =>
    api.put<Customer>(`/customers/${id}`, data),
};
