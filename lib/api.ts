const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

interface ApiError {
  error: string;
}

class ApiClient {
  private baseUrl: string;
  private attachAuth: boolean;

  constructor(baseUrl: string, attachAuth = true) {
    this.baseUrl = baseUrl;
    this.attachAuth = attachAuth;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("groomy_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.attachAuth) {
      const token = this.getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("groomy_token");
      localStorage.removeItem("groomy_user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Sesión expirada");
    }

    if (!response.ok) {
      const text = await response.text();
      let message = "Error en la solicitud";
      try {
        const error: ApiError = JSON.parse(text);
        if (error.error) message = error.error;
      } catch {
        if (text) message = text;
      }
      throw new Error(message);
    }

    const text = await response.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_BASE);
export const publicApi = new ApiClient(API_BASE, false);
