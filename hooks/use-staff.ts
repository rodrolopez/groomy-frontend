"use client";

import { useState, useEffect, useCallback } from "react";
import { staffService } from "@/services/staff.service";
import type { Staff, CreateStaffRequest, UpdateStaffRequest } from "@/types/staff";

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar staff");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateStaffRequest) => {
    await staffService.create(data);
    await fetch();
  };

  const update = async (id: string, data: UpdateStaffRequest) => {
    await staffService.update(id, data);
    await fetch();
  };

  const remove = async (id: string) => {
    await staffService.delete(id);
    await fetch();
  };

  return { staff, isLoading, error, fetch, create, update, remove };
}
