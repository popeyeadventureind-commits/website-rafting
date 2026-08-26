import { notFound } from "next/navigation";
import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { createClient } from "@/lib/supabase/server";
import { rupiah } from "@/lib/format";
import type { Package, Service } from "@/lib/types";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const supabase=await createClient();
  const {data}=await supabase.from("services").select("name,short_description").eq("slug",slug).eq("is_active",true).maybeSingle();
  return {title:data?.name || "Layanan", description:data?.short_description || undefined};
}

export default async function ServiceDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const supabase=await createClient();
  const {data:service}=await supabase.from("services").select("*").eq("slug",slug).eq("is_active",true).maybeSingle();
  if(!service) notFound();
  const {data:packages}=await supabase.from("packages").select("*").eq("service_id",service.id).eq("is_active",true).order("price");
  return <><PublicNav/><section className="page-hero"><div className="container"><span className="eyebrow">{service.category}</span><h1>{service.name}</h1><p>{service.short_description}</p></div></section><section className="section"><div className="container detail-grid"><div>{service.image_url ? <img className="detail-image" src={service.image_url} alt={service.name}/> : null}<h2>Tentang layanan</h2><p className="muted" style={{lineHeight:1.8}}>{service.description || service.short_description}</p><div className="panel" style={{marginTop:20}}><strong>Harga mulai</strong><h2>{rupiah(service.price_from)}</h2><p className="muted">Durasi: {service.duration || "Menyesuaikan"}<br/>Lokasi: {service.location || "Konfirmasi admin"}</p></div><h2 style={{marginTop:36}}>Pilihan Paket</h2><div style={{display:"grid",gap:12}}>{((packages||[]) as Package[]).map(p=><div className="panel" key={p.id}><span className="badge">{p.price_unit}</span><h3>{p.name}</h3><strong>{rupiah(p.price)}</strong><p className="muted">{p.description}</p>{p.facilities?.length ? <ul>{p.facilities.map(f=><li key={f}>{f}</li>)}</ul>:null}</div>)}</div></div><div><h2 style={{marginTop:0}}>Booking {service.name}</h2><BookingForm services={[service as Service]} packages={(packages||[]) as Package[]} defaultServiceId={service.id}/></div></div></section><Footer/></>;
}
