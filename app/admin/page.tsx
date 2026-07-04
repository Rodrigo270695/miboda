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
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(125,211,252,0.18),transparent_28%),linear-gradient(180deg,#fbfdff_0%,#f2f7fc_42%,#eaf3fb_100%)] text-slate-950">
      <header className="border-b border-white/80 bg-white/82 shadow-[0_12px_34px_rgba(15,23,42,0.045)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                {wedding.admin.title}
              </span>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                Envio WhatsApp {sendProgress}%
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Invitados y RSVP
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Administra tus invitados, envia enlaces personalizados y revisa las confirmaciones con claridad.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Sesion: <span className="font-medium text-slate-700">{session.user.email}</span>
            </p>
          </div>

          <div className="grid gap-3 lg:justify-items-end">
            <AdminControls />
            <form action={logoutAdmin} className="lg:justify-self-end">
              <button className="w-full cursor-pointer rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-blue-950 sm:w-auto">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:gap-6 lg:py-7">
        {params.import ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
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
          <div className="mb-3 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] ring-1 ring-blue-100/60 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Listado de invitados</h2>
              <p className="mt-1 text-sm text-slate-600">
                Envia cada enlace por WhatsApp y controla quienes ya recibieron la invitacion.
              </p>
            </div>
            <p className="mt-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 sm:mt-0">
              No asisten: {notAttending}
            </p>
          </div>
          <GuestTable guests={guests} baseUrl={baseUrl} />
        </section>
      </div>
    </main>
  );
}
