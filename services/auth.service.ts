import { api, publicApi } from "@/lib/api"; // <-- Importá publicApi también
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    // CAMBIO: Usar publicApi para que no intente clavar un Bearer token inexistente
    const response = await publicApi.post<AuthResponse>("/auth/login", data);
    localStorage.setItem("groomy_token", response.token);
    localStorage.setItem("groomy_user", JSON.stringify(response));
    return response;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // CAMBIO: Usar publicApi acá también
    const response = await publicApi.post<AuthResponse>("/auth/register", data);
    localStorage.setItem("groomy_token", response.token);
    localStorage.setItem("groomy_user", JSON.stringify(response));
    return response;
  },

  logout(): void {
    localStorage.removeItem("groomy_token");
    localStorage.removeItem("groomy_user");
  },

  getStoredUser(): AuthResponse | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("groomy_user");
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredUser();
  },
};
