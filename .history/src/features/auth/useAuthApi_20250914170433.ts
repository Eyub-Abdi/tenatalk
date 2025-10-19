import { useMutation } from "@tanstack/react-query";
import { AuthResponse, LoginPayload, RegisterPayload, User } from "./authTypes";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function postJson<TReq extends object, TRes>(
  url: string,
  payload: TReq
): Promise<TRes> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore JSON parse errors
  }
  if (!res.ok) {
    type ErrShape = { message?: string; detail?: string };
    const possible = data as ErrShape | null;
    const message = possible?.message || possible?.detail || "Request failed";
    throw new Error(message);
  }
  return data as TRes;
}

export function useRegister<
  T extends RegisterPayload | (RegisterPayload & Record<string, unknown>)
>() {
  return useMutation<{ user: User }, Error, T>({
    mutationFn: async (payload: T) => {
      const data = await postJson<RegisterPayload, AuthResponse>(
        `${API_BASE}/accounts/register/`,
        payload as RegisterPayload
      );
      if (!data.success || !data.data) {
        throw new Error(formatErrors(data.errors));
      }
      return { user: data.data.user };
    },
  });
}

export function useLogin() {
  return useMutation<
    { user: User; access: string; refresh: string },
    Error,
    LoginPayload
  >({
    mutationFn: async (payload: LoginPayload) => {
      const data = await postJson<LoginPayload, AuthResponse>(
        `${API_BASE}/accounts/login/`,
        payload
      );
      if (!data.success || !data.data) {
        throw new Error(formatErrors(data.errors));
      }
      const { access, refresh, user } = data.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      return { access, refresh, user };
    },
  });
}

function formatErrors(errs?: Record<string, string[] | string>) {
  if (!errs) return "Unknown error";
  return Object.entries(errs)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("; ");
}
