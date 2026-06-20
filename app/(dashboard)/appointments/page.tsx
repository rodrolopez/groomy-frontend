"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useStaff } from "@/hooks/use-staff";
import { useServices } from "@/hooks/use-services";
import { useAppointments } from "@/hooks/use-appointments";
import { useBarbershop } from "@/hooks/use-barbershop";
import { CalendarView } from "@/components/calendar/calendar-view";
import { Dialog } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/appointment-form";
import { Button } from "@/components/ui/button";
import { appointmentService } from "@/services/appointment.service";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Appointment } from "@/types/appointment";
import type { DaySchedule } from "@/components/business-hours-editor";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function parseBusinessHours(json: string | null): DaySchedule[] {
  if (!json) return [];
  try { return JSON.parse(json); }
  catch { return []; }
}

export default function AppointmentsPage() {
  const { staff } = useStaff();
  const { services } = useServices();
  const { appointments, isLoading, fetchByDate, cancel } = useAppointments();
  const { barbershop, fetch: fetchBarbershop } = useBarbershop();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [createOpen, setCreateOpen] = useState(false);
  const [preselectedStaff, setPreselectedStaff] = useState<string | undefined>();
  const [preselectedTime, setPreselectedTime] = useState<Date | undefined>();
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => { fetchBarbershop(); }, [fetchBarbershop]);

  const daySchedule = useMemo(() => {
    if (!barbershop?.businessHours) return null;
    const schedules = parseBusinessHours(barbershop.businessHours);
    const dayName = DAY_NAMES[currentDate.getDay()];
    return schedules.find((s) => s.day === dayName) ?? null;
  }, [barbershop, currentDate]);

  const calendarOpeningTime = useMemo(() => {
    if (!daySchedule?.enabled) return undefined;
    const times = [daySchedule.open];
    if (daySchedule.open2) times.push(daySchedule.open2);
    times.sort();
    return times[0];
  }, [daySchedule]);

  const calendarClosingTime = useMemo(() => {
    if (!daySchedule?.enabled) return undefined;
    const times = [daySchedule.close];
    if (daySchedule.close2) times.push(daySchedule.close2);
    times.sort();
    return times[times.length - 1];
  }, [daySchedule]);

  const dateStr = currentDate.toISOString().split("T")[0];

  useEffect(() => {
    fetchByDate(dateStr);
  }, [dateStr, fetchByDate]);

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const today = () => setCurrentDate(new Date());

  const handleSlotClick = useCallback((staffId: string, time: Date) => {
    setPreselectedStaff(staffId);
    setPreselectedTime(time);
    setCreateOpen(true);
  }, []);

  const handleAppointmentClick = useCallback((appt: Appointment) => {
    setSelectedAppt(appt);
    setDetailsOpen(true);
  }, []);

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    fetchByDate(dateStr);
  };

  const handleCancelAppointment = async () => {
    if (!cancelTarget) return;
    await cancel(cancelTarget.id);
    setCancelTarget(null);
    setDetailsOpen(false);
    fetchByDate(dateStr);
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const statusLabels: Record<string, string> = {
    Scheduled: "Programado",
    Confirmed: "Confirmado",
    InProgress: "En curso",
    Completed: "Completado",
    Cancelled: "Cancelado",
    NoShow: "No asistió",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Turnos</h1>
          <p className="text-zinc-500 mt-1 capitalize">{formatDate(currentDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prevDay}>
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={today}>
            Hoy
          </Button>
          <Button variant="ghost" size="sm" onClick={nextDay}>
            →
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="ml-2">
            + Nuevo Turno
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <CalendarView
          date={currentDate}
          appointments={appointments}
          staff={staff.filter((s) => s.isActive)}
          onSlotClick={handleSlotClick}
          onAppointmentClick={handleAppointmentClick}
          openingTime={calendarOpeningTime}
          closingTime={calendarClosingTime}
        />
      )}
      <div>
        <Dialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Nuevo Turno"
        >
          <div className="mb-4 text-sm text-zinc-500">
            <AppointmentForm
              staffList={staff}
              serviceList={services}
              preselectedStaffId={preselectedStaff}
              preselectedTime={preselectedTime}
              selectedDate={currentDate}
              onSuccess={handleCreateSuccess}
              onCancel={() => setCreateOpen(false)}
            />
          </div>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={detailsOpen}
          onClose={() => { setDetailsOpen(false); setSelectedAppt(null); }}
          title="Detalle del Turno"
        >
          {selectedAppt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Cliente</span>
                  <p className="text-zinc-200 font-medium">
                    {selectedAppt.customerName ?? "—"}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500">Teléfono</span>
                  <p className="text-zinc-200">{selectedAppt.customerPhone ?? "—"}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Staff</span>
                  <p className="text-zinc-200">{selectedAppt.staffName}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Servicio</span>
                  <p className="text-zinc-200">{selectedAppt.serviceName}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Horario</span>
                  <p className="text-zinc-200">
                    {new Date(selectedAppt.startTime).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    —{" "}
                    {new Date(selectedAppt.endTime).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500">Precio</span>
                  <p className="text-zinc-200">
                    ${selectedAppt.price.toLocaleString("es-AR")}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500">Estado</span>
                  <p className="text-zinc-200">
                    {statusLabels[selectedAppt.status] ?? selectedAppt.status}
                  </p>
                </div>
              </div>
              {selectedAppt.notes && (
                <div>
                  <span className="text-sm text-zinc-500">Notas</span>
                  <p className="text-sm text-zinc-300 mt-1">{selectedAppt.notes}</p>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
                {selectedAppt.status !== "Cancelled" &&
                  selectedAppt.status !== "Completed" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setCancelTarget(selectedAppt);
                      }}
                    >
                      Cancelar Turno
                    </Button>
                  )}
              </div>
            </div>
          )}
        </Dialog>
      </div>
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelAppointment}
        title="Cancelar Turno"
        message={`¿Cancelar el turno de ${cancelTarget?.customerName ?? "este cliente"}?`}
      />
    </div>
  );
}
