"use client";

import { useState, useCallback } from "react";
import { barbershopService } from "@/services/barbershop.service";
import type {
  Barbershop,
  CreateBarbershopRequest,
  UpdateBarbershopRequest,
} from "@/types/barbershop";

interface UseBarbershopReturn {
  barbershop: Barbershop | null;
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  create: (data: CreateBarbershopRequest) => Promise<void>;
  update: (data: UpdateBarbershopRequest) => Promise<void>;
}

export function useBarbershop(): UseBarbershopReturn {
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await barbershopService.get();
      setBarbershop(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener la barbería");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateBarbershopRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await barbershopService.create(data);
      setBarbershop(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la barbería");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(async (data: UpdateBarbershopRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await barbershopService.update(data);
      setBarbershop(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la barbería");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { barbershop, isLoading, error, fetch, create, update };
}
