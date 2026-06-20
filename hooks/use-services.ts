"use client";

import { useState, useEffect, useCallback } from "react";
import { serviceService } from "@/services/service.service";
import type { Service, CreateServiceRequest, UpdateServiceRequest } from "@/types/service";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar servicios");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateServiceRequest) => {
    await serviceService.create(data);
    await fetch();
  };

  const update = async (id: string, data: UpdateServiceRequest) => {
    await serviceService.update(id, data);
    await fetch();
  };

  const remove = async (id: string) => {
    await serviceService.delete(id);
    await fetch();
  };

  return { services, isLoading, error, fetch, create, update, remove };
}
