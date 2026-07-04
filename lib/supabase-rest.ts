import { getSupabaseEnv } from "@/lib/env";
import type { Companion, Guest, GuestWithRsvp, Rsvp } from "@/lib/types";

type SupabaseFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
  usePublicKey?: boolean;
};

async function supabaseFetch<T>(
  path: string,
  options: SupabaseFetchOptions = {},
): Promise<T> {
  const { url, publicKey, serviceKey } = getSupabaseEnv();
  const key = options.usePublicKey ? publicKey : serviceKey;
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase REST error ${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function encodeValue(value: string) {
  return encodeURIComponent(value);
}

export async function getGuestByCode(code: string): Promise<Guest | null> {
  const guests = await supabaseFetch<Guest[]>(
    `guests?code=eq.${encodeValue(code)}&select=*`,
  );

  return guests[0] ?? null;
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const guests = await supabaseFetch<Guest[]>(
    `guests?id=eq.${encodeValue(id)}&select=*`,
  );

  return guests[0] ?? null;
}

export async function getRsvpByGuestId(guestId: string): Promise<Rsvp | null> {
  const rsvps = await supabaseFetch<Rsvp[]>(
    `rsvps?guest_id=eq.${encodeValue(guestId)}&select=*`,
  );

  return rsvps[0] ?? null;
}

export async function getCompanionsByRsvpId(
  rsvpId: string,
): Promise<Companion[]> {
  return supabaseFetch<Companion[]>(
    `companions?rsvp_id=eq.${encodeValue(rsvpId)}&select=*&order=created_at.asc`,
  );
}

export async function getGuestWithRsvpByCode(
  code: string,
): Promise<GuestWithRsvp | null> {
  const guest = await getGuestByCode(code);

  if (!guest) {
    return null;
  }

  const rsvp = await getRsvpByGuestId(guest.id);
  const companions = rsvp ? await getCompanionsByRsvpId(rsvp.id) : [];

  return {
    ...guest,
    rsvp,
    companions,
  };
}

export async function listGuests(): Promise<GuestWithRsvp[]> {
  const guests = await supabaseFetch<Guest[]>(
    "guests?select=*&order=created_at.desc",
  );

  return Promise.all(
    guests.map(async (guest) => {
      const rsvp = await getRsvpByGuestId(guest.id);
      const companions = rsvp ? await getCompanionsByRsvpId(rsvp.id) : [];

      return {
        ...guest,
        rsvp,
        companions,
      };
    }),
  );
}

export async function createGuest(input: {
  code: string;
  invited_name: string;
  phone?: string;
  email?: string;
  max_guests: number;
  group_name?: string;
  table_name?: string;
}): Promise<Guest> {
  const guests = await supabaseFetch<Guest[]>("guests", {
    method: "POST",
    body: {
      code: input.code,
      invited_name: input.invited_name,
      phone: input.phone || null,
      email: input.email || null,
      max_guests: input.max_guests,
      group_name: input.group_name || null,
      table_name: input.table_name || null,
    },
    prefer: "return=representation",
  });

  return guests[0];
}

export async function updateGuest(input: {
  id: string;
  code: string;
  invited_name: string;
  phone?: string;
  email?: string;
  max_guests: number;
  group_name?: string;
  table_name?: string;
}): Promise<Guest> {
  const guests = await supabaseFetch<Guest[]>(
    `guests?id=eq.${encodeValue(input.id)}`,
    {
      method: "PATCH",
      body: {
        code: input.code,
        invited_name: input.invited_name,
        phone: input.phone || null,
        email: input.email || null,
        max_guests: input.max_guests,
        group_name: input.group_name || null,
        table_name: input.table_name || null,
      },
      prefer: "return=representation",
    },
  );

  return guests[0];
}

export async function markGuestInvitationSent(id: string): Promise<Guest> {
  const guest = await getGuestById(id);

  if (!guest) {
    throw new Error("Guest not found");
  }

  const guests = await supabaseFetch<Guest[]>(
    `guests?id=eq.${encodeValue(guest.id)}`,
    {
      method: "PATCH",
      body: {
        whatsapp_sent_at: new Date().toISOString(),
        whatsapp_sent_count: (guest.whatsapp_sent_count ?? 0) + 1,
      },
      prefer: "return=representation",
    },
  );

  return guests[0];
}

export async function upsertRsvp(input: {
  guest: Guest;
  will_attend: boolean;
  attendee_count: number;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  food_restrictions?: string;
  song_request?: string;
  message?: string;
  pdf_url?: string;
  companionNames: string[];
}): Promise<Rsvp> {
  const status = input.will_attend ? "attending" : "not_attending";

  await supabaseFetch<Guest[]>(`guests?id=eq.${encodeValue(input.guest.id)}`, {
    method: "PATCH",
    body: {
      status,
      invitation_pdf_url: input.pdf_url || null,
    },
    prefer: "return=representation",
  });

  const rsvps = await supabaseFetch<Rsvp[]>("rsvps?on_conflict=guest_id", {
    method: "POST",
    body: {
      guest_id: input.guest.id,
      will_attend: input.will_attend,
      attendee_count: input.attendee_count,
      contact_name: input.contact_name,
      contact_phone: input.contact_phone || null,
      contact_email: input.contact_email || null,
      food_restrictions: input.food_restrictions || null,
      song_request: input.song_request || null,
      message: input.message || null,
      pdf_url: input.pdf_url || null,
    },
    prefer: "resolution=merge-duplicates,return=representation",
  });

  const rsvp = rsvps[0];

  await supabaseFetch<void>(
    `companions?rsvp_id=eq.${encodeValue(rsvp.id)}`,
    {
      method: "DELETE",
    },
  );

  if (input.companionNames.length > 0) {
    await supabaseFetch<Companion[]>("companions", {
      method: "POST",
      body: input.companionNames.map((fullName) => ({
        rsvp_id: rsvp.id,
        full_name: fullName,
      })),
      prefer: "return=representation",
    });
  }

  return rsvp;
}
