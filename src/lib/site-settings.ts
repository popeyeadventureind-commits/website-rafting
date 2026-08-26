import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  site_name: "Arus Adventure",
  brand_label: "ARUS.ADVENTURE",
  logo_url: null,
  hero_eyebrow: "Adventure & Tourism Experience",
  hero_title: "Lebih dari sekadar rafting.",
  hero_description: "Temukan rafting, VW Tour, outbound, river tubing, dan berbagai aktivitas wisata dalam satu platform. Pilih pengalamanmu, tentukan tanggal, lalu booking langsung via WhatsApp.",
  hero_image_url: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1800&q=80",
  primary_cta_text: "Lihat Layanan",
  primary_cta_url: "/services",
  secondary_cta_text: "Booking Sekarang",
  secondary_cta_url: "/booking",
  stat_1_value: "10+",
  stat_1_label: "Aktivitas",
  stat_2_value: "4.9/5",
  stat_2_label: "Pengalaman",
  stat_3_value: "Safety",
  stat_3_label: "Prioritas",
  stat_4_value: "WA",
  stat_4_label: "Fast Booking",
  services_badge: "Pilihan Aktivitas",
  services_title: "Layanan favorit.",
  services_description: "Pilih pengalaman yang paling cocok untuk keluarga, komunitas, sekolah, maupun perusahaan.",
  advantages_eyebrow: "Kenapa Kami",
  advantages_title: "Satu pintu untuk petualanganmu.",
  advantages_description: "Nikmati pengalaman wisata yang praktis, fleksibel, dan mudah dipesan.",
  feature_1_title: "Pilihan Fleksibel",
  feature_1_description: "Rafting, VW Tour, outbound, dan berbagai layanan wisata lainnya.",
  feature_2_title: "Booking Cepat",
  feature_2_description: "Pilih layanan, isi formulir, lalu lanjutkan konfirmasi melalui WhatsApp.",
  feature_3_title: "Tim Profesional",
  feature_3_description: "Pelayanan terorganisir dengan keselamatan dan kenyamanan sebagai prioritas.",
  feature_4_title: "Cocok untuk Grup",
  feature_4_description: "Tersedia pilihan untuk keluarga, sekolah, komunitas, dan perusahaan.",
  business_description: "Rafting, VW Tour, outbound, dan wisata petualangan dalam satu tempat.",
  address: "",
  city: "",
  phone: "",
  whatsapp: "6285899258184",
  email: "",
  business_hours: "",
  google_maps_url: "",
  instagram_url: "",
  tiktok_url: "",
  facebook_url: "",
  youtube_url: "",
  footer_text: "Rafting · VW Tour · Outbound · Adventure",
  seo_title: "Arus Adventure",
  seo_description: "Rafting, VW Tour, outbound, dan wisata petualangan dalam satu tempat.",
  updated_at: null,
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return defaultSiteSettings;
    return { ...defaultSiteSettings, ...data } as SiteSettings;
  } catch {
    return defaultSiteSettings;
  }
});
