"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

const text = (fd: FormData, key: string) => String(fd.get(key) || "").trim();

export async function saveSiteSettings(fd: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    id: 1,
    site_name: text(fd, "site_name") || "Arus Adventure",
    brand_label: text(fd, "brand_label") || text(fd, "site_name") || "Arus Adventure",
    logo_url: text(fd, "logo_url") || null,
    hero_eyebrow: text(fd, "hero_eyebrow"),
    hero_title: text(fd, "hero_title"),
    hero_description: text(fd, "hero_description"),
    hero_image_url: text(fd, "hero_image_url") || null,
    primary_cta_text: text(fd, "primary_cta_text"),
    primary_cta_url: text(fd, "primary_cta_url") || "/services",
    secondary_cta_text: text(fd, "secondary_cta_text"),
    secondary_cta_url: text(fd, "secondary_cta_url") || "/booking",
    stat_1_value: text(fd, "stat_1_value"), stat_1_label: text(fd, "stat_1_label"),
    stat_2_value: text(fd, "stat_2_value"), stat_2_label: text(fd, "stat_2_label"),
    stat_3_value: text(fd, "stat_3_value"), stat_3_label: text(fd, "stat_3_label"),
    stat_4_value: text(fd, "stat_4_value"), stat_4_label: text(fd, "stat_4_label"),
    services_badge: text(fd, "services_badge"),
    services_title: text(fd, "services_title"),
    services_description: text(fd, "services_description"),
    advantages_eyebrow: text(fd, "advantages_eyebrow"),
    advantages_title: text(fd, "advantages_title"),
    advantages_description: text(fd, "advantages_description"),
    feature_1_title: text(fd, "feature_1_title"), feature_1_description: text(fd, "feature_1_description"),
    feature_2_title: text(fd, "feature_2_title"), feature_2_description: text(fd, "feature_2_description"),
    feature_3_title: text(fd, "feature_3_title"), feature_3_description: text(fd, "feature_3_description"),
    feature_4_title: text(fd, "feature_4_title"), feature_4_description: text(fd, "feature_4_description"),
    business_description: text(fd, "business_description"),
    address: text(fd, "address"),
    city: text(fd, "city"),
    phone: text(fd, "phone"),
    whatsapp: text(fd, "whatsapp").replace(/\D/g, ""),
    email: text(fd, "email"),
    business_hours: text(fd, "business_hours"),
    google_maps_url: text(fd, "google_maps_url"),
    instagram_url: text(fd, "instagram_url"),
    tiktok_url: text(fd, "tiktok_url"),
    facebook_url: text(fd, "facebook_url"),
    youtube_url: text(fd, "youtube_url"),
    footer_text: text(fd, "footer_text"),
    seo_title: text(fd, "seo_title"),
    seo_description: text(fd, "seo_description"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });
  if (error) throw new Error(`Gagal menyimpan pengaturan: ${error.message}`);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
