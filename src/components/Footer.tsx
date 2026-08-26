import { getSiteSettings } from "@/lib/site-settings";

export default async function Footer(){
  const s = await getSiteSettings();
  const socials = [
    ["Instagram", s.instagram_url],
    ["TikTok", s.tiktok_url],
    ["Facebook", s.facebook_url],
    ["YouTube", s.youtube_url],
  ].filter(([,url]) => Boolean(url));

  return <footer className="footer">
    <div className="container footer-grid">
      <div>
        <strong className="footer-brand">{s.site_name}</strong>
        <p>{s.business_description || s.footer_text}</p>
      </div>
      <div>
        <strong>Kontak</strong>
        {s.address && <p>{s.address}{s.city ? `, ${s.city}` : ""}</p>}
        {s.phone && <p>{s.phone}</p>}
        {s.email && <p>{s.email}</p>}
        {s.business_hours && <p>{s.business_hours}</p>}
      </div>
      <div>
        <strong>Ikuti Kami</strong>
        <div className="social-links">
          {socials.length ? socials.map(([name,url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>) : <span>Media sosial belum diatur.</span>}
        </div>
      </div>
    </div>
    <div className="container footer-bottom">{s.footer_text}</div>
  </footer>
}
