export type AttendanceStatus = "pending" | "attending" | "not_attending";

export type Guest = {
  id: string;
  code: string;
  invited_name: string;
  phone: string | null;
  email: string | null;
  max_guests: number;
  group_name: string | null;
  table_name: string | null;
  status: AttendanceStatus;
  invitation_pdf_url: string | null;
  whatsapp_sent_at?: string | null;
  whatsapp_sent_count?: number | null;
  created_at: string;
  updated_at: string;
};

export type Rsvp = {
  id: string;
  guest_id: string;
  will_attend: boolean;
  attendee_count: number;
  contact_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  food_restrictions: string | null;
  song_request: string | null;
  message: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Companion = {
  id: string;
  rsvp_id: string;
  full_name: string;
  created_at: string;
};

export type GuestWithRsvp = Guest & {
  rsvp: Rsvp | null;
  companions: Companion[];
};

export type AdminSession = {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
};
