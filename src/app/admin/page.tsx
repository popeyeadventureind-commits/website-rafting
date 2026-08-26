import { requireAdmin } from "@/lib/admin";
export default async function AdminPage(){const {supabase,profile}=await requireAdmin(); const [{count:services},{count:packages},{count:bookings},{count:confirmed}] = await Promise.all([
  supabase.from("services").select("*",{count:"exact",head:true}),
  supabase.from("packages").select("*",{count:"exact",head:true}),
  supabase.from("bookings").select("*",{count:"exact",head:true}),
  supabase.from("bookings").select("*",{count:"exact",head:true}).eq("status","confirmed")
]);
 const {data:latest}=await supabase.from("bookings").select("booking_code,name,booking_date,participant_count,status,services(name)").order("created_at",{ascending:false}).limit(8);
 return <><div className="admin-head"><div><p className="muted">Selamat datang, {profile.full_name || "Admin"}</p><h1 style={{fontSize:"3rem",color:"#10231f",margin:0}}>Dashboard</h1></div></div><div className="kpis"><div className="kpi"><small>Layanan</small><strong>{services||0}</strong></div><div className="kpi"><small>Paket</small><strong>{packages||0}</strong></div><div className="kpi"><small>Total Booking</small><strong>{bookings||0}</strong></div><div className="kpi"><small>Confirmed</small><strong>{confirmed||0}</strong></div></div><h2>Booking Terbaru</h2><div className="table-wrap"><table><thead><tr><th>Kode</th><th>Nama</th><th>Layanan</th><th>Tanggal</th><th>Peserta</th><th>Status</th></tr></thead><tbody>{latest?.map((b:any)=><tr key={b.booking_code}><td>{b.booking_code}</td><td>{b.name}</td><td>{b.services?.name||"-"}</td><td>{b.booking_date}</td><td>{b.participant_count}</td><td><span className="badge">{b.status}</span></td></tr>)}</tbody></table></div></>
}
