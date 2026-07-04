"use server";

import { redirect } from "next/navigation";
import { getGuestByCode, upsertRsvp } from "@/lib/supabase-rest";

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function confirmInvitation(formData: FormData) {
  const code = formText(formData, "code");
  const guest = await getGuestByCode(code);

  if (!guest) {
    redirect("/");
  }

  await upsertRsvp({
    guest,
    will_attend: true,
    attendee_count: guest.max_guests,
    contact_name: guest.invited_name,
    contact_phone: guest.phone || undefined,
    contact_email: guest.email || undefined,
    companionNames: [],
  });

  redirect(`/invitacion/${guest.code}/confirmado`);
}
