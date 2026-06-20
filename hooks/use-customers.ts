"use client";

import { useState, useEffect, useCallback } from "react";
import { customerService } from "@/services/customer.service";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "@/types/customer";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customerService.getAll(search);
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar clientes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: CreateCustomerRequest) => {
    await customerService.create(data);
    await fetch();
  };

  const update = async (id: string, data: UpdateCustomerRequest) => {
    await customerService.update(id, data);
    await fetch();
  };

  return { customers, isLoading, error, fetch, create, update };
}

export function useCustomerSearch() {
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (term: string) => {
    if (term.length < 2) { setResults([]); return; }
    setIsSearching(true);
    try {
      const data = await customerService.search(term);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return { results, isSearching, search };
}
