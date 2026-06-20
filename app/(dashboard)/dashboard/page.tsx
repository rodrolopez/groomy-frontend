"use client";

import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";
import { useAppointments } from "@/hooks/use-appointments";
import { useFinances } from "@/hooks/use-finances";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboard();
  const { appointments, fetchByDate } = useAppointments();
  const { fetchSummary, summary } = useFinances();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchByDate(today);
    fetchSummary(today, today);
  }, [today, fetchByDate, fetchSummary]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const fmt = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  const cards = [
    {
      label: "Turnos Hoy",
      value: stats?.todayAppointments ?? "--",
      href: "/appointments",
      color: "text-blue-400",
    },
    {
      label: "Completados Hoy",
      value: stats?.completedToday ?? "--",
      color: "text-green-400",
    },
    {
      label: "Pendientes",
      value: stats?.pendingAppointments ?? "--",
      color: "text-yellow-400",
    },
    {
      label: "Ingresos Hoy",
      value: stats ? fmt(stats.todayIncome) : "--",
      color: "text-purple-400",
    },
    {
      label: "Staff Activo",
      value: stats?.activeStaff ?? "--",
      href: "/staff",
      color: "text-zinc-100",
    },
    {
      label: "Clientes",
      value: stats?.totalCustomers ?? "--",
      href: "/customers",
      color: "text-zinc-100",
    },
    {
      label: "Turnos Semana",
      value: stats?.weeklyAppointments ?? "--",
      color: "text-blue-400",
    },
    {
      label: "Ingresos Semana",
      value: stats ? fmt(stats.weeklyIncome) : "--",
      color: "text-purple-400",
    },
  ];

  const soonAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">
          Bienvenido, {user?.firstName}
        </h1>
        <p className="text-zinc-500 mt-1">
          Panel de control — {new Date().toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href ?? "#"} className={!card.href ? "pointer-events-none" : ""}>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{card.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Próximos Turnos</CardTitle>
              <CardDescription>Hoy</CardDescription>
            </div>
            <Link href="/appointments">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {soonAppointments.length === 0 ? (
              <p className="text-center py-8 text-zinc-600">
                No hay turnos para hoy
              </p>
            ) : (
              <div className="space-y-3">
                {soonAppointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {a.customerName ?? "Cliente"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {a.serviceName} con {a.staffName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-300">
                        {new Date(a.startTime).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <span
                        className={`text-xs ${
                          a.status === "Scheduled"
                            ? "text-yellow-400"
                            : a.status === "Confirmed"
                            ? "text-blue-400"
                            : a.status === "InProgress"
                            ? "text-green-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
            <CardDescription>Módulos del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Nuevo Turno", href: "/appointments", emoji: "📅" },
                { label: "Staff", href: "/staff", emoji: "👤" },
                { label: "Servicios", href: "/services", emoji: "✂️" },
                { label: "Clientes", href: "/customers", emoji: "👥" },
                { label: "Finanzas", href: "/finances", emoji: "💰" },
                { label: "Mi Barbería", href: "/barbershop", emoji: "🏪" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer bg-zinc-900/30">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-sm text-zinc-300">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
