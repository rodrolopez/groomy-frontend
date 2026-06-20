"use client";

import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const STATUS_LABELS: Record<string, string> = {
  Active: "Activa",
  Pending: "Pendiente",
  Cancelled: "Cancelada",
  Expired: "Vencida",
};

const STATUS_COLORS: Record<string, string> = {
  Active: "text-green-400",
  Pending: "text-yellow-400",
  Cancelled: "text-red-400",
  Expired: "text-zinc-500",
};

function fmtARS(n: number) {
  if (n === 0) return "Gratis";
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

export default function SubscriptionPage() {
  const { plans, current, payments, isLoading, error, fetchPlans, fetchCurrent, fetchPayments, create } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [billingPeriod, setBillingPeriod] = useState<"Monthly" | "Annual">("Monthly");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchCurrent();
    fetchPayments();
  }, [fetchPlans, fetchCurrent, fetchPayments]);

  const handleSubscribe = async (planId: string) => {
    setIsCreating(true);
    try {
      await create({ planId, billingPeriod });
    } catch {
      // handled by hook
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Suscripción</h1>
        <p className="text-zinc-500 mt-1">Gestioná tu plan y facturación</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-4">
          {error}
        </div>
      )}

      {current && (
        <Card>
          <CardHeader>
            <CardTitle>Plan actual</CardTitle>
            <CardDescription>Estado de tu suscripción</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-zinc-500">Plan</p>
                <p className="text-lg font-semibold text-zinc-200">{current.planName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Estado</p>
                <p className={`text-lg font-semibold ${STATUS_COLORS[current.status] ?? "text-zinc-400"}`}>
                  {STATUS_LABELS[current.status] ?? current.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Ciclo</p>
                <p className="text-lg font-semibold text-zinc-200">
                  {current.billingPeriod === "Annual" ? "Anual" : "Mensual"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Inicio</p>
                <p className="text-lg font-semibold text-zinc-200">
                  {new Date(current.startDate).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
            {current.trialEndDate && new Date(current.trialEndDate) > new Date() && (
              <p className="text-sm text-yellow-400 mt-3">
                Período de prueba hasta el {new Date(current.trialEndDate).toLocaleDateString("es-AR")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {(!current || current.status === "Cancelled" || current.status === "Expired") && (
        <>
          <div className="flex gap-2">
            <Button
              variant={billingPeriod === "Monthly" ? "default" : "outline"}
              onClick={() => setBillingPeriod("Monthly")}
              size="sm"
            >
              Mensual
            </Button>
            <Button
              variant={billingPeriod === "Annual" ? "default" : "outline"}
              onClick={() => setBillingPeriod("Annual")}
              size="sm"
            >
              Anual <span className="text-xs text-green-400 ml-1">-17%</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${selectedPlan === plan.id ? "ring-2 ring-purple-500" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-zinc-100">
                      {billingPeriod === "Annual" ? fmtARS(plan.annualPrice) : fmtARS(plan.monthlyPrice)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {billingPeriod === "Annual" ? "/año" : "/mes"}
                      {plan.monthlyPrice > 0 && billingPeriod === "Annual" && (
                        <span className="text-green-400 ml-1">
                          ({(plan.annualPrice / 12).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}/mes)
                        </span>
                      )}
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Hasta {plan.maxStaff} staff
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Hasta {plan.maxServices} servicios
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Hasta {plan.maxCustomers} clientes
                    </li>
                    <li className={`flex items-center gap-2 ${plan.hasCustomDomain ? "text-green-400" : "text-zinc-600"}`}>
                      <span>{plan.hasCustomDomain ? "✓" : "×"}</span> Dominio personalizado
                    </li>
                    <li className={`flex items-center gap-2 ${plan.hasReports ? "text-green-400" : "text-zinc-600"}`}>
                      <span>{plan.hasReports ? "✓" : "×"}</span> Reportes
                    </li>
                    <li className={`flex items-center gap-2 ${plan.hasWhatsAppNotifications ? "text-green-400" : "text-zinc-600"}`}>
                      <span>{plan.hasWhatsAppNotifications ? "✓" : "×"}</span> Notificaciones WhatsApp
                    </li>
                  </ul>

                  {plan.monthlyPrice === 0 ? (
                    <Button className="w-full" variant="outline" disabled>
                      Plan actual
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isCreating}
                    >
                      {isCreating ? "Procesando..." : "Elegir Plan"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
                  <div>
                    <p className="text-sm text-zinc-200">
                      {p.amount.toLocaleString("es-AR", { style: "currency", currency: p.currency })}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(p.paymentDate).toLocaleDateString("es-AR")}
                      {p.paymentMethod && ` — ${p.paymentMethod}`}
                    </p>
                  </div>
                  <span className={`text-sm ${p.status === "Approved" ? "text-green-400" : p.status === "Pending" ? "text-yellow-400" : "text-red-400"}`}>
                    {p.status === "Approved" ? "Aprobado" : p.status === "Pending" ? "Pendiente" : "Rechazado"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
