"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
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
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (mode === "login") {
        await login({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });
      } else {
        await register({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          barbershopName: formData.get("barbershopName") as string,
          barbershopPhone: formData.get("barbershopPhone") as string,
          barbershopAddress: formData.get("barbershopAddress") as string,
        });
      }
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error de autenticación";
      const cleaned = message.startsWith("{") ? "Error en la solicitud" : message;
      setError(cleaned);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Groomy
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Inicia sesión en tu barbería"
            : "Registra tu barbería en Groomy"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" name="lastName" required />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="barbershopName">Nombre de la Barbería</Label>
                <Input
                  id="barbershopName"
                  name="barbershopName"
                  placeholder="Ej: BarberStyle"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barbershopPhone">Teléfono</Label>
                <Input
                  id="barbershopPhone"
                  name="barbershopPhone"
                  placeholder="+54 11 1234-5678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barbershopAddress">Dirección</Label>
                <Input
                  id="barbershopAddress"
                  name="barbershopAddress"
                  placeholder="Calle y número"
                  required
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Procesando..."
              : mode === "login"
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
          </Button>

          <p className="text-center text-sm text-zinc-500">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Registra tu barbería
                </Link>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Inicia sesión
                </Link>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
