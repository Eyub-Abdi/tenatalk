import { useMutation } from "@tanstack/react-query";
import { AuthResponse, LoginPayload, RegisterPayload, User } from "./authTypes";
import { z } from "zod";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://9f642686a9ac.ngrok-free.app/api";

// Zod validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string().min(1, "Please confirm your password"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    user_type: z.enum(["student", "tutor"], {
      message: "Please select a user type",
    }),
    country: z.string().optional(),
    preferred_language: z.string().optional(),
    phone_number: z.string().optional(),
    terms_accepted: z.boolean().refine((val: boolean) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    (data: { password: string; password_confirm: string }) =>
      data.password === data.password_confirm,
    {
      message: "Passwords don't match",
      path: ["password_confirm"],
    }
  );

export { loginSchema, registerSchema };

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
      // Validate payload with Zod
      const validatedPayload = registerSchema.parse(payload);

      const data = await postJson<RegisterPayload, AuthResponse>(
        `${API_BASE}/accounts/register/`,
        validatedPayload as RegisterPayload
      );
      if (!data.success || !data.data) {
        // Prioritize errors.error field for backend error messages
        const errorMessage =
          formatErrors(data.errors) || data.message || "Registration failed";
        throw new Error(errorMessage);
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
      // Validate payload with Zod
      const validatedPayload = loginSchema.parse(payload);

      // Use fetch directly to handle error responses properly
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedPayload),
      });

      let data: AuthResponse;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      // Debug: log the entire response to see what we're getting
      console.log("Login response:", data);

      if (!data.success || !data.data) {
        // Prioritize errors.error field for backend error messages
        const errorMessage =
          formatErrors(data.errors) || data.message || "Login failed";
        console.log("Final error message:", errorMessage);
        throw new Error(errorMessage);
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
  if (!errs) return null;

  // Debug: log the errors object to see what we're getting
  console.log("formatErrors received:", errs);

  // Handle the specific case where error message is in "error" key
  if (errs.error) {
    const errorMsg = Array.isArray(errs.error)
      ? errs.error.join(", ")
      : String(errs.error);
    console.log("Found error in errors.error:", errorMsg);
    return errorMsg;
  }

  // Handle other error formats
  const formatted = Object.entries(errs)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
    .join("; ");
  console.log("Formatted other errors:", formatted);
  return formatted;
}
