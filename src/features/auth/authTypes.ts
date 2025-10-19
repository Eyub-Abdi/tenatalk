export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: "student" | "tutor" | string;
  profile_completed?: boolean;
  preferred_language?: string;
  phone_number?: string;
  verified?: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    access: string;
    refresh: string;
    user: User;
  } | null;
  errors?: Record<string, string | string[]>;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  user_type: string; // 'student' | 'tutor'
  country?: string; // optional country code or name captured during details step
  preferred_language?: string;
  phone_number?: string;
  terms_accepted: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authKeys = {
  root: ["auth"] as const,
  me: () => [...authKeys.root, "me"] as const,
};
