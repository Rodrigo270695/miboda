type SupabaseEnv = {
  url: string;
  publicKey: string;
  serviceKey: string;
};

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !publicKey || !serviceKey) {
    throw new Error(
      "Faltan variables de Supabase. Revisa NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    url: url.replace(/\/$/, ""),
    publicKey,
    serviceKey,
  };
}
