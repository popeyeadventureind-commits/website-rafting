-- =========================================================
-- CMS UPGRADE - Jalankan file ini pada project Supabase lama.
-- Menambahkan pengaturan website yang dapat diedit admin.
-- Aman dijalankan setelah schema.sql versi awal.
-- =========================================================

create table if not exists public.site_settings (
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
  address text not null default '',
  city text not null default '',
  phone text not null default '',
  whatsapp text not null default '6285899258184',
  email text not null default '',
  business_hours text not null default '',
  google_maps_url text not null default '',
  instagram_url text not null default '',
  tiktok_url text not null default '',
  facebook_url text not null default '',
  youtube_url text not null default '',
  footer_text text not null default 'Rafting · VW Tour · Outbound · Adventure',
  seo_title text not null default 'Arus Adventure',
  seo_description text not null default 'Rafting, VW Tour, outbound, dan wisata petualangan dalam satu tempat.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
for select to anon, authenticated using (true);

drop policy if exists "site_settings_admin_insert" on public.site_settings;
create policy "site_settings_admin_insert" on public.site_settings
for insert to authenticated with check (public.is_admin());

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update" on public.site_settings
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "site_settings_admin_delete" on public.site_settings;
create policy "site_settings_admin_delete" on public.site_settings
for delete to authenticated using (public.is_admin());
