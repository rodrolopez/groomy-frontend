"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { publicService } from "@/services/public.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PublicBarbershop, PublicStaff, PublicService } from "@/types/public";
import type { AvailableSlot } from "@/types/appointment";

export default function PublicBookingPage() {
  const { slug } = useParams<{ slug: string }>();

  const [barbershop, setBarbershop] = useState<PublicBarbershop | null>(null);
  const [staff, setStaff] = useState<PublicStaff[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      publicService.getBarbershop(slug),
      publicService.getStaff(slug),
      publicService.getServices(slug),
    ])
      .then(([b, s, sv]) => {
        setBarbershop(b);
        setStaff(s);
        setServices(sv);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const filteredServices = services.filter(
    (sv) =>
      !selectedStaff ||
      staff.find((s) => s.id === selectedStaff)
  );

  useEffect(() => {
    if (!selectedStaff || !selectedService || !selectedDate) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    publicService
      .getAvailableSlots(slug, selectedStaff, selectedService, selectedDate)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [slug, selectedStaff, selectedService, selectedDate]);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    setError("");
    try {
      await publicService.book(slug, {
        staffId: selectedStaff,
        serviceId: selectedService,
        startTime: selectedSlot,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
      });
      setDone(true);
    } catch {
      setError("Error al reservar. Intentalo de nuevo.");
    } finally {
      setBooking(false);
    }
  };

  const reset = () => {
    setSelectedStaff("");
    setSelectedService("");
    setSelectedSlot("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setDone(false);
    setError("");
  };

  const primaryColor = barbershop?.primaryColor || "#8b5cf6";

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-400">Barbería no encontrada</h1>
          <p className="text-zinc-600 mt-2">Verificá el link e intentá de nuevo</p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            Turno confirmado
          </h1>
          <p className="text-zinc-400 mb-6">
            Te esperamos en {barbershop.name}. Te enviaremos un recordatorio.
          </p>
          <Button onClick={reset}>Reservar otro turno</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {barbershop.bannerUrl && (
        <div className="h-48 md:h-64 w-full overflow-hidden">
          <img
            src={barbershop.bannerUrl}
            alt={barbershop.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          {barbershop.logoUrl && (
            <img
              src={barbershop.logoUrl}
              alt={barbershop.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-2"
              style={{ borderColor: primaryColor }}
            />
          )}
          <h1
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColor}88)`,
            }}
          >
            {barbershop.name}
          </h1>
          <p className="text-zinc-500 mt-2">{barbershop.address}</p>
          {barbershop.description && (
            <p className="text-zinc-400 mt-4 max-w-md mx-auto">
              {barbershop.description}
            </p>
          )}
          <div className="flex justify-center gap-4 mt-4">
            {barbershop.instagram && (
              <a
                href={`https://instagram.com/${barbershop.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
              >
                Instagram
              </a>
            )}
            {barbershop.facebook && (
              <a
                href={`https://facebook.com/${barbershop.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
              >
                Facebook
              </a>
            )}
            {barbershop.whatsApp && (
              <a
                href={`https://wa.me/${barbershop.whatsApp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">
            Reservá tu turno
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Profesional</Label>
            <select
              value={selectedStaff}
              onChange={(e) => { setSelectedStaff(e.target.value); setSelectedSlot(""); }}
              className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            >
              <option value="">Seleccionar</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} — {s.role}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Servicio</Label>
            <select
              value={selectedService}
              onChange={(e) => { setSelectedService(e.target.value); setSelectedSlot(""); }}
              className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            >
              <option value="">Seleccionar</option>
              {services.map((sv) => (
                <option key={sv.id} value={sv.id}>
                  {sv.name} — ${sv.price.toLocaleString("es-AR")} ({sv.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(""); }}
            />
          </div>

          {slotsLoading && (
            <p className="text-sm text-zinc-500">Buscando horarios...</p>
          )}

          {!slotsLoading && slots.length > 0 && (
            <div className="space-y-2">
              <Label>Horario disponible</Label>
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    onClick={() => setSelectedSlot(slot.start)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                      selectedSlot === slot.start
                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                        : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    }`}
                    style={selectedSlot === slot.start ? {
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}33`,
                      color: primaryColor,
                    } : undefined}
                  >
                    {formatTime(slot.start)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!slotsLoading && selectedStaff && selectedService && slots.length === 0 && (
            <p className="text-sm text-yellow-500">
              No hay horarios disponibles para esta fecha
            </p>
          )}

          {selectedSlot && (
            <>
              <div className="border-t border-zinc-800 pt-4 space-y-4">
                <h3 className="text-sm font-medium text-zinc-300">
                  Tus datos
                </h3>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+54 11 1234-5678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email (opcional)</Label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleBook}
                disabled={booking || !customerName || !customerPhone}
              >
                {booking ? "Reservando..." : "Confirmar Reserva"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
