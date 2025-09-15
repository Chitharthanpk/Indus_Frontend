// src/api/auth.ts
import apiClient from "./apiClient";

export type LoginResult = {
  access?: string;
  refresh?: string;
  user?: any;
};

async function trySimpleJwt(email: string, password: string) {
  return apiClient.post<{ access: string; refresh?: string }>(" /api/token/".trim(), {
    email,
    password,
  });
}

async function tryCustomLogin(email: string, password: string) {
  // fallback to possible custom login path used by your Django views
  return apiClient.post<LoginResult>("/auth/api/auth/login/", { email, password });
}

/**
 * Login wrapper:
 *  - try SimpleJWT /api/token/ first
 *  - if fails, try custom auth endpoint
 * On success it stores token in localStorage under "token" and user under "user"
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  email = email.trim().toLowerCase();
  let payload: LoginResult | null = null;

  // try SimpleJWT token endpoint first (most common)
  try {
    const res = await trySimpleJwt(email, password);
    payload = { access: res.data.access, refresh: res.data.refresh, user: { email } };
  } catch (errSimple) {
    // fallback to custom
    try {
      const res = await tryCustomLogin(email, password);
      payload = res.data;
      // some custom endpoints might wrap tokens differently
      if (!payload.access && (res as any).data && (res as any).data.access) {
        payload.access = (res as any).data.access;
      }
    } catch (errCustom) {
      // throw the original SimpleJWT error if provided, else custom error
      throw errSimple ?? errCustom;
    }
  }

  if (!payload) throw new Error("Empty login response");

  if (payload.access) localStorage.setItem("token", payload.access);
  if (payload.user) localStorage.setItem("user", JSON.stringify(payload.user));
  else localStorage.setItem("user", JSON.stringify({ email }));

  return payload;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("enrollments");
}
