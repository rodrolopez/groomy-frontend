"use client";

import { useState, useCallback } from "react";
import { appointmentService } from "@/services/appointment.service";
import type {
  Appointment,
  CreateAppointmentRequest,
  AvailableSlot,
} from "@/types/appointment";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByDate = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getByDate(date);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar turnos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateAppointmentRequest) => {
    const result = await appointmentService.create(data);
    return result;
  }, []);

  const cancel = useCallback(async (id: string) => {
    await appointmentService.cancel(id);
  }, []);

  return { appointments, isLoading, error, fetchByDate, create, cancel };
}

export function useAvailableSlots() {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(
    async (staffId: string, serviceId: string, date: string) => {
      setIsLoading(true);
      try {
        const data = await appointmentService.getAvailableSlots(
          staffId,
          serviceId,
          date
        );
        setSlots(data);
      } catch {
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { slots, isLoading, fetch };
}
