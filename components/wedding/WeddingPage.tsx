import type { ReactNode } from "react";
import { wedding } from "@/config/wedding";
import { Countdown } from "@/components/wedding/Countdown";
import { Divider } from "@/components/wedding/Divider";
import { EventDetails } from "@/components/wedding/EventDetails";
import { FloralFrame } from "@/components/wedding/FloralFrame";
import { Hero } from "@/components/wedding/Hero";
import { Monogram } from "@/components/wedding/Monogram";
import { SectionTitle } from "@/components/wedding/SectionTitle";

function ContentPanel({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-3xl border border-[rgba(201,178,122,0.4)] bg-white/88 px-5 py-7 shadow-[0_18px_45px_rgba(31,51,88,0.12)]">
      {children}
    </div>
  );
}

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
            <ContentPanel>
              <p className="mx-auto max-w-sm font-serif text-2xl font-medium italic leading-relaxed tracking-wide text-[var(--ink)]">
                &quot;{wedding.copy.quote}&quot;
              </p>
              <p className="mt-6 font-script text-4xl text-[var(--blue)]">
                {wedding.celebrant.name}
              </p>
            </ContentPanel>
          </section>

          <section className="px-10 py-16 text-center">
            <ContentPanel>
              <SectionTitle subtitle="Con mucho cariño">Mis padres</SectionTitle>
              <div className="grid gap-5">
                <p className="font-serif text-3xl tracking-wide text-[var(--ink)]">
                  {wedding.parents.father}
                </p>
                <p className="font-serif text-3xl tracking-wide text-[var(--ink)]">
                  {wedding.parents.mother}
                </p>
              </div>
            </ContentPanel>
          </section>

          <section className="px-10 py-16 text-center">
            <ContentPanel>
              <SectionTitle subtitle="Acompañándome en este día">
                Padrinos
              </SectionTitle>
              <div className="grid gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--blue)]">
                    Padrino
                  </p>
                  <p className="mt-2 font-serif text-2xl tracking-wide text-[var(--ink)]">
                    {wedding.godparents.godfather}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--blue)]">
                    Madrina
                  </p>
                  <p className="mt-2 font-serif text-2xl tracking-wide text-[var(--ink)]">
                    {wedding.godparents.godmother}
                  </p>
                </div>
                <div className="rounded-3xl border border-[rgba(201,178,122,0.45)] bg-[rgba(240,245,251,0.95)] px-5 py-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                    Madrina de cambio de zapatos
                  </p>
                  <p className="mt-2 font-serif text-2xl tracking-wide text-[var(--ink)]">
                    {wedding.shoeGodmother}
                  </p>
                </div>
              </div>
            </ContentPanel>
          </section>

          <section className="px-10 py-16 text-center">
            <ContentPanel>
              <SectionTitle subtitle="Faltan solo...">Cuenta regresiva</SectionTitle>
              <Countdown targetDate={wedding.event.isoDate} />
            </ContentPanel>
          </section>

          <EventDetails />

          {children}

          <footer className="px-10 pb-20 pt-10 text-center">
            <ContentPanel>
              <Divider />
              <Monogram size="small" />
              <div className="mt-3 text-base font-semibold uppercase tracking-[0.28em] text-[var(--blue)]">
                15 · 08 · 2026
              </div>
            </ContentPanel>
          </footer>
        </div>
      </div>
    </main>
  );
}
