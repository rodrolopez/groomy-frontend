"use client";

import { useState } from "react";
import { useServices } from "@/hooks/use-services";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Service } from "@/types/service";

export default function ServicesPage() {
  const { services, isLoading, create, update, remove } = useServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const columns: Column<Service>[] = [
    { key: "name", header: "Nombre", sortable: true },
    {
      key: "description",
      header: "Descripción",
      render: (s) => s.description ?? "—",
    },
    {
      key: "price",
      header: "Precio",
      sortable: true,
      render: (s) =>
        s.price.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
    },
    {
      key: "durationMinutes",
      header: "Duración",
      render: (s) => `${s.durationMinutes} min`,
    },
    {
      key: "isActive",
      header: "Estado",
      render: (s) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            s.isActive
              ? "bg-green-900/50 text-green-400"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          {s.isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const f = new FormData(e.currentTarget);

    const data = {
      name: f.get("name") as string,
      description: (f.get("description") as string) || undefined,
      price: parseFloat(f.get("price") as string) || 0,
      durationMinutes: parseInt(f.get("durationMinutes") as string) || 30,
    };

    try {
      if (editing) {
        await update(editing.id, {
          ...data,
          isActive: (f.get("isActive") as string) === "on",
        });
      } else {
        await create(data);
      }
      setDialogOpen(false);
      setEditing(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: Service) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Servicios</h1>
          <p className="text-zinc-500 mt-1">
            Define los servicios que ofrece tu negocio
          </p>
        </div>
        <Button onClick={openCreate}>+ Nuevo Servicio</Button>
      </div>

      <DataTable<Service>
        columns={columns}
        data={services}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(s) => setDeleteTarget(s)}
        keyExtractor={(s) => s.id}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        title={editing ? "Editar Servicio" : "Nuevo Servicio"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              defaultValue={editing?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              className="flex w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={editing?.price}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duración (minutos)</Label>
              <Input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                min="5"
                step="5"
                defaultValue={editing?.durationMinutes ?? 30}
                required
              />
            </div>
          </div>

          {editing && (
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={editing.isActive}
                className="rounded border-zinc-700 bg-zinc-900 accent-purple-500"
              />
              Servicio activo
            </label>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setDialogOpen(false); setEditing(null); }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : editing ? "Guardar Cambios" : "Crear Servicio"}
            </Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Servicio"
        message={`¿Eliminar "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
