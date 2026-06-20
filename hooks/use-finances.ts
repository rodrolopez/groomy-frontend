"use client";

import { useState, useCallback } from "react";
import { financeService } from "@/services/finance.service";
import type { FinancialSummary, Transaction, PendingCommission } from "@/types/finance";

export function useFinances() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingCommissions, setPendingCommissions] = useState<PendingCommission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (from?: string, to?: string) => {
    setIsLoading(true);
    try {
      const data = await financeService.getSummary(from, to);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (from?: string, to?: string) => {
    try {
      const data = await financeService.getTransactions(from, to);
      setTransactions(data);
    } catch {
      // silent
    }
  }, []);

  const fetchPendingCommissions = useCallback(async () => {
    try {
      const data = await financeService.getPendingCommissions();
      setPendingCommissions(data);
    } catch {
      // silent
    }
  }, []);

  const completeAppointment = useCallback(async (id: string) => {
    await financeService.completeAppointment(id);
    await fetchSummary();
    await fetchTransactions();
  }, [fetchSummary, fetchTransactions]);

  const payCommissions = useCallback(
    async (staffId: string, amount: number, periodStart: string, periodEnd: string) => {
      await financeService.createPayout({ staffId, amount, periodStart, periodEnd });
      await fetchPendingCommissions();
      await fetchSummary();
    },
    [fetchPendingCommissions, fetchSummary]
  );

  return {
    summary, transactions, pendingCommissions,
    isLoading, error,
    fetchSummary, fetchTransactions, fetchPendingCommissions,
    completeAppointment, payCommissions,
  };
}
