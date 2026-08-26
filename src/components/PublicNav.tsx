import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export default async function PublicNav() {
  const settings = await getSiteSettings();
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand brand-with-logo">
          {settings.logo_url ? <img src={settings.logo_url} alt={settings.site_name} /> : null}
          <span className="brand-text">{settings.brand_label || settings.site_name}</span>
        </Link>
        <nav className="nav-links">
          <Link href="/#tentang">Tentang</Link>
          <Link href="/services">Layanan</Link>
          <Link href="/#keunggulan">Keunggulan</Link>
          <Link href="/gallery">Galeri</Link>
          <Link href="/booking">Booking</Link>
          <Link className="btn btn-primary" href="/booking">Pesan Sekarang</Link>
        </nav>
      </div>
    </header>
  );
}
