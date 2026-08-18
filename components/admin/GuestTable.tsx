"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { wedding } from "@/config/wedding";
import type { GuestWithRsvp } from "@/lib/types";

function statusLabel(guest: GuestWithRsvp) {
  if (!guest.rsvp) {
    return "Pendiente";
  }

  return guest.rsvp.will_attend ? "Confirmado" : "No asiste";
}

function statusClassName(guest: GuestWithRsvp) {
  if (!guest.rsvp) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return guest.rsvp.will_attend
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-rose-200";
}

function sendStatusLabel(guest: GuestWithRsvp) {
  return guest.whatsapp_sent_at ? "Enviado" : "Sin enviar";
}

function sendStatusClassName(guest: GuestWithRsvp) {
  return guest.whatsapp_sent_at
    ? "bg-[rgba(240,245,251,0.95)] text-[var(--blue)] ring-[rgba(143,168,212,0.55)]"
    : "bg-[rgba(248,250,252,0.95)] text-[var(--pale)] ring-[rgba(201,178,122,0.35)]";
}

function normalizePhone(phone: string | null) {
  return phone?.replace(/\D/g, "") ?? "";
}

function invitationUrl(baseUrl: string, guest: GuestWithRsvp) {
  return `${baseUrl}/invitacion/${guest.code}`;
}

function whatsappUrl(baseUrl: string, guest: GuestWithRsvp) {
  const phone = normalizePhone(guest.phone);

  if (!phone) {
    return "";
  }

  const url = invitationUrl(baseUrl, guest);
  const message = [
    `Hola ${guest.invited_name}.`,
    "",
    `Con mucho cariño, ${wedding.celebrant.name} ${wedding.copy.whatsappInvite}`,
    "Sera una tarde especial junto a su familia y las personas mas queridas.",
    "",
    "Por favor confirma tu invitacion en el siguiente enlace:",
    url,
    "",
    "Gracias por acompañarnos en este momento tan importante.",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function GuestTable({
  guests,
  baseUrl,
}: {
  guests: GuestWithRsvp[];
  baseUrl: string;
}) {
  const [editingGuest, setEditingGuest] = useState<GuestWithRsvp | null>(null);
  const [sendingGuestId, setSendingGuestId] = useState<string | null>(null);
  const router = useRouter();

  async function handleWhatsappSend(guest: GuestWithRsvp) {
    const url = whatsappUrl(baseUrl, guest);

    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setSendingGuestId(guest.id);

    try {
      const response = await fetch("/admin/guests/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestId: guest.id }),
      });

      if (response.ok) {
        router.refresh();
      }
    } finally {
      setSendingGuestId(null);
    }
  }

  return (
    <div>
      <div className="grid gap-3 md:hidden">
        {guests.map((guest) => (
          <article
            className="rounded-3xl border border-[rgba(201,178,122,0.3)] bg-white/95 p-4 shadow-[0_14px_34px_rgba(31,51,88,0.07)] ring-1 ring-[rgba(143,168,212,0.28)]"
            key={guest.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-serif text-lg tracking-wide text-[var(--ink)]">
                  {guest.invited_name}
                </h3>
                <p className="text-sm text-[var(--pale)]">
                  {guest.group_name || "Sin grupo"}
                </p>
              </div>
              <div className="grid justify-items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClassName(guest)}`}
                >
                  {statusLabel(guest)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${sendStatusClassName(guest)}`}
                >
                  {sendStatusLabel(guest)}
                </span>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[var(--pale)]">Asistentes</dt>
                <dd className="font-medium text-[var(--ink)]">
                  {guest.rsvp?.attendee_count ?? 0} / {guest.max_guests}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--pale)]">Mesa</dt>
                <dd className="font-medium text-[var(--ink)]">
                  {guest.table_name || "Por asignar"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[var(--pale)]">Contacto</dt>
                <dd className="font-medium text-[var(--ink)]">
                  {guest.rsvp?.contact_name || guest.phone || "Sin contacto"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[var(--pale)]">Estado envio</dt>
                <dd className="font-medium text-[var(--ink)]">
                  {guest.whatsapp_sent_at
                    ? `Enviado ${guest.whatsapp_sent_count ?? 1} vez(es)`
                    : "Pendiente de enviar"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <a
                className="block truncate rounded-xl bg-[rgba(240,245,251,0.95)] px-3 py-2 text-center text-sm font-semibold text-[var(--blue)] transition hover:bg-white"
                href={`${baseUrl}/invitacion/${guest.code}`}
                target="_blank"
                rel="noreferrer"
              >
                Enlace
              </a>
              <button
                className="cursor-pointer rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                disabled={!normalizePhone(guest.phone) || sendingGuestId === guest.id}
                onClick={() => handleWhatsappSend(guest)}
                type="button"
              >
                WhatsApp
              </button>
              <button
                className="cursor-pointer rounded-xl bg-[linear-gradient(135deg,#1f3358,#4f6fa8)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                onClick={() => setEditingGuest(guest)}
                type="button"
              >
                Editar
              </button>
            </div>
          </article>
        ))}
        {guests.length === 0 ? (
          <div className="rounded-xl border border-[rgba(143,168,212,0.4)] bg-white p-6 text-center text-sm text-[var(--pale)] shadow-sm">
            Aun no hay invitados. Crea el primero desde el formulario.
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-[rgba(201,178,122,0.28)] bg-white/95 shadow-[0_18px_45px_rgba(31,51,88,0.08)] ring-1 ring-[rgba(143,168,212,0.28)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-[linear-gradient(90deg,#f7f9fc,#eef3fa)] text-[11px] uppercase tracking-[0.12em] text-[var(--pale)]">
            <tr>
              <th className="px-4 py-3">Invitado</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Estado envio</th>
              <th className="px-4 py-3">Asistentes</th>
              <th className="px-4 py-3">Mesa</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Enlace</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(143,168,212,0.18)]">
            {guests.map((guest) => (
              <tr className="transition hover:bg-[rgba(240,245,251,0.65)]" key={guest.id}>
                <td className="px-4 py-4">
                  <p className="font-medium text-[var(--ink)]">{guest.invited_name}</p>
                  <p className="text-[var(--pale)]">{guest.group_name || "Sin grupo"}</p>
                </td>
                <td className="px-4 py-4 text-[var(--pale)]">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClassName(guest)}`}
                  >
                    {statusLabel(guest)}
                  </span>
                </td>
                <td className="px-4 py-4 text-[var(--pale)]">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${sendStatusClassName(guest)}`}
                  >
                    {sendStatusLabel(guest)}
                  </span>
                  <p className="mt-1 text-xs text-[var(--pale)]">
                    {guest.whatsapp_sent_at
                      ? `${guest.whatsapp_sent_count ?? 1} envio(s)`
                      : "Pendiente"}
                  </p>
                </td>
                <td className="px-4 py-4 text-[var(--pale)]">
                  {guest.rsvp?.attendee_count ?? 0} / {guest.max_guests}
                </td>
                <td className="px-4 py-4 text-[var(--pale)]">
                  {guest.table_name || "Por asignar"}
                </td>
                <td className="px-4 py-4 text-[var(--pale)]">
                  <p>{guest.rsvp?.contact_name || guest.phone || "Sin contacto"}</p>
                  <p className="text-[var(--pale)]">
                    {guest.rsvp?.contact_phone || guest.email || ""}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <a
                    className="rounded-full bg-[rgba(240,245,251,0.95)] px-3 py-1.5 text-xs font-semibold text-[var(--blue)] no-underline transition hover:bg-white"
                    href={`${baseUrl}/invitacion/${guest.code}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    /invitacion/{guest.code}
                  </a>
                </td>
                <td className="px-4 py-4">
                  <button
                    className="cursor-pointer rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                    disabled={!normalizePhone(guest.phone) || sendingGuestId === guest.id}
                    onClick={() => handleWhatsappSend(guest)}
                    type="button"
                  >
                    {sendingGuestId === guest.id ? "Abriendo..." : "Enviar"}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <button
                    className="cursor-pointer rounded-full border border-[rgba(143,168,212,0.45)] bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--gold)] hover:text-[var(--blue)]"
                    onClick={() => setEditingGuest(guest)}
                    type="button"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {guests.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-[var(--pale)]" colSpan={9}>
                  <div className="mx-auto max-w-sm rounded-2xl border border-dashed border-[rgba(143,168,212,0.55)] bg-[rgba(240,245,251,0.7)] px-6 py-5">
                    <p className="font-semibold text-[var(--ink)]">Aun no hay invitados</p>
                    <p className="mt-1 text-xs text-[var(--pale)]">
                      Crea el primero desde el boton Nuevo invitado.
                    </p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
          </table>
        </div>
      </div>
      {editingGuest ? (
        <EditGuestModal
          guest={editingGuest}
          onClose={() => setEditingGuest(null)}
        />
      ) : null}
    </div>
  );
}

function EditGuestModal({
  guest,
  onClose,
}: {
  guest: GuestWithRsvp;
  onClose: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-[rgba(31,51,88,0.45)] p-3 backdrop-blur-sm sm:p-6">
      <div className="flex min-h-full items-center justify-center py-6">
        <section className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-[rgba(201,178,122,0.4)] bg-white p-5 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-script text-2xl leading-none text-[var(--fuchsia)]">
                {wedding.admin.badge}
              </p>
              <h2 className="mt-2 font-serif text-2xl tracking-wide text-[var(--ink)]">
                Editar invitado
              </h2>
              <p className="mt-1 text-sm text-[var(--pale)]">
                Actualiza los datos y el enlace personalizado.
              </p>
            </div>
            <button
              className="cursor-pointer rounded-full border border-[rgba(143,168,212,0.45)] px-3 py-1 text-sm text-[var(--pale)] transition hover:border-[var(--gold)] hover:text-[var(--blue)]"
              onClick={onClose}
              type="button"
            >
              Cerrar
            </button>
          </div>

          <form
            action="/admin/guests"
            className="mt-6 grid gap-3 sm:grid-cols-2"
            method="post"
          >
            <input name="guest_id" type="hidden" defaultValue={guest.id} />
            <input
              className="admin-control sm:col-span-2"
              defaultValue={guest.invited_name}
              name="invited_name"
              placeholder="Familia Perez"
              required
            />
            <input
              className="admin-control"
              defaultValue={guest.phone ?? ""}
              name="phone"
              placeholder="Telefono"
            />
            <input
              className="admin-control"
              defaultValue={guest.email ?? ""}
              name="email"
              placeholder="Email"
              type="email"
            />
            <input
              className="admin-control"
              defaultValue={guest.max_guests}
              min="1"
              name="max_guests"
              placeholder="Cupos"
              type="number"
            />
            <input
              className="admin-control"
              defaultValue={guest.code}
              name="code"
              placeholder="codigo"
              required
            />
            <input
              className="admin-control"
              defaultValue={guest.group_name ?? ""}
              name="group_name"
              placeholder="Grupo"
            />
            <input
              className="admin-control"
              defaultValue={guest.table_name ?? ""}
              name="table_name"
              placeholder="Mesa"
            />
            <button className="cursor-pointer rounded-xl bg-[linear-gradient(135deg,#c2185b,#d81b60)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:col-span-2">
              Guardar cambios
            </button>
          </form>
        </section>
      </div>
    </div>,
    document.body,
  );
}
