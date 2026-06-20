"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Staff } from "@/types/staff";
import type { Service } from "@/types/service";
import { useAvailableSlots } from "@/hooks/use-appointments";
import { appointmentService } from "@/services/appointment.service";
import { customerService } from "@/services/customer.service";
import type { Customer } from "@/types/customer";

interface AppointmentFormProps {
  staffList: Staff[];
  serviceList: Service[];
  preselectedStaffId?: string;
  preselectedTime?: Date;
  selectedDate: Date;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AppointmentForm({
  staffList,
  serviceList,
  preselectedStaffId,
  preselectedTime,
  selectedDate,
  onSuccess,
  onCancel,
}: AppointmentFormProps) {
  const [staffId, setStaffId] = useState(preselectedStaffId ?? "");
  const [serviceId, setServiceId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { slots, isLoading: slotsLoading, fetch: fetchSlots } = useAvailableSlots();
  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInEmail, setWalkInEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const filteredServices = serviceList.filter(
    (svc) => !staffId || staffList.find((s) => s.id === staffId)?.serviceIds.includes(svc.id)
  );

  useEffect(() => {
    if (staffId && serviceId) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      fetchSlots(staffId, serviceId, dateStr);
      setSelectedSlot(null);
    }
  }, [staffId, serviceId, selectedDate, fetchSlots]);

  useEffect(() => {
    if (preselectedTime && slots.length > 0 && !selectedSlot) {
      const preselectedMs = preselectedTime.getTime();
      const match = slots.find(s => {
        const slotMs = new Date(s.start).getTime();
        return Math.abs(slotMs - preselectedMs) < 30 * 60 * 1000;
      });
      if (match) setSelectedSlot(match.start);
    }
  }, [preselectedTime, slots, selectedSlot]);

  const handleSearch = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const data = await customerService.search(term);
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      }
    },
    []
  );

  const onSearchChange = (value: string) => {
    setCustomerSearch(value);
    setSelectedCustomer(null);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => handleSearch(value), 300);
  };

  const selectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setCustomerSearch(`${c.name} (${c.phone})`);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId || !serviceId || !selectedSlot) return;

    setIsCreating(true);
    setError(null);

    const body: Record<string, unknown> = {
      staffId,
      serviceId,
      startTime: selectedSlot,
    };

    if (selectedCustomer) {
      body.customerId = selectedCustomer.id;
    } else {
      body.customerName = walkInName;
      body.customerPhone = walkInPhone;
      body.customerEmail = walkInEmail || undefined;
    }

    if (notes) body.notes = notes;

    try {
      await appointmentService.create(
        body as unknown as import("@/types/appointment").CreateAppointmentRequest
      );
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear turno");
    } finally {
      setIsCreating(false);
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Staff</Label>
        <select
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar staff</option>
          {staffList
            .filter((s) => s.isActive)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} — {s.role}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Servicio</Label>
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar servicio</option>
          {filteredServices
            .filter((svc) => svc.isActive)
            .map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.name} — ${svc.price.toLocaleString("es-AR")} ({svc.durationMinutes} min)
              </option>
            ))}
        </select>
      </div>

      {slotsLoading && (
        <p className="text-sm text-zinc-500">Buscando horarios disponibles...</p>
      )}

      {!slotsLoading && slots.length > 0 && (
        <div className="space-y-2">
          <Label>Horario disponible</Label>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                onClick={() => setSelectedSlot(slot.start)}
                className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                  selectedSlot === slot.start
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        </div>
      )}

      {!slotsLoading && staffId && serviceId && slots.length === 0 && (
        <p className="text-sm text-yellow-500">
          No hay horarios disponibles para esta fecha
        </p>
      )}

      <div className="space-y-2">
        <Label>Cliente</Label>
        <Input
          placeholder="Buscar cliente existente..."
          value={customerSearch}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="border border-zinc-700 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
            {searchResults.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCustomer(c)}
                className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                {c.name} — {c.phone}
                {c.isVip && (
                  <span className="ml-2 text-xs text-yellow-500">⭐ VIP</span>
                )}
              </button>
            ))}
          </div>
        )}

        {!selectedCustomer && (
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-800">
            <div className="space-y-1">
              <Label className="text-xs">Nombre (walk-in)</Label>
              <Input
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="Nombre del cliente"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Teléfono</Label>
              <Input
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                placeholder="Teléfono"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Notas</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="flex w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Notas opcionales..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isCreating || !staffId || !serviceId || !selectedSlot}
        >
          {isCreating ? "Creando..." : "Confirmar Turno"}
        </Button>
      </div>
    </form>
  );
}
