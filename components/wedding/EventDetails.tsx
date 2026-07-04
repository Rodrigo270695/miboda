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
    <div className="rounded-3xl border border-[var(--line)] bg-white/75 px-6 py-7 shadow-[0_18px_50px_rgba(30,95,150,0.08)] backdrop-blur">
      <h3 className="font-serif text-2xl tracking-wide text-[var(--ink)]">{title}</h3>
      <div className="mt-3 text-lg leading-7 text-[var(--pale)]">{children}</div>
    </div>
  );
}

export function EventDetails() {
  return (
    <section id="detalles" className="px-10 py-16 text-center">
      <SectionTitle subtitle="Los esperamos para celebrar juntos">
        Detalles
      </SectionTitle>
      <div className="grid gap-6">
        <DetailCard title="Fecha y hora">
          <p>{wedding.event.dateLabel}</p>
          <p>{wedding.event.timeLabel}</p>
        </DetailCard>
        <DetailCard title="Lugar">
          <p>{wedding.event.locationName}</p>
          <p>{wedding.event.address}</p>
          <a
            className="mt-5 inline-flex rounded-full border border-[var(--blue-soft)] px-6 py-2 text-xs uppercase tracking-[0.22em] text-[var(--blue)] transition hover:bg-[var(--blue)] hover:text-white"
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
    </section>
  );
}
