import { publicApi } from "@/lib/api";
import type { PublicBarbershop, PublicStaff, PublicService, PublicBookingRequest } from "@/types/public";
import type { AvailableSlot } from "@/types/appointment";

export const publicService = {
  getBarbershop: (slug: string) =>
    publicApi.get<PublicBarbershop>(`/public/${slug}`),

  getStaff: (slug: string) =>
    publicApi.get<PublicStaff[]>(`/public/${slug}/staff`),

  getServices: (slug: string, staffId?: string) =>
    publicApi.get<PublicService[]>(
      `/public/${slug}/services${staffId ? `?staffId=${staffId}` : ""}`
    ),

  getAvailableSlots: (slug: string, staffId: string, serviceId: string, date: string) =>
    publicApi.get<AvailableSlot[]>(
      `/public/${slug}/available-slots?staffId=${staffId}&serviceId=${serviceId}&date=${date}`
    ),

  book: (slug: string, data: PublicBookingRequest) =>
    publicApi.post<void>(`/public/${slug}/book`, data),
};
