"use client";

import { useMemo } from "react";
import type { Appointment } from "@/types/appointment";
import type { Staff } from "@/types/staff";

interface CalendarViewProps {
  date: Date;
  appointments: Appointment[];
  staff: Staff[];
  onSlotClick: (staffId: string, time: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  openingTime?: string;
  closingTime?: string;
}

const SLOT_HEIGHT = 48;
const APPT_TOP_MARGIN = 2;
const APPT_SIDE_MARGIN = 4;
const SCROLL_BOTTOM_PAD = 48;

export function CalendarView({
  date,
  appointments,
  staff,
  onSlotClick,
  onAppointmentClick,
  openingTime = "08:00",
  closingTime = "20:00",
}: CalendarViewProps) {
  const { openTotalMin, slots } = useMemo(() => {
    const [oh, om] = openingTime.split(":").map(Number);
    const [ch, cm] = closingTime.split(":").map(Number);
    const open = oh * 60 + om - 30;
    const close = ch * 60 + cm;
    const count = Math.max(0, (close - open) / 30);
    const slotList = Array.from({ length: count }, (_, i) => {
      const m = open + i * 30;
      return { hour: Math.floor(m / 60), min: m % 60 };
    });
    return { openTotalMin: open, slots: slotList };
  }, [openingTime, closingTime]);

  const statusColors: Record<string, string> = {
    Scheduled: "border-l-purple-500 bg-purple-500/10 hover:bg-purple-500/20",
    Confirmed: "border-l-blue-500 bg-blue-500/10 hover:bg-blue-500/20",
    InProgress: "border-l-green-500 bg-green-500/10 hover:bg-green-500/20",
    Completed: "border-l-zinc-600 bg-zinc-800/50 opacity-60 text-zinc-400",
    Cancelled: "border-l-red-500 bg-red-500/10 opacity-50 line-through",
    NoShow: "border-l-yellow-500 bg-yellow-500/10 opacity-60",
  };

  const getAppointmentsForStaff = (staffId: string) =>
    appointments.filter((a) => a.staffId === staffId);

  const getSlotIndex = (time: string | number) => {
    const d = new Date(time);
    return (d.getHours() * 60 + d.getMinutes() - openTotalMin) / 30;
  };

  const getTop = (time: string | number) =>
    getSlotIndex(time) * SLOT_HEIGHT + APPT_TOP_MARGIN;

  const isSlotOccupied = (staffId: string, slotIndex: number) => {
    const cellStart = openTotalMin + slotIndex * 30;
    const cellEnd = cellStart + 30;
    return getAppointmentsForStaff(staffId).some((appt) => {
      if (appt.status === "Cancelled") return false;
      const dStart = new Date(appt.startTime);
      const dEnd = new Date(appt.endTime);
      const apptStart = dStart.getHours() * 60 + dStart.getMinutes();
      const apptEnd = dEnd.getHours() * 60 + dEnd.getMinutes();
      return apptStart < cellEnd && apptEnd > cellStart;
    });
  };

  const getHeight = (start: string, end: string) => {
    const durationMinutes =
      (new Date(end).getTime() - new Date(start).getTime()) / 60000;
    return Math.max(
      (durationMinutes / 30) * SLOT_HEIGHT - APPT_TOP_MARGIN * 2,
      24,
    );
  };

  const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (staff.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-600">
        No hay staff activo. Creá miembros del staff primero.
      </div>
    );
  }

  const totalHeight = slots.length * SLOT_HEIGHT + SCROLL_BOTTOM_PAD;

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-[#09090b] flex flex-col">
      <div className="flex border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-30">
        <div className="w-15 shrink-0" />
        {staff.map((s) => (
          <div
            key={s.id}
            className="flex-1 px-3 py-3 text-center border-l border-zinc-800/40"
          >
            <div className="flex items-center justify-center gap-1.5">
              {s.color && (
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: s.color }}
                />
              )}
              <span className="text-sm font-semibold text-zinc-200 truncate">
                {s.firstName}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="overflow-y-auto w-full"
        style={{ scrollbarColor: "#27272a #09090b" }}
      >
        <div
          className="flex min-w-150 relative"
          style={{ height: `${totalHeight}px` }}
        >
          <div className="w-15 shrink-0 border-r border-zinc-800/40 relative">
            {slots.map((slot, i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
              >
                {slot.min === 0 && (
                  <span className="absolute top-0 right-2 text-[11px] font-medium text-zinc-500 leading-none pointer-events-none">
                    {slot.hour.toString().padStart(2, "0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>

          {staff.map((s) => (
            <div
              key={s.id}
              className="flex-1 relative border-r border-zinc-800/20 last:border-r-0"
            >
              {slots.map((slot, i) => {
                const occupied = isSlotOccupied(s.id, i);
                return (
                  <div
                    key={`bg-${i}`}
                    className={`absolute w-full border-t border-zinc-800/20 transition-colors ${
                      occupied
                        ? "bg-zinc-800/40 cursor-not-allowed"
                        : "cursor-pointer hover:bg-zinc-900/40"
                    }`}
                    style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                    onClick={() => {
                      if (occupied) return;
                      const slotDate = new Date(date);
                      slotDate.setHours(slot.hour, slot.min, 0, 0);
                      onSlotClick(s.id, slotDate);
                    }}
                  />
                );
              })}

              {getAppointmentsForStaff(s.id).map((appt) => {
                const cs =
                  statusColors[appt.status] ||
                  "border-l-zinc-500 bg-zinc-500/10";
                return (
                  <div
                    key={appt.id}
                    className={`absolute rounded-lg border-l-4 px-2.5 py-1.5 cursor-pointer transition-all overflow-hidden shadow-sm shadow-black/40 ${cs}`}
                      style={{
                      top: getTop(new Date(appt.startTime).getTime() - 30 * 60 * 1000),
                      height: getHeight(appt.startTime, appt.endTime),
                      left: APPT_SIDE_MARGIN,
                      right: APPT_SIDE_MARGIN,
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(appt);
                    }}
                  >
                    <p className="text-xs font-semibold text-zinc-100 truncate leading-tight">
                      {appt.customerName ?? "Cliente"}
                    </p>
                    <p className="text-[10px] font-medium text-zinc-400 truncate mt-0.5">
                      {formatTime(appt.startTime)} - {appt.serviceName}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
