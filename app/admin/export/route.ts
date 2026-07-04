import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { listGuests } from "@/lib/supabase-rest";

function csvValue(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const guests = await listGuests();
  const header = [
    "Invitado",
    "Estado",
    "Cupos",
    "Asistentes",
    "Mesa",
    "Telefono",
    "Email",
    "Acompanantes",
    "Restricciones",
    "Mensaje",
  ];
  const rows = guests.map((guest) => [
    guest.invited_name,
    guest.rsvp
      ? guest.rsvp.will_attend
        ? "Confirmado"
        : "No asiste"
      : "Pendiente",
    guest.max_guests,
    guest.rsvp?.attendee_count ?? 0,
    guest.table_name,
    guest.rsvp?.contact_phone ?? guest.phone,
    guest.rsvp?.contact_email ?? guest.email,
    guest.companions.map((companion) => companion.full_name).join(" | "),
    guest.rsvp?.food_restrictions,
    guest.rsvp?.message,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((value) => csvValue(value)).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="invitados-boda.csv"',
      "Cache-Control": "no-store",
    },
  });
}
