alter table public.guests
  add column if not exists whatsapp_sent_at timestamptz,
  add column if not exists whatsapp_sent_count integer not null default 0;
