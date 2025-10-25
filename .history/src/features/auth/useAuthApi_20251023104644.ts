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

// Teaching profile interface
interface TeachingProfilePayload {
  teaching_languages: string[];
  video_introduction: File | null;
  about_me: string;
  me_as_teacher: string;
  lessons_teaching_style: string;
  teaching_materials: string;
  has_webcam: boolean;
  video_requirements_agreed: boolean;
  education_experience: string;
  teaching_certificates: string[];
  teaching_experience: string;
  industry_experience: string;
  specialty_certificates: string[];
  profile_visibility: "public" | "private";
  teaching_interests: string[];
}

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

// Hook for submitting teaching profile (step 3)
export function useSubmitTeachingProfile() {
  return useMutation<
    { success: boolean; message: string },
    Error,
    TeachingProfilePayload
  >({
    mutationFn: async (teachingData: TeachingProfilePayload) => {
      // For now, simulate API call - replace with actual endpoint
      // TODO: Create FormData for file uploads
      const formData = new FormData();

      // Add non-file fields
      (Object.keys(teachingData) as (keyof TeachingProfilePayload)[]).forEach(
        (key) => {
          if (
            key !== "video_introduction" &&
            teachingData[key] !== null &&
            teachingData[key] !== undefined
          ) {
            const value = teachingData[key];
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        }
      );

      // Add video file if present
      if (teachingData.video_introduction) {
        formData.append("video_introduction", teachingData.video_introduction);
      }

      // TODO: Replace with actual API endpoint
      // const res = await fetch(`${API_BASE}/auth/teaching-profile/`, {
      //   method: "POST",
      //   body: formData,
      // });

      // Simulate success for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Teaching profile submitted successfully",
          });
        }, 1000);
      });
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
