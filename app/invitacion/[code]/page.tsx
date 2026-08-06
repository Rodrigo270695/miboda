import { notFound } from "next/navigation";
import { wedding } from "@/config/wedding";
import { SectionTitle } from "@/components/wedding/SectionTitle";
import { WeddingPage } from "@/components/wedding/WeddingPage";
import { getGuestWithRsvpByCode } from "@/lib/supabase-rest";
import { confirmInvitation } from "@/app/invitacion/[code]/actions";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const guest = await getGuestWithRsvpByCode(code);

  if (!guest) {
    notFound();
  }

  return (
    <WeddingPage invitedName={guest.invited_name}>
      <section id="rsvp" className="px-10 py-16 text-center">
        <div className="w-full rounded-3xl border border-[rgba(201,178,122,0.4)] bg-white/88 px-5 py-7 shadow-[0_18px_45px_rgba(31,51,88,0.12)]">
          <SectionTitle subtitle={`Confirma antes del ${wedding.event.rsvpDeadline}`}>
            Confirmar invitacion
          </SectionTitle>
          <p className="mx-auto mb-8 max-w-md text-xl leading-8 text-[var(--pale)]">
            {wedding.copy.confirmationNote}
          </p>
          {guest.rsvp ? (
            <div className="mx-auto mt-8 max-w-md rounded-3xl border border-[var(--line)] bg-[rgba(240,245,251,0.95)] p-5 text-center">
              <p className="text-lg text-[var(--blue)]">
                Ya tenemos una confirmacion registrada para esta invitacion.
              </p>
            </div>
          ) : (
            <form action={confirmInvitation} className="mx-auto max-w-md">
              <input type="hidden" name="code" value={guest.code} />
              <button className="rounded-full bg-[var(--blue)] px-8 py-4 text-base font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_34px_rgba(30,95,150,0.22)] transition hover:bg-[var(--ink)]">
                Confirmar invitacion
              </button>
            </form>
          )}
        </div>
      </section>
    </WeddingPage>
  );
}
