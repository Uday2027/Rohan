-- Supabase Schema for Magic Daily Planner Orders

create table
  public.orders (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    phone text not null,
    address text not null,
    qty_black integer not null default 0,
    qty_white integer not null default 0,
    delivery_area text not null,
    delivery_charge integer not null,
    total_price integer not null,
    status text not null default 'Pending'::text,
    constraint orders_pkey primary key (id)
  ) tablespace pg_default;
