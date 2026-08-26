"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/format";

function bool(fd:FormData,key:string){return fd.get(key)==="on";}
export async function saveService(fd:FormData){
 const {supabase}=await requireAdmin(); const id=String(fd.get("id")||""); const name=String(fd.get("name")||"").trim(); if(!name) throw new Error("Nama layanan wajib diisi");
 const payload={name,slug:slugify(String(fd.get("slug")||name)),category:String(fd.get("category")||"Adventure"),short_description:String(fd.get("short_description")||"")||null,description:String(fd.get("description")||"")||null,image_url:String(fd.get("image_url")||"")||null,price_from:Number(fd.get("price_from")||0)||null,duration:String(fd.get("duration")||"")||null,location:String(fd.get("location")||"")||null,is_featured:bool(fd,"is_featured"),is_active:bool(fd,"is_active")};
 const q=id?supabase.from("services").update(payload).eq("id",id):supabase.from("services").insert(payload); const {error}=await q; if(error) throw new Error(error.message); revalidatePath("/"); revalidatePath("/services"); revalidatePath("/admin/services"); redirect("/admin/services");
}
export async function deleteService(fd:FormData){const {supabase}=await requireAdmin(); const id=String(fd.get("id")||""); const {error}=await supabase.from("services").delete().eq("id",id); if(error) throw new Error(error.message); revalidatePath("/admin/services"); revalidatePath("/services");}
