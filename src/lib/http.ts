import { QueryClient } from "@tanstack/react-query";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    // Basic error shape normalization
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || JSON.stringify(data);
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const queryClient = new QueryClient();
