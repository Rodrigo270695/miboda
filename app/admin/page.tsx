import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { AdminControls } from "@/components/admin/AdminControls";
import { GuestTable } from "@/components/admin/GuestTable";
import { StatCard } from "@/components/admin/Stats";
import { wedding } from "@/config/wedding";
import { getAdminSession } from "@/lib/admin-auth";
import { listGuests } from "@/lib/supabase-rest";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ import?: string }>;
}) {
  const session = await getAdminSession();
  const params = await searchParams;

  if (!session) {
    redirect("/admin/login");
  }

  const guests = await listGuests();
  const confirmed = guests.filter((guest) => guest.rsvp?.will_attend).length;
  const notAttending = guests.filter((guest) => guest.rsvp?.will_attend === false).length;
  const pending = guests.length - confirmed - notAttending;
  const attendeeTotal = guests.reduce(
    (total, guest) => total + (guest.rsvp?.attendee_count ?? 0),
    0,
  );
  const whatsappSent = guests.filter((guest) => guest.whatsapp_sent_at).length;
  const whatsappPending = Math.max(guests.length - whatsappSent, 0);
  const sendProgress =
    guests.length > 0 ? Math.round((whatsappSent / guests.length) * 100) : 0;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_8%_0%,rgba(244,143,177,0.22),transparent_30%),radial-gradient(circle_at_92%_8%,rgba(212,175,55,0.16),transparent_26%),linear-gradient(180deg,#fffafc_0%,#fff5f8_46%,#fce4ec_100%)] text-[var(--ink)]">
      <header className="border-b border-[rgba(201,178,122,0.25)] bg-white/80 shadow-[0_12px_34px_rgba(31,51,88,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-[rgba(201,178,122,0.4)] bg-[rgba(240,245,251,0.9)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]">
                {wedding.admin.title}
              </span>
              <span className="inline-flex rounded-full bg-white px-3 py-1 font-script text-lg leading-none text-[var(--blue)] ring-1 ring-[rgba(143,168,212,0.45)]">
                {wedding.admin.badge}
              </span>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--pale)] ring-1 ring-[rgba(143,168,212,0.35)]">
                Envio WhatsApp {sendProgress}%
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl tracking-wide text-[var(--ink)] sm:text-4xl">
              Invitados y RSVP
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--pale)]">
              Gestiona invitados de {wedding.celebrant.name}, envia enlaces por WhatsApp y revisa confirmaciones.
            </p>
            <p className="mt-2 text-xs text-[var(--pale)]">
              Sesion: <span className="font-medium text-[var(--ink)]">{session.user.email}</span>
            </p>
          </div>

          <div className="grid gap-3 lg:justify-items-end">
            <AdminControls />
            <form action={logoutAdmin} className="lg:justify-self-end">
              <button className="w-full cursor-pointer rounded-2xl bg-[linear-gradient(135deg,#c2185b,#d81b60)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(216,27,96,0.18)] transition hover:-translate-y-0.5 sm:w-auto">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:gap-6 lg:py-7">
        {params.import ? (
          <div className="rounded-2xl border border-[rgba(143,168,212,0.45)] bg-[rgba(240,245,251,0.95)] px-4 py-3 text-sm text-[var(--ink)]">
            {params.import === "empty"
              ? "No se selecciono una plantilla valida."
              : `Plantilla importada. Invitados procesados: ${params.import}.`}
          </div>
        ) : null}

        <section className="grid grid-cols-2 gap-3 sm:gap-3 lg:grid-cols-5">
          <StatCard detail="Invitaciones creadas" label="Total invitados" value={guests.length} />
          <StatCard detail="Ya aceptaron" label="Confirmados" tone="green" value={confirmed} />
          <StatCard detail="Faltan por responder" label="Pendientes" tone="amber" value={pending} />
          <StatCard detail="Cupos confirmados" label="Asistentes reales" tone="blue" value={attendeeTotal} />
          <StatCard
            detail={`Faltan por enviar: ${whatsappPending}`}
            label="Enviados WhatsApp"
            tone="slate"
            value={`${whatsappSent}/${guests.length}`}
          />
        </section>

        <section>
          <div className="mb-3 rounded-3xl border border-[rgba(201,178,122,0.28)] bg-white/90 p-4 shadow-[0_14px_36px_rgba(31,51,88,0.06)] ring-1 ring-[rgba(143,168,212,0.28)] sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl tracking-wide text-[var(--ink)]">
                Listado de invitados
              </h2>
              <p className="mt-1 text-sm text-[var(--pale)]">
                Envia cada enlace por WhatsApp y controla quienes ya recibieron la invitacion.
              </p>
            </div>
            <p className="mt-3 rounded-full border border-[rgba(143,168,212,0.35)] bg-[rgba(240,245,251,0.9)] px-3 py-1 text-sm font-medium text-[var(--pale)] sm:mt-0">
              No asisten: {notAttending}
            </p>
          </div>
          <GuestTable guests={guests} baseUrl={baseUrl} />
        </section>
      </div>
    </main>
  );
}
