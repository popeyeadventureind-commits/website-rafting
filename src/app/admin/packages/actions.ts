"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/format";
function bool(fd:FormData,key:string){return fd.get(key)==="on";}
export async function savePackage(fd:FormData){const {supabase}=await requireAdmin(); const id=String(fd.get("id")||""); const name=String(fd.get("name")||"").trim(); const facilities=String(fd.get("facilities")||"").split("\n").map(x=>x.trim()).filter(Boolean); const payload={service_id:String(fd.get("service_id")),name,slug:slugify(String(fd.get("slug")||name)),description:String(fd.get("description")||"")||null,price:Number(fd.get("price")||0),price_unit:String(fd.get("price_unit")||"per orang"),minimum_person:Number(fd.get("minimum_person")||1),duration:String(fd.get("duration")||"")||null,facilities,image_url:String(fd.get("image_url")||"")||null,is_featured:bool(fd,"is_featured"),is_active:bool(fd,"is_active")}; const q=id?supabase.from("packages").update(payload).eq("id",id):supabase.from("packages").insert(payload); const {error}=await q;if(error)throw new Error(error.message);revalidatePath("/admin/packages");revalidatePath("/services");redirect("/admin/packages");}
export async function deletePackage(fd:FormData){const {supabase}=await requireAdmin();const {error}=await supabase.from("packages").delete().eq("id",String(fd.get("id")));if(error)throw new Error(error.message);revalidatePath("/admin/packages");}
