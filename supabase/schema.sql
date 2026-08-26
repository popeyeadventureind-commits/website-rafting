-- =========================================================
-- ARUS ADVENTURE - Supabase schema
-- Jalankan seluruh file ini di Supabase > SQL Editor.
-- =========================================================

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'customer');
create type public.booking_status as enum ('new', 'contacted', 'confirmed', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role public.user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'Adventure',
  short_description text,
  description text,
  image_url text,
  price_from numeric(14,2),
  duration text,
  location text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  price numeric(14,2) not null default 0,
  price_unit text not null default 'per orang',
  minimum_person integer not null default 1 check (minimum_person > 0),
  duration text,
  facilities text[] not null default '{}',
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(service_id, slug)
);

create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  service_id uuid references public.services(id) on delete set null,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique default ('BK-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
  name text not null,
  phone text not null,
  user_id uuid references auth.users(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  booking_date date not null,
  participant_count integer not null default 1 check (participant_count > 0),
  pickup_location text,
  notes text,
  status public.booking_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'Arus Adventure',
  brand_label text not null default 'ARUS.ADVENTURE',
  logo_url text,
  hero_eyebrow text not null default 'Adventure & Tourism Experience',
  hero_title text not null default 'Lebih dari sekadar rafting.',
  hero_description text not null default 'Temukan rafting, VW Tour, outbound, river tubing, dan berbagai aktivitas wisata dalam satu platform.',
  hero_image_url text,
  primary_cta_text text not null default 'Lihat Layanan',
  primary_cta_url text not null default '/services',
  secondary_cta_text text not null default 'Booking Sekarang',
  secondary_cta_url text not null default '/booking',
  stat_1_value text not null default '10+', stat_1_label text not null default 'Aktivitas',
  stat_2_value text not null default '4.9/5', stat_2_label text not null default 'Pengalaman',
  stat_3_value text not null default 'Safety', stat_3_label text not null default 'Prioritas',
  stat_4_value text not null default 'WA', stat_4_label text not null default 'Fast Booking',
  services_badge text not null default 'Pilihan Aktivitas',
  services_title text not null default 'Layanan favorit.',
  services_description text not null default 'Pilih pengalaman yang paling cocok untuk keluarga, komunitas, sekolah, maupun perusahaan.',
  advantages_eyebrow text not null default 'Kenapa Kami',
  advantages_title text not null default 'Satu pintu untuk petualanganmu.',
  advantages_description text not null default 'Nikmati pengalaman wisata yang praktis, fleksibel, dan mudah dipesan.',
  feature_1_title text not null default 'Pilihan Fleksibel', feature_1_description text not null default 'Rafting, VW Tour, outbound, dan berbagai layanan wisata lainnya.',
  feature_2_title text not null default 'Booking Cepat', feature_2_description text not null default 'Pilih layanan, isi formulir, lalu lanjutkan konfirmasi melalui WhatsApp.',
  feature_3_title text not null default 'Tim Profesional', feature_3_description text not null default 'Pelayanan terorganisir dengan keselamatan dan kenyamanan sebagai prioritas.',
  feature_4_title text not null default 'Cocok untuk Grup', feature_4_description text not null default 'Tersedia pilihan untuk keluarga, sekolah, komunitas, dan perusahaan.',
  business_description text not null default 'Rafting, VW Tour, outbound, dan wisata petualangan dalam satu tempat.',
  address text not null default '', city text not null default '', phone text not null default '',
  whatsapp text not null default '6287838641927', email text not null default '', business_hours text not null default '',
  google_maps_url text not null default '', instagram_url text not null default '', tiktok_url text not null default '',
  facebook_url text not null default '', youtube_url text not null default '',
  footer_text text not null default 'Rafting · VW Tour · Outbound · Adventure',
  seo_title text not null default 'Arus Adventure',
  seo_description text not null default 'Rafting, VW Tour, outbound, dan wisata petualangan dalam satu tempat.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

-- Automatically create profile for each auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name',''), new.email, 'customer');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Security helper. Cannot be manipulated from client because it reads profiles by auth.uid().
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.galleries enable row level security;
alter table public.bookings enable row level security;
alter table public.site_settings enable row level security;

-- Profiles: user sees own profile; admin sees all.
create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_update" on public.profiles
for update using (public.is_admin()) with check (public.is_admin());

-- Services: public can read active, admin can do everything.
create policy "services_public_read" on public.services
for select using (is_active = true or public.is_admin());
create policy "services_admin_insert" on public.services
for insert with check (public.is_admin());
create policy "services_admin_update" on public.services
for update using (public.is_admin()) with check (public.is_admin());
create policy "services_admin_delete" on public.services
for delete using (public.is_admin());

-- Packages: public can read active, admin can manage.
create policy "packages_public_read" on public.packages
for select using (is_active = true or public.is_admin());
create policy "packages_admin_insert" on public.packages
for insert with check (public.is_admin());
create policy "packages_admin_update" on public.packages
for update using (public.is_admin()) with check (public.is_admin());
create policy "packages_admin_delete" on public.packages
for delete using (public.is_admin());


-- Gallery: public read active, admin manage.
create policy "gallery_public_read" on public.galleries
for select using (is_active = true or public.is_admin());
create policy "gallery_admin_insert" on public.galleries
for insert with check (public.is_admin());
create policy "gallery_admin_update" on public.galleries
for update using (public.is_admin()) with check (public.is_admin());
create policy "gallery_admin_delete" on public.galleries
for delete using (public.is_admin());

-- Public Storage bucket for promotional images. Admin is the only uploader.
insert into storage.buckets (id, name, public)
values ('website-assets', 'website-assets', true)
on conflict (id) do update set public = true;

create policy "website_assets_admin_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'website-assets' and public.is_admin());
create policy "website_assets_admin_update" on storage.objects
for update to authenticated
using (bucket_id = 'website-assets' and public.is_admin())
with check (bucket_id = 'website-assets' and public.is_admin());
create policy "website_assets_admin_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'website-assets' and public.is_admin());


-- Site settings: public read, admin manage.
create policy "site_settings_public_read" on public.site_settings
for select using (true);
create policy "site_settings_admin_insert" on public.site_settings
for insert with check (public.is_admin());
create policy "site_settings_admin_update" on public.site_settings
for update using (public.is_admin()) with check (public.is_admin());
create policy "site_settings_admin_delete" on public.site_settings
for delete using (public.is_admin());

-- Booking: public visitor can submit only a brand-new booking. Customer login is not required by the app.
-- They cannot list or modify bookings. Admin can manage all bookings.
create policy "bookings_public_insert" on public.bookings
for insert to anon, authenticated
with check (status = 'new' and (user_id is null or user_id = auth.uid()));
create policy "bookings_select_own_or_admin" on public.bookings
for select using (public.is_admin() or user_id = auth.uid()); -- backward-compatible; app does not expose customer accounts
create policy "bookings_admin_update" on public.bookings
for update using (public.is_admin()) with check (public.is_admin());
create policy "bookings_admin_delete" on public.bookings
for delete using (public.is_admin());

-- Demo services. Delete these if not needed.
insert into public.services (name,slug,category,short_description,description,price_from,duration,location,is_featured,is_active)
values
('Rafting Adventure','rafting-adventure','Rafting','Arung jeram seru dengan perlengkapan keselamatan dan guide berpengalaman.','Cocok untuk keluarga, komunitas, sekolah, dan corporate gathering. Paket dapat disesuaikan dengan jumlah peserta dan tingkat kesulitan.',175000,'2-3 jam','Meeting point rafting',true,true),
('VW Tour','vw-tour','Tour','Jelajahi destinasi wisata menggunakan VW klasik dengan rute yang dapat dipilih.','Nikmati perjalanan santai menggunakan mobil VW klasik. Cocok untuk keluarga, pasangan, grup kecil, wisata foto, dan city/village tour.',350000,'3-4 jam','Meeting point Tour VW',true,true),
('Outbound Team','outbound-team','Outbound','Aktivitas team building untuk sekolah, komunitas, dan perusahaan.','Program outbound dapat dirancang berdasarkan objective: fun games, leadership, komunikasi, maupun team building.',150000,'3-5 jam','Area outbound',false,true)
on conflict (slug) do nothing;

insert into public.packages (service_id,name,slug,description,price,price_unit,minimum_person,duration,facilities,is_featured,is_active)
select id,'VW Short Trip','vw-short-trip','Paket VW untuk perjalanan singkat ke beberapa spot pilihan.',350000,'per mobil',1,'2-3 jam',array['Driver','BBM','Rute wisata','Dokumentasi basic'],true,true
from public.services where slug='vw-tour'
on conflict (service_id,slug) do nothing;

-- =========================================================
-- MENJADIKAN USER SEBAGAI ADMIN
-- 1. Buat user di Authentication > Users pada Dashboard Supabase.
-- 2. Ganti email di bawah dengan email user tersebut, lalu jalankan:
--
-- update public.profiles
-- set role = 'admin'
-- where email = 'admin@email.com';
-- =========================================================
