import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/lib/types";

export const metadata = { title: "Layanan" };

export default async function ServicesPage(){
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("is_active", true).order("created_at", {ascending:false});
  const services = (data || []) as Service[];
  return <><PublicNav/><section className="page-hero"><div className="container"><span className="eyebrow">Explore</span><h1>Pilih petualanganmu.</h1><p>Rafting, Tour VW, outbound, dan layanan wisata lainnya.</p></div></section><section className="section"><div className="container">{services.length ? <div className="grid-3">{services.map(s=><ServiceCard key={s.id} service={s}/>)}</div> : <div className="panel">Belum ada layanan aktif.</div>}</div></section><Footer/></>;
}
