import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { createGuest } from "@/lib/supabase-rest";
import { parseGuestTemplateXlsx } from "@/lib/xlsx";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const formData = await request.formData();
  const file = formData.get("template");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin?import=empty");
  }

  const rows = parseGuestTemplateXlsx(new Uint8Array(await file.arrayBuffer()));

  for (const row of rows) {
    const invitedName = row.get("invited_name") || "";
    const maxGuests = Number(row.get("max_guests") || "1");
    const explicitCode = row.get("code") || "";
    const code =
      explicitCode ||
      `${slugify(invitedName)}-${Math.random().toString(36).slice(2, 7)}`;

    await createGuest({
      code,
      invited_name: invitedName,
      phone: row.get("phone") || "",
      email: row.get("email") || "",
      max_guests: Number.isFinite(maxGuests) && maxGuests > 0 ? maxGuests : 1,
      group_name: row.get("group_name") || "",
      table_name: row.get("table_name") || "",
    });
  }

  redirect(`/admin?import=${rows.length}`);
}
