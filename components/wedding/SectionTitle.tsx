import type { ReactNode } from "react";

export function SectionTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-8 text-center">
      <h2 className="font-serif text-4xl font-medium uppercase tracking-[0.16em] text-[var(--ink)]">
        {children}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-lg tracking-wide text-[var(--blue)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
