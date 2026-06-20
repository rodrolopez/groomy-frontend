"use client";

import { useState, useCallback } from "react";
import { subscriptionService } from "@/services/subscription.service";
import type { Plan, Subscription, PaymentTransaction, CreateSubscriptionRequest } from "@/types/subscription";

interface UseSubscriptionReturn {
  plans: Plan[];
  current: Subscription | null;
  payments: PaymentTransaction[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchCurrent: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  create: (data: CreateSubscriptionRequest) => Promise<Subscription>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [current, setCurrent] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subscriptionService.getPlans();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener planes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrent = useCallback(async () => {
    try {
      const data = await subscriptionService.getCurrent();
      setCurrent(data);
    } catch {
      // silent
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const data = await subscriptionService.getPaymentHistory();
      setPayments(data);
    } catch {
      // silent
    }
  }, []);

  const create = useCallback(async (data: CreateSubscriptionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await subscriptionService.create(data);
      setCurrent(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear suscripción";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { plans, current, payments, isLoading, error, fetchPlans, fetchCurrent, fetchPayments, create };
}
