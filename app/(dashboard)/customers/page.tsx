"use client";

import { useState, useCallback, useRef } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/types/customer";

export default function CustomersPage() {
  const { customers, isLoading, fetch, create, update } = useCustomers();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => fetch(value || undefined), 300);
    },
    [fetch]
  );

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Nombre",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          {c.isVip && <span className="text-yellow-500">⭐</span>}
          <span>{c.name}</span>
        </div>
      ),
    },
    { key: "phone", header: "Teléfono", sortable: true },
    { key: "email", header: "Email", render: (c) => c.email ?? "—" },
    { key: "totalVisits", header: "Visitas", sortable: true },
    {
      key: "totalSpent",
      header: "Gastado",
      sortable: true,
      render: (c) =>
        `$${c.totalSpent.toLocaleString("es-AR")}`,
    },
    {
      key: "isVip",
      header: "VIP",
      render: (c) =>
        c.isVip ? (
          <span className="text-yellow-500 text-xs bg-yellow-500/10 px-2 py-0.5 rounded-full">
            VIP
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "createdAt",
      header: "Cliente desde",
      render: (c) =>
        new Date(c.createdAt).toLocaleDateString("es-AR"),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const f = new FormData(e.currentTarget);
    const data = {
      name: f.get("name") as string,
      phone: f.get("phone") as string,
      email: (f.get("email") as string) || undefined,
      notes: (f.get("notes") as string) || undefined,
      isVip: f.get("isVip") === "on",
    };
    try {
      if (editing) await update(editing.id, data);
      else await create(data);
      setDialogOpen(false);
      setEditing(null);
    } finally {
      setIsSaving(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item: Customer) => {
    setEditing(item);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Clientes</h1>
          <p className="text-zinc-500 mt-1">CRM — Historial y gestión de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={openCreate}>+ Nuevo Cliente</Button>
        </div>
      </div>

      <DataTable<Customer>
        columns={columns}
        data={customers}
        isLoading={isLoading}
        onEdit={openEdit}
        keyExtractor={(c) => c.id}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        title={editing ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={editing?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" defaultValue={editing?.phone} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={editing?.email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={editing?.notes ?? ""}
              className="flex w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              name="isVip"
              defaultChecked={editing?.isVip}
              className="rounded border-zinc-700 bg-zinc-900 accent-purple-500"
            />
            Cliente VIP
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setDialogOpen(false); setEditing(null); }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : editing ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
