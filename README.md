# Arus Adventure - Next.js + Supabase CMS

Website profil/promosi usaha wisata dengan layanan dinamis (Rafting, VW Tour, Outbound, dst), admin CMS, paket, booking database, dan redirect WhatsApp.

## Versi ini: customer TANPA login
Customer tidak perlu registrasi atau login. Alurnya:

1. Buka website.
2. Pilih layanan / paket.
3. Isi form booking.
4. Booking disimpan ke Supabase.
5. WhatsApp admin terbuka otomatis dengan detail booking.

Login hanya tersedia untuk admin di `/admin/login`.

## Fitur
- Public homepage modern dan responsive.
- Daftar layanan dinamis dari Supabase.
- URL otomatis berdasarkan slug, contoh `/services/vw-tour`.
- Paket per layanan.
- Form booking tanpa akun: menyimpan data ke Supabase lalu membuka WhatsApp.
- Admin login memakai Supabase Auth.
- Admin CRUD Layanan dan Paket.
- Admin upload gambar ke Supabase Storage.
- Galeri public + admin galeri.
- Admin mengubah status booking.
- Admin CMS Pengaturan Website: nama usaha, hero, alamat, WhatsApp, sosial media, footer, SEO, dll.
- RLS Supabase: public hanya baca konten aktif dan insert booking; admin mengelola data.
- Siap deploy ke Vercel.

## 1. Install
```bash
npm install
```

## 2. Buat Supabase project
Untuk project baru, buka SQL Editor lalu jalankan seluruh isi:

```text
supabase/schema.sql
```

Jika database Anda sudah memakai versi awal project, jangan jalankan ulang `schema.sql`. Untuk fitur CMS beranda cukup jalankan:

```text
supabase/cms-upgrade.sql
```

## 3. Environment
Copy `.env.example` menjadi `.env.local` lalu isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
NEXT_PUBLIC_WHATSAPP_NUMBER=628xxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Nomor WhatsApp gunakan format internasional tanpa `+`, contoh `6281234567890`.

## 4. Buat akun admin
Supabase Dashboard > Authentication > Users > Add user.

Setelah user dibuat, pastikan profilnya ada dan role admin. Jika tabel `profiles` masih kosong, jalankan (ganti email):

```sql
insert into public.profiles (id, full_name, email, role)
select id, 'Administrator', email, 'admin'::public.user_role
from auth.users
where email = 'admin@email.com'
on conflict (id)
do update set role = 'admin'::public.user_role;
```

Atau jika profile sudah ada:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@email.com';
```

## 5. Jalankan
```bash
npm run dev
```

Buka:
- Public: `http://localhost:3000`
- Booking: `http://localhost:3000/booking`
- Admin login: `http://localhost:3000/admin/login`
- Admin CMS: `http://localhost:3000/admin`
- Pengaturan website: `http://localhost:3000/admin/settings`

Tidak ada route login/register customer pada versi ini.

## Menambahkan VW Tour / layanan baru
Admin > Layanan > Tambah Layanan.

Contoh:
- Nama: VW Tour
- Slug: `vw-tour`
- Kategori: Tour
- Harga mulai: 350000
- Durasi: 3-4 jam
- Aktif: dicentang

Setelah disimpan, halaman otomatis tersedia di `/services/vw-tour`.

## Pengaturan Website
Menu `Admin > Pengaturan Website` dapat mengubah:
- Nama usaha dan tulisan brand
- Logo
- Hero title, subtitle, deskripsi, background
- Tombol CTA
- Statistik hero
- Heading layanan
- Keunggulan
- Alamat, kota, telepon, WhatsApp, email, jam operasional, Google Maps
- Instagram, TikTok, Facebook, YouTube
- Footer
- SEO title dan description

Nomor WhatsApp pada database dipakai otomatis oleh tombol WhatsApp dan form booking.

## Catatan database versi sebelumnya
Kolom `bookings.user_id` boleh tetap ada. Versi ini selalu menyimpan `user_id = NULL` karena customer tidak login. Jadi Anda tidak perlu mengubah database hanya untuk mengganti source code ini.

## Deploy Vercel
1. Push repository ke GitHub.
2. Import project di Vercel.
3. Tambahkan environment variables.
4. Deploy.
5. Ubah `NEXT_PUBLIC_SITE_URL` ke domain production.

## Keamanan
- Jangan pernah menaruh service-role key pada variabel `NEXT_PUBLIC_*`.
- Public hanya boleh membuat booking baru, bukan membaca semua booking.
- Admin layout mengecek session dan role server-side.
- Login admin juga mengecek `profiles.role = 'admin'` sebelum masuk dashboard.
