"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ImageUploadField({ name="image_url", defaultValue="", folder="services" }:{name?:string;defaultValue?:string;folder?:string}){
  const [url,setUrl]=useState(defaultValue); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function upload(file:File){
    setBusy(true);setError("");
    const ext=file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path=`${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const supabase=createClient();
    const {error}=await supabase.storage.from("website-assets").upload(path,file,{upsert:false,contentType:file.type});
    if(error){setError(error.message);setBusy(false);return;}
    const {data}=supabase.storage.from("website-assets").getPublicUrl(path);
    setUrl(data.publicUrl);setBusy(false);
  }
  return <div className="field field-full"><label>Gambar</label><input type="hidden" name={name} value={url}/><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f)}}/>{busy&&<small>Mengunggah...</small>}{error&&<div className="alert">{error}</div>}{url&&<><img src={url} alt="Preview" style={{maxWidth:260,borderRadius:16,marginTop:8}}/><button type="button" className="btn" onClick={()=>setUrl("")}>Hapus gambar dari form</button></>}</div>
}
