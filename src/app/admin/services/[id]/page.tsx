import { notFound } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { requireAdmin } from "@/lib/admin";
export default async function EditService({params}:{params:Promise<{id:string}>}){const {id}=await params; const {supabase}=await requireAdmin(); const {data}=await supabase.from("services").select("*").eq("id",id).maybeSingle(); if(!data)notFound(); return <><div className="admin-head"><div><p className="muted">Edit Layanan</p><h1 style={{fontSize:"3rem",color:"#10231f",margin:0}}>{data.name}</h1></div></div><ServiceForm service={data}/></>}
