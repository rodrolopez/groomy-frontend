"use client";

import { useState } from "react";
import { useStaff } from "@/hooks/use-staff";
import { useServices } from "@/hooks/use-services";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Staff } from "@/types/staff";

const STAFF_ROLES = ["Barber", "Stylist", "NailTech", "Makeup", "Massage"];

export default function StaffPage() {
  const { staff, isLoading, create, update, remove } = useStaff();
  const { services } = useServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const columns: Column<Staff>[] = [
    {
      key: "firstName",
      header: "Nombre",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2">
          {s.color && (
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: s.color }}
            />
          )}
          <span>
            {s.firstName} {s.lastName}
          </span>
        </div>
      ),
    },
    { key: "email", header: "Email", sortable: true },
    { key: "phone", header: "Teléfono" },
    {
      key: "role",
      header: "Rol",
      render: (s) => (
        <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-300">
          {s.role}
        </span>
      ),
    },
    {
      key: "commission",
      header: "Comisión",
      render: (s) => `${s.commission}%`,
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

    const selectedServices = services
      .filter((s) => f.get(`service_${s.id}`) === "on")
      .map((s) => s.id);

    const data = {
      firstName: f.get("firstName") as string,
      lastName: f.get("lastName") as string,
      email: f.get("email") as string,
      phone: f.get("phone") as string,
      role: f.get("role") as string,
      commission: parseFloat(f.get("commission") as string) || 0,
      color: (f.get("color") as string) || undefined,
      serviceIds: selectedServices,
    };

    try {
      if (editing) {
        await update(editing.id, { ...data, isActive: editing.isActive });
      } else {
        await create(data);
      }
      setDialogOpen(false);
      setEditing(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: Staff) => {
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
          <h1 className="text-3xl font-bold text-zinc-100">Staff</h1>
          <p className="text-zinc-500 mt-1">
            Gestiona los miembros de tu equipo
          </p>
        </div>
        <Button onClick={openCreate}>+ Agregar Staff</Button>
      </div>

      <DataTable<Staff>
        columns={columns}
        data={staff}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(s) => setDeleteTarget(s)}
        keyExtractor={(s) => s.id}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        title={editing ? "Editar Staff" : "Nuevo Staff"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={editing?.firstName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={editing?.lastName}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={editing?.email}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={editing?.phone}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                name="role"
                defaultValue={editing?.role ?? "Barber"}
                className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Comisión (%)</Label>
              <Input
                id="commission"
                name="commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue={editing?.commission ?? 0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color (para calendario)</Label>
            <Input
              id="color"
              name="color"
              type="color"
              defaultValue={editing?.color ?? "#8b5cf6"}
              className="h-10 p-1"
            />
          </div>

          <div className="space-y-2">
            <Label>Servicios que ofrece</Label>
            {services.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Crea servicios primero para asignarlos al staff
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {services.map((svc) => (
                  <label
                    key={svc.id}
                    className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={`service_${svc.id}`}
                      defaultChecked={editing?.serviceIds.includes(svc.id)}
                      className="rounded border-zinc-700 bg-zinc-900 accent-purple-500"
                    />
                    {svc.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setDialogOpen(false); setEditing(null); }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : editing ? "Guardar Cambios" : "Crear Staff"}
            </Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Staff"
        message={`¿Eliminar a ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
      />
    </div>
  );
}
