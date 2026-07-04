import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";
import type { AdminSession } from "@/lib/types";

const ACCESS_COOKIE = "miboda_admin_access_token";
const REFRESH_COOKIE = "miboda_admin_refresh_token";

type SupabasePasswordResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
  };
};

type SupabaseUserResponse = {
  id: string;
  email: string;
};

async function ensureAdminProfile(user: SupabaseUserResponse) {
  const { url, serviceKey } = getSupabaseEnv();

  await fetch(`${url}/rest/v1/profiles?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      id: user.id,
      email: user.email,
      role: "admin",
    }),
    cache: "no-store",
  }).catch(() => {
    // La sesion ya fue validada por Supabase Auth; el perfil se reintenta luego.
  });
}

export async function signInAdmin(email: string, password: string) {
  const { url, publicKey } = getSupabaseEnv();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: publicKey,
      Authorization: `Bearer ${publicKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { ok: false };
  }

  const data = (await response.json()) as SupabasePasswordResponse;
  const cookieStore = await cookies();
  const maxAge = data.expires_in || 60 * 60;

  cookieStore.set(ACCESS_COOKIE, data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  cookieStore.set(REFRESH_COOKIE, data.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { ok: true };
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const { url, publicKey } = getSupabaseEnv();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const userResponse = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: publicKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!userResponse.ok) {
    return null;
  }

  const user = (await userResponse.json()) as SupabaseUserResponse;
  await ensureAdminProfile(user);

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
