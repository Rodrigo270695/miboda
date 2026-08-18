import type { ReactNode } from "react";
import { wedding } from "@/config/wedding";
import { Countdown } from "@/components/wedding/Countdown";
import { Divider } from "@/components/wedding/Divider";
import { DokiFamily } from "@/components/wedding/DokiFamily";
import { EventDetails } from "@/components/wedding/EventDetails";
import { FloralFrame } from "@/components/wedding/FloralFrame";
import { Hero } from "@/components/wedding/Hero";
import { Monogram } from "@/components/wedding/Monogram";
import { SectionTitle } from "@/components/wedding/SectionTitle";

function ContentPanel({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-3xl border border-[rgba(212,175,55,0.4)] bg-white/88 px-5 py-7 shadow-[0_18px_45px_rgba(90,33,69,0.12)]">
      {children}
    </div>
  );
}

function FamilyNames({ names }: { names: string[] }) {
  return (
    <div className="grid gap-5">
      {names.map((name) => (
        <p key={name} className="font-serif text-3xl tracking-wide text-[var(--ink)]">
          {name}
        </p>
      ))}
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
              <p className="mt-6 font-script text-4xl text-[var(--fuchsia)]">
                {wedding.celebrant.name}
              </p>
            </ContentPanel>
          </section>

          <section className="px-10 py-16 text-center">
            <ContentPanel>
              <SectionTitle subtitle="Con todo nuestro amor">Mis papás</SectionTitle>
              <FamilyNames
                names={[wedding.parents.father, wedding.parents.mother]}
              />
            </ContentPanel>
          </section>

          <section className="px-10 py-16 text-center">
            <ContentPanel>
              <SectionTitle subtitle="Mis cómplices de aventuras">
                Mis hermanos
              </SectionTitle>
              <FamilyNames
                names={[wedding.siblings.brother, wedding.siblings.sister]}
              />
            </ContentPanel>
          </section>

          <section className="px-10 py-16 text-center">
            <ContentPanel>
              <SectionTitle subtitle="Acompañándome en este día">
                Mis abuelos
              </SectionTitle>
              <div className="grid gap-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--fuchsia)]">
                    Abuelos maternos
                  </p>
                  <div className="mt-4">
                    <FamilyNames
                      names={[
                        wedding.maternalGrandparents.grandfather,
                        wedding.maternalGrandparents.grandmother,
                      ]}
                    />
                  </div>
                </div>
                <div className="rounded-3xl border border-[rgba(212,175,55,0.45)] bg-[rgba(255,245,248,0.95)] px-5 py-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                    Abuelos paternos
                  </p>
                  <div className="mt-4">
                    <FamilyNames
                      names={[
                        wedding.paternalGrandparents.grandfather,
                        wedding.paternalGrandparents.grandmother,
                      ]}
                    />
                  </div>
                </div>
              </div>
            </ContentPanel>
          </section>

          <DokiFamily />

          {wedding.event.isoDate ? (
            <section className="px-10 py-16 text-center">
              <ContentPanel>
                <SectionTitle subtitle="Faltan solo...">Cuenta regresiva</SectionTitle>
                <Countdown targetDate={wedding.event.isoDate} />
              </ContentPanel>
            </section>
          ) : null}

          <EventDetails />

          {children}

          <footer className="px-10 pb-20 pt-10 text-center">
            <ContentPanel>
              <Divider />
              <Monogram size="small" />
              <div className="mt-3 text-base font-semibold uppercase tracking-[0.28em] text-[var(--fuchsia)]">
                22 · 08 · 2026
              </div>
            </ContentPanel>
          </footer>
        </div>
      </div>
    </main>
  );
}
