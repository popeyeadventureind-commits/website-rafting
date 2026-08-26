import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { default: s.seo_title || s.site_name, template: `%s | ${s.site_name}` },
    description: s.seo_description || s.business_description,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const s = await getSiteSettings();
  const whatsapp = (s.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890").replace(/\D/g, "");
  return (
    <html lang="id">
      <body>
        {children}
        {whatsapp && <Link className="whatsapp-float" href={`https://wa.me/${whatsapp}`} target="_blank">WhatsApp</Link>}
      </body>
    </html>
  );
}
