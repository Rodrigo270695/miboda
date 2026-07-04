import { notFound } from "next/navigation";
import { wedding } from "@/config/wedding";
import { WeddingPage } from "@/components/wedding/WeddingPage";
import { getGuestWithRsvpByCode } from "@/lib/supabase-rest";

export default async function ConfirmedPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const guest = await getGuestWithRsvpByCode(code);

  if (!guest || !guest.rsvp) {
    notFound();
  }

  return (
    <WeddingPage invitedName={guest.invited_name}>
      <section className="px-10 py-16 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-[var(--line)] bg-white/80 p-8 shadow-[0_20px_60px_rgba(30,95,150,0.1)] backdrop-blur">
          <p className="text-sm uppercase tracking-[0.26em] text-[var(--blue)]">
            Confirmacion recibida
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[var(--ink)]">
            Gracias, {guest.invited_name}
          </h2>
          <p className="mt-5 text-lg leading-7 text-[var(--pale)]">
            Tu invitacion quedo confirmada para la boda de{" "}
            {wedding.couple.groom} y {wedding.couple.bride}.
          </p>
        </div>
      </section>
    </WeddingPage>
  );
}
