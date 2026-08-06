import type { ReactNode } from "react";
import { wedding } from "@/config/wedding";
import { SectionTitle } from "@/components/wedding/SectionTitle";

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[rgba(201,178,122,0.4)] bg-white/88 px-6 py-7 shadow-[0_18px_45px_rgba(31,51,88,0.12)]">
      <h3 className="font-serif text-3xl tracking-wide text-[var(--ink)]">{title}</h3>
      <div className="mt-3 text-xl leading-8 text-[var(--pale)]">{children}</div>
    </div>
  );
}

export function EventDetails() {
  return (
    <section id="detalles" className="px-10 py-16 text-center">
      <div className="w-full rounded-3xl border border-[rgba(201,178,122,0.4)] bg-white/88 px-5 py-7 shadow-[0_18px_45px_rgba(31,51,88,0.12)]">
        <SectionTitle subtitle="Una noche magica te espera">
          Detalles
        </SectionTitle>
        <div className="grid gap-6">
          <DetailCard title="Fecha y hora">
            <p>{wedding.event.dateLabel}</p>
            <p>{wedding.event.timeLabel}</p>
          </DetailCard>
          <DetailCard title="Lugar">
            <p>{wedding.event.locationName}</p>
            <a
              className="mt-5 inline-flex rounded-full border border-[var(--blue-soft)] px-6 py-2.5 text-sm uppercase tracking-[0.22em] text-[var(--blue)] transition hover:bg-[var(--blue)] hover:text-white"
              href={wedding.event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver ubicacion
            </a>
          </DetailCard>
          <DetailCard title="Codigo de vestimenta">
            <p>{wedding.event.dressCode}</p>
          </DetailCard>
        </div>
      </div>
    </section>
  );
}
