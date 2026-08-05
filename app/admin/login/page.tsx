import { LoginForm } from "@/components/admin/LoginForm";
import { wedding } from "@/config/wedding";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 text-[var(--ink)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(184,168,212,0.35),transparent_34%),radial-gradient(circle_at_90%_0%,rgba(201,178,122,0.22),transparent_28%),linear-gradient(160deg,#e8eef8_0%,#f5f7fb_48%,#dfe8f5_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("/cenicienta.png")',
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "blur(18px) saturate(1.1)",
        }}
      />

      <section className="relative w-full max-w-md rounded-[2rem] border border-[rgba(201,178,122,0.35)] bg-white/88 p-8 shadow-[0_28px_80px_rgba(31,51,88,0.16)] backdrop-blur-xl">
        <div className="flex items-center gap-3 text-[var(--gold)]">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--gold)]" />
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.5l1.6 4.8h5.1l-4.1 3 1.6 4.9L12 12.8 7.8 15.2l1.6-4.9-4.1-3h5.1L12 2.5z"
              fill="currentColor"
            />
          </svg>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--gold)]" />
        </div>

        <p className="mt-5 text-center font-script text-3xl leading-none text-[var(--blue)]">
          Mis 15 años
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl tracking-wide text-[var(--ink)]">
          Panel admin
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-[var(--pale)]">
          Acceso para gestionar invitados de {wedding.celebrant.name}.
        </p>

        {params.error ? (
          <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Credenciales incorrectas. Revisa email y contraseña.
          </p>
        ) : null}

        <LoginForm />
      </section>
    </main>
  );
}
