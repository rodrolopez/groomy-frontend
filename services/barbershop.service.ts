import { api } from "@/lib/api";
import type {
  Barbershop,
  CreateBarbershopRequest,
  UpdateBarbershopRequest,
} from "@/types/barbershop";

export const barbershopService = {
  async get(): Promise<Barbershop> {
    return api.get<Barbershop>("/barbershops");
  },

  async create(data: CreateBarbershopRequest): Promise<Barbershop> {
    return api.post<Barbershop>("/barbershops", data);
  },

  async update(data: UpdateBarbershopRequest): Promise<Barbershop> {
    return api.put<Barbershop>("/barbershops", data);
  },
};
