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
    ? "bg-blue-50 text-blue-700 ring-blue-200"
    : "bg-slate-100 text-slate-600 ring-slate-200";
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
    `Con mucho carino, ${wedding.couple.groom} y ${wedding.couple.bride} queremos invitarte a compartir nuestra boda.`,
    "Sera una celebracion intima, preparada para las personas mas cercanas y especiales en nuestra historia.",
    "",
    "Por favor confirma tu invitacion en el siguiente enlace:",
    url,
    "",
    "Gracias por acompanarnos en este momento tan importante.",
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
            className="rounded-3xl border border-white/80 bg-white/95 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.07)] ring-1 ring-blue-100/60"
            key={guest.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-950">
                  {guest.invited_name}
                </h3>
                <p className="text-sm text-slate-500">
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
                <dt className="text-slate-500">Asistentes</dt>
                <dd className="font-medium text-slate-950">
                  {guest.rsvp?.attendee_count ?? 0} / {guest.max_guests}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Mesa</dt>
                <dd className="font-medium text-slate-950">
                  {guest.table_name || "Por asignar"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-500">Contacto</dt>
                <dd className="font-medium text-slate-950">
                  {guest.rsvp?.contact_name || guest.phone || "Sin contacto"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-500">Estado envio</dt>
                <dd className="font-medium text-slate-950">
                  {guest.whatsapp_sent_at
                    ? `Enviado ${guest.whatsapp_sent_count ?? 1} vez(es)`
                    : "Pendiente de enviar"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <a
                className="block truncate rounded-xl bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
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
                className="cursor-pointer rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-950"
                onClick={() => setEditingGuest(guest)}
                type="button"
              >
                Editar
              </button>
            </div>
          </article>
        ))}
        {guests.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            Aun no hay invitados. Crea el primero desde el formulario.
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-blue-100/60 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-[linear-gradient(90deg,#f8fbff,#eff6ff)] text-[11px] uppercase tracking-[0.12em] text-slate-500">
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
          <tbody className="divide-y divide-slate-100">
            {guests.map((guest) => (
              <tr className="transition hover:bg-blue-50/50" key={guest.id}>
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-950">{guest.invited_name}</p>
                  <p className="text-slate-500">{guest.group_name || "Sin grupo"}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClassName(guest)}`}
                  >
                    {statusLabel(guest)}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${sendStatusClassName(guest)}`}
                  >
                    {sendStatusLabel(guest)}
                  </span>
                  <p className="mt-1 text-xs text-slate-500">
                    {guest.whatsapp_sent_at
                      ? `${guest.whatsapp_sent_count ?? 1} envio(s)`
                      : "Pendiente"}
                  </p>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {guest.rsvp?.attendee_count ?? 0} / {guest.max_guests}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {guest.table_name || "Por asignar"}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  <p>{guest.rsvp?.contact_name || guest.phone || "Sin contacto"}</p>
                  <p className="text-slate-500">
                    {guest.rsvp?.contact_phone || guest.email || ""}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <a
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 no-underline transition hover:bg-blue-100"
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
                    className="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
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
                <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                  <div className="mx-auto max-w-sm rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-5">
                    <p className="font-semibold text-slate-700">Aun no hay invitados</p>
                    <p className="mt-1 text-xs text-slate-500">
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
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex min-h-full items-center justify-center py-6">
        <section className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/60 bg-white p-5 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Panel administrativo
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Editar invitado
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Actualiza los datos y el enlace personalizado.
              </p>
            </div>
            <button
              className="cursor-pointer rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
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
            <button className="cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950 sm:col-span-2">
              Guardar cambios
            </button>
          </form>
        </section>
      </div>
    </div>,
    document.body,
  );
}
