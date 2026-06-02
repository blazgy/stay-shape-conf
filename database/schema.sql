create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  language text not null check (language in ('en', 'de')),
  consent_given boolean not null default false,
  consent_timestamp timestamptz not null,
  submitted_at timestamptz not null default now(),
  source_event text not null default 'stay-shape-vienna-2026',
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

revoke all on table public.registrations from anon, authenticated;

create unique index if not exists registrations_source_event_email_unique
  on public.registrations (source_event, email);

drop index if exists public.registrations_email_unique;
