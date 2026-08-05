"use client";

import { useEffect, useState } from "react";
import { loginAdmin } from "@/app/admin/actions";

export function LoginForm() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 0);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!mounted) {
    return <div className="mt-8 h-56 rounded-2xl bg-[var(--sky-soft)]" />;
  }

  return (
    <form action={loginAdmin} className="mt-8 grid gap-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--blue)]">
          Email
        </label>
        <input
          className="field-control"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="admin@orvae.pe"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--blue)]">
          Contraseña
        </label>
        <input
          className="field-control"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Tu contraseña"
        />
      </div>
      <button className="cursor-pointer rounded-full bg-[linear-gradient(135deg,#4f6fa8,#6b8fc4)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_34px_rgba(79,111,168,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(79,111,168,0.34)]">
        Entrar
      </button>
    </form>
  );
}
