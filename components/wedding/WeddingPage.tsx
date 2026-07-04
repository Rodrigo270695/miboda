import type { ReactNode } from "react";
import { wedding } from "@/config/wedding";
import { Countdown } from "@/components/wedding/Countdown";
import { Divider } from "@/components/wedding/Divider";
import { EventDetails } from "@/components/wedding/EventDetails";
import { FloralFrame } from "@/components/wedding/FloralFrame";
import { Hero } from "@/components/wedding/Hero";
import { Monogram } from "@/components/wedding/Monogram";
import { SectionTitle } from "@/components/wedding/SectionTitle";

export function WeddingPage({
  invitedName,
  children,
}: {
  invitedName?: string;
  children?: ReactNode;
}) {
  return (
    <main className="wedding-shell bg-[var(--background)] text-[var(--ink)]">
      <div className="relative mx-auto min-h-screen max-w-[640px] overflow-hidden">
        <FloralFrame />
        <div className="wedding-content relative z-10">
          <Hero invitedName={invitedName} />

          <section className="px-10 py-16 text-center">
            <p className="mx-auto max-w-sm px-6 py-7 font-serif text-2xl font-semibold italic leading-relaxed text-[var(--ink)]">
              &quot;{wedding.copy.quote}&quot;
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.18em] text-[var(--blue)]">
              {wedding.couple.groom} & {wedding.couple.bride}
            </p>
          </section>

          <section className="px-10 py-16 text-center">
            <SectionTitle subtitle="Faltan solo...">Cuenta regresiva</SectionTitle>
            <Countdown targetDate={wedding.event.isoDate} />
          </section>

          <EventDetails />

          {children}

          <footer className="px-10 pb-20 pt-10 text-center">
            <Divider />
            <Monogram size="small" />
            <div className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--blue-bright)] drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
              31 · 07 · 2026
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
