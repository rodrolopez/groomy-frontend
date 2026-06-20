"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                Groomy
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/barbershop"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Mi Barbería
                </Link>
                <Link
                  href="/staff"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Staff
                </Link>
                <Link
                  href="/services"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Servicios
                </Link>
                <Link
                  href="/appointments"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Turnos
                </Link>
                <Link
                  href="/customers"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Clientes
                </Link>
                <Link
                  href="/finances"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Finanzas
                </Link>
                <Link
                  href="/subscription"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Suscripción
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
