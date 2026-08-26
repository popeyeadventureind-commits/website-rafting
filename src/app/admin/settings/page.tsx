import ImageUploadField from "@/components/admin/ImageUploadField";
import { requireAdmin } from "@/lib/admin";
import { defaultSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/types";
import { saveSiteSettings } from "./actions";

function Field({label,name,value,type="text",placeholder=""}:{label:string;name:string;value?:string|null;type?:string;placeholder?:string}){
  return <div className="field"><label>{label}</label><input type={type} name={name} defaultValue={value || ""} placeholder={placeholder}/></div>;
}
function Textarea({label,name,value,rows=4}:{label:string;name:string;value?:string|null;rows?:number}){
  return <div className="field field-full"><label>{label}</label><textarea name={name} defaultValue={value || ""} rows={rows}/></div>;
}

export default async function SettingsPage({searchParams}:{searchParams:Promise<{saved?:string}>}){
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id",1).maybeSingle();
  const s = {...defaultSiteSettings, ...(data || {})} as SiteSettings;
  const {saved} = await searchParams;

  return <>
    <div className="admin-head">
      <div><p className="muted">CMS Beranda & Identitas</p><h1 style={{fontSize:"3rem",color:"#10231f",margin:0}}>Pengaturan Website</h1></div>
      <a className="btn btn-dark" href="/" target="_blank">Lihat Website ↗</a>
    </div>
    {saved === "1" && <div className="success-alert">Pengaturan berhasil disimpan dan beranda sudah diperbarui.</div>}
    <form action={saveSiteSettings} className="settings-stack">
      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">Identitas</span><h2>Nama usaha & branding</h2></div><p>Digunakan pada navbar, footer, SEO, dan pesan WhatsApp.</p></div>
        <div className="form-grid">
          <Field label="Nama Usaha" name="site_name" value={s.site_name}/>
          <Field label="Tulisan Brand di Navbar" name="brand_label" value={s.brand_label} placeholder="POPEYE ADVENTURE"/>
          <ImageUploadField name="logo_url" defaultValue={s.logo_url || ""} folder="branding"/>
          <Textarea label="Deskripsi Usaha" name="business_description" value={s.business_description}/>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">Hero</span><h2>Bagian utama beranda</h2></div><p>Judul pertama yang dilihat calon customer.</p></div>
        <div className="form-grid">
          <Field label="Eyebrow / Teks Kecil" name="hero_eyebrow" value={s.hero_eyebrow}/>
          <Field label="Judul Hero" name="hero_title" value={s.hero_title}/>
          <Textarea label="Deskripsi Hero" name="hero_description" value={s.hero_description}/>
          <ImageUploadField name="hero_image_url" defaultValue={s.hero_image_url || ""} folder="hero"/>
          <Field label="Tombol Utama" name="primary_cta_text" value={s.primary_cta_text}/>
          <Field label="URL Tombol Utama" name="primary_cta_url" value={s.primary_cta_url}/>
          <Field label="Tombol Kedua" name="secondary_cta_text" value={s.secondary_cta_text}/>
          <Field label="URL Tombol Kedua" name="secondary_cta_url" value={s.secondary_cta_url}/>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">Statistik</span><h2>4 informasi singkat di hero</h2></div><p>Contoh: 10+ aktivitas, 4.9/5 rating, safety, fast booking.</p></div>
        <div className="form-grid">
          <Field label="Stat 1 - Nilai" name="stat_1_value" value={s.stat_1_value}/><Field label="Stat 1 - Label" name="stat_1_label" value={s.stat_1_label}/>
          <Field label="Stat 2 - Nilai" name="stat_2_value" value={s.stat_2_value}/><Field label="Stat 2 - Label" name="stat_2_label" value={s.stat_2_label}/>
          <Field label="Stat 3 - Nilai" name="stat_3_value" value={s.stat_3_value}/><Field label="Stat 3 - Label" name="stat_3_label" value={s.stat_3_label}/>
          <Field label="Stat 4 - Nilai" name="stat_4_value" value={s.stat_4_value}/><Field label="Stat 4 - Label" name="stat_4_label" value={s.stat_4_label}/>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">Layanan</span><h2>Heading layanan di beranda</h2></div><p>Daftar layanan tetap diambil otomatis dari menu Layanan.</p></div>
        <div className="form-grid">
          <Field label="Badge" name="services_badge" value={s.services_badge}/>
          <Field label="Judul" name="services_title" value={s.services_title}/>
          <Textarea label="Deskripsi" name="services_description" value={s.services_description}/>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">Keunggulan</span><h2>Kenapa memilih kami</h2></div><p>Semua judul dan isi empat kartu bisa diganti admin.</p></div>
        <div className="form-grid">
          <Field label="Eyebrow" name="advantages_eyebrow" value={s.advantages_eyebrow}/>
          <Field label="Judul" name="advantages_title" value={s.advantages_title}/>
          <Textarea label="Deskripsi Section" name="advantages_description" value={s.advantages_description}/>
          <Field label="Kartu 1 - Judul" name="feature_1_title" value={s.feature_1_title}/><Textarea label="Kartu 1 - Deskripsi" name="feature_1_description" value={s.feature_1_description} rows={3}/>
          <Field label="Kartu 2 - Judul" name="feature_2_title" value={s.feature_2_title}/><Textarea label="Kartu 2 - Deskripsi" name="feature_2_description" value={s.feature_2_description} rows={3}/>
          <Field label="Kartu 3 - Judul" name="feature_3_title" value={s.feature_3_title}/><Textarea label="Kartu 3 - Deskripsi" name="feature_3_description" value={s.feature_3_description} rows={3}/>
          <Field label="Kartu 4 - Judul" name="feature_4_title" value={s.feature_4_title}/><Textarea label="Kartu 4 - Deskripsi" name="feature_4_description" value={s.feature_4_description} rows={3}/>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">Kontak</span><h2>Alamat & kontak bisnis</h2></div><p>WhatsApp ini juga otomatis dipakai form booking dan tombol mengambang.</p></div>
        <div className="form-grid">
          <Field label="Nomor WhatsApp (format 628...)" name="whatsapp" value={s.whatsapp}/>
          <Field label="Telepon" name="phone" value={s.phone}/>
          <Field label="Email" name="email" type="email" value={s.email}/>
          <Field label="Kota / Kabupaten" name="city" value={s.city}/>
          <Textarea label="Alamat Lengkap" name="address" value={s.address} rows={3}/>
          <Field label="Jam Operasional" name="business_hours" value={s.business_hours} placeholder="Setiap hari 08.00 - 17.00"/>
          <div className="field field-full"><label>Google Maps URL</label><input name="google_maps_url" defaultValue={s.google_maps_url || ""} placeholder="https://maps.google.com/..."/></div>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">Social Media</span><h2>Tautan media sosial</h2></div><p>Kosongkan platform yang tidak digunakan.</p></div>
        <div className="form-grid">
          <Field label="Instagram URL" name="instagram_url" value={s.instagram_url}/>
          <Field label="TikTok URL" name="tiktok_url" value={s.tiktok_url}/>
          <Field label="Facebook URL" name="facebook_url" value={s.facebook_url}/>
          <Field label="YouTube URL" name="youtube_url" value={s.youtube_url}/>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="settings-heading"><div><span className="badge">SEO & Footer</span><h2>Google dan bagian bawah website</h2></div><p>Judul SEO membantu identitas halaman saat tampil di browser atau mesin pencari.</p></div>
        <div className="form-grid">
          <Field label="SEO Title" name="seo_title" value={s.seo_title}/>
          <Textarea label="SEO Description" name="seo_description" value={s.seo_description} rows={3}/>
          <Textarea label="Teks Footer" name="footer_text" value={s.footer_text} rows={2}/>
        </div>
      </section>

      <div className="settings-savebar"><div><strong>Simpan semua perubahan?</strong><small>Perubahan langsung digunakan website public.</small></div><button className="btn btn-primary" type="submit">Simpan Pengaturan</button></div>
    </form>
  </>;
}
