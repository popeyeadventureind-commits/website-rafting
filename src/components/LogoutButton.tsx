"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
export default function LogoutButton(){const router=useRouter(); return <button className="btn btn-ghost" onClick={async()=>{await createClient().auth.signOut();router.push("/admin/login");router.refresh();}}>Logout</button>}
