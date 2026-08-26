import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ServiceCard from "@/components/ServiceCard";
import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import { Service } from "@/lib/types";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const supabase = await createClient();
  const [settings, serviceResult] = await Promise.all([
    getSiteSettings(),
    supabase.from("services").select("*").eq("is_active", true).order("is_featured", { ascending: false }).limit(6),
  ]);
  const services = (serviceResult.data || []) as Service[];
  const heroStyle = settings.hero_image_url ? {
    backgroundImage: `radial-gradient(circle at 15% 30%, rgba(52,211,153,.24), transparent 34%), linear-gradient(120deg, rgba(7,26,23,.95), rgba(7,26,23,.74)), url("${settings.hero_image_url}")`,
  } : undefined;

  const stats = [
    [settings.stat_1_value, settings.stat_1_label],
    [settings.stat_2_value, settings.stat_2_label],
    [settings.stat_3_value, settings.stat_3_label],
    [settings.stat_4_value, settings.stat_4_label],
  ];
  const features = [
    [settings.feature_1_title, settings.feature_1_description],
    [settings.feature_2_title, settings.feature_2_description],
    [settings.feature_3_title, settings.feature_3_description],
    [settings.feature_4_title, settings.feature_4_description],
  ];

  return <>
    <PublicNav />
    <main>
      <section className="hero" style={heroStyle}>
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">{settings.hero_eyebrow}</span>
            <h1>{settings.hero_title}</h1>
            <p>{settings.hero_description}</p>
            <div className="actions">
              <Link className="btn btn-primary" href={settings.primary_cta_url || "/services"}>{settings.primary_cta_text}</Link>
              <Link className="btn btn-ghost" href={settings.secondary_cta_url || "/booking"}>{settings.secondary_cta_text}</Link>
            </div>
          </div>
          <aside className="hero-card">
            <span className="badge">{settings.site_name}</span>
            <h2 style={{fontSize:"2rem",marginBottom:8}}>{settings.business_description}</h2>
            {settings.address && <p>{settings.address}{settings.city ? `, ${settings.city}` : ""}</p>}
            <div className="hero-stat">
              {stats.map(([value,label], i) => <div className="stat" key={i}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
          </aside>
        </div>
      </section>

      <section className="section" id="tentang">
        <div className="container">
          <div className="section-head"><div><span className="badge">{settings.services_badge}</span><h2>{settings.services_title}</h2></div><p>{settings.services_description}</p></div>
          {services.length ? <div className="grid-3">{services.map(s => <ServiceCard key={s.id} service={s} />)}</div> : <div className="panel"><strong>Belum ada layanan.</strong><p className="muted">Tambahkan layanan dari dashboard admin.</p></div>}
          <div className="actions"><Link className="btn btn-dark" href="/services">Semua Layanan</Link></div>
        </div>
      </section>

      <section className="section section-dark" id="keunggulan">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">{settings.advantages_eyebrow}</span><h2>{settings.advantages_title}</h2></div><p>{settings.advantages_description}</p></div>
          <div className="feature-grid">
            {features.map(([title,description], i) => <div className="feature" key={i}><h3>{title}</h3><p>{description}</p></div>)}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
