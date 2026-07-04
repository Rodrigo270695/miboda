import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { createGuest, updateGuest } from "@/lib/supabase-rest";

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

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
  const guestId = formText(formData, "guest_id");
  const invitedName = formText(formData, "invited_name");
  const explicitCode = formText(formData, "code");
  const maxGuests = Number(formText(formData, "max_guests"));
  const safeMaxGuests = Number.isFinite(maxGuests) && maxGuests > 0 ? maxGuests : 1;
  const code = explicitCode || `${slugify(invitedName)}-${Math.random().toString(36).slice(2, 7)}`;

  const guestPayload = {
    code,
    invited_name: invitedName,
    phone: formText(formData, "phone"),
    email: formText(formData, "email"),
    max_guests: safeMaxGuests,
    group_name: formText(formData, "group_name"),
    table_name: formText(formData, "table_name"),
  };

  if (guestId) {
    await updateGuest({
      id: guestId,
      ...guestPayload,
    });
  } else {
    await createGuest(guestPayload);
  }

  redirect("/admin");
}
