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
    return <div className="mt-8 h-56 rounded-2xl bg-white/40" />;
  }

  return (
    <form action={loginAdmin} className="mt-8 grid gap-5">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-[var(--blue)]">
          Email
        </label>
        <input
          className="field-control"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="admin@miboda.com"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-[var(--blue)]">
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
      <button className="rounded-full bg-[var(--blue)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_34px_rgba(30,95,150,0.18)]">
        Entrar
      </button>
    </form>
  );
}
