"use client";

import { useEffect, useState, useCallback } from "react";
import { useBarbershop } from "@/hooks/use-barbershop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BusinessHoursEditor } from "@/components/business-hours-editor";

const DEFAULT_COLOR = "#8b5cf6";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm text-zinc-200">{value}</p>
    </div>
  );
}

export default function BarbershopPage() {
  const { barbershop, isLoading, error, fetch, create, update } =
    useBarbershop();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [businessHours, setBusinessHours] = useState(barbershop?.businessHours ?? null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (barbershop) setBusinessHours(barbershop.businessHours);
  }, [barbershop]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);
      const form = new FormData(e.currentTarget);

      const get = (name: string) => (form.get(name) as string) || undefined;

      try {
        const data = {
          name: form.get("name") as string,
          phone: form.get("phone") as string,
          address: form.get("address") as string,
          email: form.get("email") as string,
          description: get("description"),
          logoUrl: get("logoUrl"),
          primaryColor: get("primaryColor") || DEFAULT_COLOR,
          bannerUrl: get("bannerUrl"),
          instagram: get("instagram"),
          facebook: get("facebook"),
          whatsApp: get("whatsApp"),
          businessHours: businessHours ?? undefined,
        };

        if (barbershop) {
          await update(data);
        } else {
          await create(data);
        }
        setIsEditing(false);
      } catch {
      } finally {
        setIsSaving(false);
      }
    },
    [barbershop, create, update, businessHours]
  );

  const publicUrl = barbershop?.slug
    ? `${window.location.protocol}//${barbershop.slug}.groomy.com.ar`
    : null;

  const copyUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const show = !barbershop || isEditing;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Mi Barbería</h1>
          <p className="text-zinc-500 mt-1">
            {barbershop
              ? "Gestiona el perfil y la personalización de tu negocio"
              : "Registra los datos de tu barbería"}
          </p>
        </div>
        {barbershop && !isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Editar
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-4">
          {error}
        </div>
      )}

      {barbershop && publicUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🌐</span> Tu página pública
            </CardTitle>
            <CardDescription>
              Compartí este link para que tus clientes reserven turnos online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input value={publicUrl} readOnly className="font-mono text-sm" />
              <Button onClick={copyUrl} variant="outline" size="sm" className="shrink-0">
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {barbershop ? barbershop.name : "Nueva Barbería"}
          </CardTitle>
          <CardDescription>
            {barbershop
              ? "Datos actuales de tu negocio"
              : "Completa el formulario para registrar tu barbería"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name" name="name"
                  defaultValue={barbershop?.name ?? ""}
                  required
                  disabled={!isEditing && !!barbershop}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" name="email" type="email"
                  defaultValue={barbershop?.email ?? ""}
                  required
                  disabled={!isEditing && !!barbershop}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone" name="phone"
                  defaultValue={barbershop?.phone ?? ""}
                  required
                  disabled={!isEditing && !!barbershop}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address" name="address"
                  defaultValue={barbershop?.address ?? ""}
                  required
                  disabled={!isEditing && !!barbershop}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo (URL)</Label>
                <Input
                  id="logoUrl" name="logoUrl"
                  defaultValue={barbershop?.logoUrl ?? ""}
                  disabled={!isEditing && !!barbershop}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description" name="description" rows={3}
                defaultValue={barbershop?.description ?? ""}
                disabled={!isEditing && !!barbershop}
                className="flex w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 resize-none"
              />
            </div>

            {show ? (
              <>
                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4">Personalización</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Color principal</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor" name="primaryColor" type="color"
                          defaultValue={barbershop?.primaryColor ?? DEFAULT_COLOR}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          name="primaryColor"
                          defaultValue={barbershop?.primaryColor ?? DEFAULT_COLOR}
                          className="flex-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bannerUrl">Banner (URL)</Label>
                      <Input
                        id="bannerUrl" name="bannerUrl"
                        defaultValue={barbershop?.bannerUrl ?? ""}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4">Redes Sociales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram" name="instagram"
                        defaultValue={barbershop?.instagram ?? ""}
                        placeholder="@usuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook" name="facebook"
                        defaultValue={barbershop?.facebook ?? ""}
                        placeholder="página o usuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsApp">WhatsApp</Label>
                      <Input
                        id="whatsApp" name="whatsApp"
                        defaultValue={barbershop?.whatsApp ?? ""}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4">Horarios</h3>
                  <BusinessHoursEditor
                    value={businessHours}
                    onChange={setBusinessHours}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4">Personalización</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Color principal" value={barbershop?.primaryColor} />
                    <Field label="Banner URL" value={barbershop?.bannerUrl} />
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4">Redes Sociales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Instagram" value={barbershop?.instagram} />
                    <Field label="Facebook" value={barbershop?.facebook} />
                    <Field label="WhatsApp" value={barbershop?.whatsApp} />
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4">Horarios</h3>
                  {barbershop?.businessHours ? (
                    <div className="space-y-1">
                      {(JSON.parse(barbershop.businessHours) as { day: string; enabled: boolean; open: string; close: string; open2?: string; close2?: string }[])
                        .filter((d) => d.enabled)
                        .map((d) => (
                          <div key={d.day} className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-300 min-w-[80px]">{d.day}</span>
                            <span className="text-zinc-400">{d.open} – {d.close}</span>
                            {d.open2 && (
                              <span className="text-zinc-500">y {d.open2} – {d.close2}</span>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">Sin horarios configurados</p>
                  )}
                </div>
              </>
            )}

            {(!barbershop || isEditing) && (
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving
                    ? "Guardando..."
                    : barbershop
                    ? "Guardar Cambios"
                    : "Crear Barbería"}
                </Button>
                {isEditing && (
                  <Button
                    type="button" variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
