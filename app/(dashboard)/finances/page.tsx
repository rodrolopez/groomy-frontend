"use client";

import { useEffect, useState } from "react";
import { useFinances } from "@/hooks/use-finances";
import { useStaff } from "@/hooks/use-staff";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/ui/data-table";
import type { Transaction, PendingCommission } from "@/types/finance";

export default function FinancesPage() {
  const {
    summary, transactions, pendingCommissions,
    isLoading, fetchSummary, fetchTransactions, fetchPendingCommissions,
    payCommissions,
  } = useFinances();
  const { staff } = useStaff();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [payDialog, setPayDialog] = useState<PendingCommission | null>(null);
  const [payAmount, setPayAmount] = useState(0);

  useEffect(() => {
    const [y, m] = month.split("-").map(Number);
    const from = new Date(y, m - 1, 1).toISOString();
    const to = new Date(y, m, 0).toISOString();
    fetchSummary(from, to);
    fetchTransactions(from, to);
    fetchPendingCommissions();
  }, [month, fetchSummary, fetchTransactions, fetchPendingCommissions]);

  const handlePay = async () => {
    if (!payDialog || payAmount <= 0) return;
    const [y, m] = month.split("-").map(Number);
    const periodStart = new Date(y, m - 1, 1).toISOString();
    const periodEnd = new Date(y, m, 0).toISOString();
    await payCommissions(payDialog.staffId, payAmount, periodStart, periodEnd);
    setPayDialog(null);
  };

  const fmt = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  const txnColumns: Column<Transaction>[] = [
    { key: "transactionDate", header: "Fecha", render: (t) => new Date(t.transactionDate).toLocaleDateString("es-AR") },
    { key: "staffName", header: "Staff", sortable: true },
    { key: "serviceName", header: "Servicio" },
    { key: "amount", header: "Ingreso", render: (t) => fmt(t.amount) },
    { key: "commissionAmount", header: "Comisión", render: (t) => fmt(t.commissionAmount) },
    { key: "netAmount", header: "Neto", render: (t) => fmt(t.netAmount) },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Finanzas</h1>
          <p className="text-zinc-500 mt-1">Ingresos, comisiones y pagos</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ingreso Total</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">{fmt(summary.totalIncome)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Comisiones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-400">{fmt(summary.totalCommissions)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ganancia Neta</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-400">{fmt(summary.netRevenue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Turnos Completados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-zinc-100">{summary.completedAppointments}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.incomeByService.map((s) => (
                    <div key={s.serviceName} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{s.serviceName}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500">{s.count}x</span>
                        <span className="text-zinc-100 font-medium">{fmt(s.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.incomeByStaff.map((s) => (
                    <div key={s.staffName} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{s.staffName}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500">{s.count}x</span>
                        <span className="text-zinc-100 font-medium">{fmt(s.total)}</span>
                        <span className="text-yellow-500 text-xs">{fmt(s.commission)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {pendingCommissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comisiones Pendientes</CardTitle>
                <CardDescription>Pagos pendientes a staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingCommissions.map((pc) => (
                    <div key={pc.staffId} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{pc.staffName}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500">{fmt(pc.totalCommission)} pendiente</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setPayDialog(pc); setPayAmount(pc.totalCommission); }}
                        >
                          Pagar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable<Transaction>
                columns={txnColumns}
                data={transactions}
                keyExtractor={(t) => t.id}
              />
            </CardContent>
          </Card>
        </>
      ) : null}

      <Dialog open={!!payDialog} onClose={() => setPayDialog(null)} title="Pagar Comisión">
        {payDialog && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Pagando a <span className="text-zinc-200 font-medium">{payDialog.staffName}</span>
            </p>
            <div className="space-y-2">
              <Label>Monto a pagar</Label>
              <Input
                type="number"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <p className="text-xs text-zinc-500">
              Comisión acumulada: {fmt(payDialog.totalCommission)}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setPayDialog(null)}>Cancelar</Button>
              <Button onClick={handlePay} disabled={payAmount <= 0}>
                Confirmar Pago
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
