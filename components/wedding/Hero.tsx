import { wedding } from "@/config/wedding";
import { Divider } from "@/components/wedding/Divider";
import { Monogram } from "@/components/wedding/Monogram";

export function Hero({ invitedName }: { invitedName?: string }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-10 py-24 text-center">
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[var(--blue-bright)] drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)]">
        {wedding.copy.eyebrow}
      </p>
      <Monogram />
      <h1 className="mt-2 font-serif text-5xl font-medium tracking-[0.08em] text-[var(--ink)]">
        {wedding.couple.groom}
        <span className="my-1 block font-serif text-4xl italic tracking-normal text-[var(--blue-soft)]">
          &
        </span>
        {wedding.couple.bride}
      </h1>
      <Divider />
      <p className="max-w-md text-lg font-semibold uppercase tracking-[0.22em] text-[var(--blue-bright)] drop-shadow-[0_2px_12px_rgba(255,255,255,0.92)]">
        {wedding.event.dateLabel} ·{" "}
        <strong className="text-[var(--blue)]">{wedding.event.timeLabel}</strong>
      </p>
      {invitedName ? (
        <div className="mt-10 max-w-md rounded-3xl border border-white/70 bg-[rgba(235,248,252,0.92)] px-7 py-6 shadow-[0_24px_60px_rgba(20,52,94,0.2)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--blue)]">
            Invitacion especial para
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">
            {invitedName}
          </p>
        </div>
      ) : null}
      <a
        href="#detalles"
        className="absolute bottom-24 z-40 rounded-full border border-white/70 bg-[rgba(235,248,252,0.92)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--blue)] shadow-[0_12px_34px_rgba(20,52,94,0.18)] animate-bob"
      >
        Desliza
      </a>
    </section>
  );
}
