import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--sky-soft)] px-6 py-12 text-[var(--ink)]">
      <section className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-white/85 p-8 shadow-[0_24px_80px_rgba(30,95,150,0.14)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--blue)]">
          Mi boda
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--ink)]">Admin</h1>
        <p className="mt-2 text-[var(--pale)]">
          Ingresa con el usuario creado en Supabase Auth.
        </p>
        {params.error ? (
          <p className="mt-5 rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700">
            Credenciales incorrectas. Revisa email y contraseña.
          </p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
