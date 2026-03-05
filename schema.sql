-- Supabase Schema for Magic Daily Planner Orders

create table
  public.orders (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    phone text not null,
    address text not null,
    status text not null default 'Pending'::text,
    constraint orders_pkey primary key (id)
  ) tablespace pg_default;
