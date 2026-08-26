import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({children}:{children:React.ReactNode}){
  await requireAdmin();
  return <div className="admin-shell"><aside className="sidebar"><Link href="/admin" className="brand">ARUS<span>.</span>CMS</Link><nav><Link href="/admin">Dashboard</Link><Link href="/admin/services">Layanan</Link><Link href="/admin/packages">Paket</Link><Link href="/admin/bookings">Booking</Link><Link href="/admin/gallery">Galeri</Link><Link href="/admin/settings">Pengaturan Website</Link><Link href="/" target="_blank">Lihat Website ↗</Link></nav><div style={{marginTop:30}}><LogoutButton/></div></aside><main className="admin-main">{children}</main></div>
}
