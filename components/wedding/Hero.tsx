import { wedding } from "@/config/wedding";
import { Divider } from "@/components/wedding/Divider";
import { Monogram } from "@/components/wedding/Monogram";

export function Hero({ invitedName }: { invitedName?: string }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-10 py-24 text-center">
      <div className="mb-5 inline-flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 text-[var(--gold)]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]" />
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.5l1.6 4.8h5.1l-4.1 3 1.6 4.9L12 12.8 7.8 15.2l1.6-4.9-4.1-3h5.1L12 2.5z"
              fill="currentColor"
            />
          </svg>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]" />
        </div>
        <p className="rounded-full border border-[rgba(201,178,122,0.65)] bg-[rgba(31,51,88,0.78)] px-6 py-2.5 font-script text-3xl leading-none text-white shadow-[0_10px_28px_rgba(31,51,88,0.35)] sm:text-4xl">
          {wedding.copy.eyebrow}
        </p>
        <div className="flex items-center gap-3 text-[var(--gold)]">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]" />
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.5l1.6 4.8h5.1l-4.1 3 1.6 4.9L12 12.8 7.8 15.2l1.6-4.9-4.1-3h5.1L12 2.5z"
              fill="currentColor"
            />
          </svg>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]" />
        </div>
      </div>
      <Monogram />
      <h1 className="mt-1 font-script text-6xl leading-none text-[var(--ink)] drop-shadow-[0_4px_18px_rgba(255,255,255,0.85)] sm:text-7xl">
        {wedding.celebrant.name}
      </h1>
      <Divider />
      <p className="max-w-md text-lg font-semibold uppercase tracking-[0.22em] text-[var(--blue-bright)] drop-shadow-[0_2px_12px_rgba(255,255,255,0.92)]">
        {wedding.event.dateLabel} ·{" "}
        <strong className="text-[var(--blue)]">{wedding.event.timeLabel}</strong>
      </p>
      {invitedName ? (
        <div className="mt-10 max-w-md rounded-3xl border border-[rgba(201,178,122,0.45)] bg-[rgba(240,245,251,0.9)] px-7 py-6 shadow-[0_24px_60px_rgba(31,51,88,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--blue)]">
            Invitacion especial para
          </p>
          <p className="mt-2 font-serif text-2xl font-semibold tracking-wide text-[var(--ink)]">
            {invitedName}
          </p>
        </div>
      ) : null}
      <a
        href="#detalles"
        className="absolute bottom-24 z-40 rounded-full border border-[rgba(201,178,122,0.5)] bg-[rgba(240,245,251,0.92)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--blue)] shadow-[0_12px_34px_rgba(31,51,88,0.16)] animate-bob"
      >
        Desliza
      </a>
    </section>
  );
}
