import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import type { Package, Service } from "@/lib/types";

export const metadata = { title: "Booking" };
export default async function BookingPage(){
  const supabase=await createClient();
  const [{data:services},{data:packages},settings] = await Promise.all([
    supabase.from("services").select("*").eq("is_active",true).order("name"),
    supabase.from("packages").select("*").eq("is_active",true).order("name"),
    getSiteSettings(),
  ]);
  return <><PublicNav/><section className="page-hero"><div className="container"><span className="eyebrow">Fast Booking</span><h1>Rencanakan perjalanan.</h1><p>Isi formulir. Data masuk dashboard admin dan pesan otomatis dilanjutkan melalui WhatsApp.</p></div></section><section className="section"><div className="container detail-grid"><div><h2 style={{fontSize:"2.6rem",marginTop:0}}>Booking tanpa ribet.</h2><p className="muted">Pilih layanan dan tanggal. Admin akan mengonfirmasi ketersediaan, meeting point, serta detail pembayaran melalui WhatsApp.</p>{settings.address && <p><strong>Lokasi:</strong> {settings.address}{settings.city ? `, ${settings.city}` : ""}</p>}</div><BookingForm services={(services||[]) as Service[]} packages={(packages||[]) as Package[]} whatsappNumber={settings.whatsapp} siteName={settings.site_name}/></div></section><Footer/></>;
}
