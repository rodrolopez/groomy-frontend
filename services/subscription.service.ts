import { api } from "@/lib/api";
import type { Plan, Subscription, PaymentTransaction, CreateSubscriptionRequest } from "@/types/subscription";

export const subscriptionService = {
  async getPlans(): Promise<Plan[]> {
    return api.get<Plan[]>("/subscriptions/plans");
  },

  async getCurrent(): Promise<Subscription | null> {
    return api.get<Subscription | null>("/subscriptions/current");
  },

  async create(data: CreateSubscriptionRequest): Promise<Subscription> {
    return api.post<Subscription>("/subscriptions", data);
  },

  async getPaymentHistory(): Promise<PaymentTransaction[]> {
    return api.get<PaymentTransaction[]>("/subscriptions/payments");
  },
};
