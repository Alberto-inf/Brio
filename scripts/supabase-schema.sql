-- =============================================================
-- Brío · Esquema de base de datos en Supabase
-- Pega y ejecuta este script completo en:
--   Supabase → SQL Editor → New query → Run
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- Perfil de usuario (vinculado 1:1 con auth.users)
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  postal_code text,
  country text default 'España',
  updated_at timestamptz default now()
);

-- -------------------------------------------------------------
-- Pedidos (cabecera)
-- -------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  total_cents integer not null default 0,
  currency text not null default 'EUR',
  created_at timestamptz default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- -------------------------------------------------------------
-- Líneas de pedido
-- -------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity > 0),
  size text,
  color text
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- -------------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------------
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- profiles: cada usuario ve y edita sólo su fila
drop policy if exists "profile self" on public.profiles;
create policy "profile self" on public.profiles
  for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- orders: cada usuario ve sus pedidos e inserta los suyos
drop policy if exists "orders self read"  on public.orders;
drop policy if exists "orders self write" on public.orders;
create policy "orders self read"  on public.orders
  for select using (auth.uid() = user_id);
create policy "orders self write" on public.orders
  for insert with check (auth.uid() = user_id);

-- order_items: un usuario ve/inserta líneas sólo en pedidos suyos
drop policy if exists "items via order read"  on public.order_items;
drop policy if exists "items via order write" on public.order_items;
create policy "items via order read"  on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
create policy "items via order write" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- =============================================================
-- (Opcional) Trigger: crear fila en profiles al registrarse
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
