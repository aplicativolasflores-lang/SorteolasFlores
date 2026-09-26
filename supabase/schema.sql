-- Schema for the Las Flores raffle application.
-- Run this file in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.sorteos (
  id text primary key default gen_random_uuid()::text,
  nombre text not null,
  descripcion text not null default '',
  tipo text not null default 'Experiencia gastronómica',
  fecha_inicio date not null,
  fecha_fin date not null,
  estado text not null default 'pendiente' check (estado in ('activo', 'pendiente', 'finalizado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sorteos_fechas_validas check (fecha_fin >= fecha_inicio)
);

create table if not exists public.participantes (
  id text primary key default gen_random_uuid()::text,
  sorteo_id text not null references public.sorteos(id) on delete cascade,
  nombres text not null,
  apellidos text not null,
  telefono text not null,
  ciudad text not null default 'Ayacucho',
  fecha_nacimiento date not null,
  acepta_terminos boolean not null default false,
  estado text not null default 'activo' check (estado in ('activo', 'ganador', 'descalificado')),
  participacion_fecha date not null default current_date,
  created_at timestamptz not null default now(),
  constraint participantes_acepta_terminos check (acepta_terminos = true),
  constraint participantes_telefono_valido check (telefono ~ '^[0-9]{9}$'),
  constraint participantes_una_vez_por_dia unique (telefono, participacion_fecha),
  constraint participantes_id_sorteo_unico unique (id, sorteo_id)
);

create table if not exists public.premios (
  id text primary key default gen_random_uuid()::text,
  sorteo_id text not null references public.sorteos(id) on delete cascade,
  nombre text not null,
  descripcion text not null default '',
  valor numeric(10, 2) not null default 0 check (valor >= 0),
  imagen text not null default 'Premio',
  created_at timestamptz not null default now()
);

create table if not exists public.ganadores (
  id text primary key default gen_random_uuid()::text,
  sorteo_id text not null references public.sorteos(id) on delete cascade,
  participante_id text not null references public.participantes(id) on delete restrict,
  premio_id text not null references public.premios(id) on delete restrict,
  notificado boolean not null default false,
  created_at timestamptz not null default now(),
  constraint ganadores_premio_unico unique (premio_id),
  constraint ganadores_participante_sorteo foreign key (participante_id, sorteo_id)
    references public.participantes(id, sorteo_id)
);

create table if not exists public.configuracion_restaurante (
  id smallint primary key default 1 check (id = 1),
  nombre text not null default 'Restaurante Las Flores',
  direccion text not null default '',
  lat numeric(10, 7) not null,
  lng numeric(10, 7) not null,
  radio_metros integer not null default 150 check (radio_metros > 0),
  updated_at timestamptz not null default now()
);

create index if not exists participantes_sorteo_id_idx on public.participantes (sorteo_id);
create index if not exists participantes_telefono_idx on public.participantes (telefono);
create index if not exists participantes_created_at_idx on public.participantes (created_at desc);
create index if not exists premios_sorteo_id_idx on public.premios (sorteo_id);
create index if not exists ganadores_sorteo_id_idx on public.ganadores (sorteo_id);

alter table public.sorteos
  add column if not exists tipo text not null default 'Experiencia gastronómica';

alter table public.participantes
  drop constraint if exists participantes_una_vez_por_dia;

alter table public.participantes
  add constraint participantes_una_vez_por_dia unique (telefono, participacion_fecha);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sorteos_set_updated_at on public.sorteos;
create trigger sorteos_set_updated_at
before update on public.sorteos
for each row execute function public.set_updated_at();

drop trigger if exists configuracion_set_updated_at on public.configuracion_restaurante;
create trigger configuracion_set_updated_at
before update on public.configuracion_restaurante
for each row execute function public.set_updated_at();

alter table public.sorteos enable row level security;
alter table public.participantes enable row level security;
alter table public.premios enable row level security;
alter table public.ganadores enable row level security;
alter table public.configuracion_restaurante enable row level security;

-- Public users can see raffle and prize information needed by the participation flow.
drop policy if exists sorteos_public_select on public.sorteos;
create policy sorteos_public_select
on public.sorteos for select
to anon, authenticated
using (true);

drop policy if exists premios_public_select on public.premios;
create policy premios_public_select
on public.premios for select
to anon, authenticated
using (true);

-- A participant can submit a registration without an account.
drop policy if exists participantes_public_insert on public.participantes;
create policy participantes_public_insert
on public.participantes for insert
to anon, authenticated
with check (true);

-- The current frontend uses a local admin login instead of Supabase Auth.
-- Replace anon with authenticated after migrating that login to Supabase Auth.
drop policy if exists sorteos_admin_all on public.sorteos;
create policy sorteos_admin_all
on public.sorteos for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists participantes_admin_select on public.participantes;
create policy participantes_admin_select
on public.participantes for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists participantes_admin_update on public.participantes;
create policy participantes_admin_update
on public.participantes for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists premios_admin_all on public.premios;
create policy premios_admin_all
on public.premios for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists ganadores_admin_all on public.ganadores;
create policy ganadores_admin_all
on public.ganadores for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists configuracion_admin_all on public.configuracion_restaurante;
create policy configuracion_admin_all
on public.configuracion_restaurante for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Initial restaurant configuration from the current application defaults.
insert into public.configuracion_restaurante (id, nombre, direccion, lat, lng, radio_metros)
values (1, 'Restaurante Las Flores', 'Ayacucho', -13.1631, -74.2236, 150)
on conflict (id) do nothing;

insert into public.sorteos (id, nombre, descripcion, tipo, fecha_inicio, fecha_fin, estado)
values
  ('s1', 'Gran Sorteo de Aniversario', 'Celebramos 10 años con premios increíbles para nuestros clientes.', 'Experiencia gastronómica', '2026-09-01', '2026-09-30', 'activo'),
  ('s2', 'Sorteo Fiestas Patrias', 'Sorteo especial del mes de julio.', 'Experiencia gastronómica', '2026-07-15', '2026-07-31', 'finalizado'),
  ('s3', 'Sorteo Navideño', 'El gran sorteo de fin de año con los mejores premios.', 'Premios y productos', '2026-12-01', '2026-12-24', 'pendiente')
on conflict (id) do nothing;
