import { api } from "@/lib/api";
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AvailableSlot,
} from "@/types/appointment";

export const appointmentService = {
  getByDate: (date: string) =>
    api.get<Appointment[]>(`/appointments/by-date?date=${date}`),

  getByStaff: (staffId: string, date: string) =>
    api.get<Appointment[]>(`/appointments/by-staff/${staffId}?date=${date}`),

  getAvailableSlots: (staffId: string, serviceId: string, date: string) =>
    api.get<AvailableSlot[]>(
      `/appointments/available-slots?staffId=${staffId}&serviceId=${serviceId}&date=${date}`
    ),

  create: (data: CreateAppointmentRequest) =>
    api.post<Appointment>("/appointments", data),

  update: (id: string, data: UpdateAppointmentRequest) =>
    api.put<Appointment>(`/appointments/${id}`, data),

  cancel: (id: string) =>
    api.put<Appointment>(`/appointments/${id}/cancel`, {}),
};
