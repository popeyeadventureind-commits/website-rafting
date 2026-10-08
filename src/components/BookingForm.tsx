"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Package, Service } from "@/lib/types";

export default function BookingForm({
  services,
  packages,
  defaultServiceId = "",
  whatsappNumber = "",
  siteName = "Popeye Adventure",
}: {
  services: Service[];
  packages: Package[];
  defaultServiceId?: string;
  whatsappNumber?: string;
  siteName?: string;
}) {
  const supabase = createClient();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serviceId, setServiceId] = useState(defaultServiceId);

  const filteredPackages = useMemo(
    () => packages.filter((p) => p.service_id === serviceId),
    [packages, serviceId]
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setBusy(true);
    setError("");
    setSuccess("");

    const fd = new FormData(e.currentTarget);

    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      service_id: serviceId || null,
      package_id: String(fd.get("package_id") || "") || null,
      booking_date: String(fd.get("booking_date") || ""),
      participant_count: Number(fd.get("participant_count") || 1),
      pickup_location:
        String(fd.get("pickup_location") || "") || null,
      notes: String(fd.get("notes") || "") || null,
    };

    if (
      !payload.name ||
      !payload.phone ||
      !payload.booking_date ||
      !payload.service_id
    ) {
      setError(
        "Lengkapi nama, WhatsApp, layanan, dan tanggal booking."
      );
      setBusy(false);
      return;
    }

    const bookingCode = `BK-${new Date()
      .toISOString()
      .slice(2, 10)
      .replaceAll("-", "")}-${crypto.randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;

    const { error: insertError } = await supabase
      .from("bookings")
      .insert({
        ...payload,
        booking_code: bookingCode,
        user_id: null,
      });

    if (insertError) {
      setError(insertError.message);
      setBusy(false);
      return;
    }

    const service = services.find(
      (s) => s.id === serviceId
    );

    const pkg = packages.find(
      (p) => p.id === payload.package_id
    );

    const msg = [
      `Halo Admin ${siteName},`,
      "",
      "Saya ingin melakukan booking:",
      `Kode Booking: ${bookingCode}`,
      `Nama: ${payload.name}`,
      `WhatsApp: ${payload.phone}`,
      `Layanan: ${service?.name || "-"}`,
      `Paket: ${pkg?.name || "Belum memilih paket"}`,
      `Tanggal: ${payload.booking_date}`,
      `Jumlah Peserta: ${payload.participant_count}`,
      `Pickup/Lokasi: ${payload.pickup_location || "-"}`,
      `Catatan: ${payload.notes || "-"}`,
      "",
      "Mohon informasi ketersediaannya. Terima kasih.",
    ].join("\n");

    const number = (
      whatsappNumber ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      "6287838641927"
    ).replace(/\D/g, "");

    setSuccess(
      "Booking berhasil! Anda akan diarahkan ke WhatsApp."
    );

    setTimeout(() => {
      window.location.href = `https://wa.me/${number}?text=${encodeURIComponent(
        msg
      )}`;
    }, 1500);
  }

  return (
    <form onSubmit={submit} className="panel">
      <div className="form-grid">
        <div className="field">
          <label>Nama</label>
          <input
            name="name"
            required
            placeholder="Nama lengkap"
          />
        </div>

        <div className="field">
          <label>Nomor WhatsApp</label>
          <input
            name="phone"
            required
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div className="field">
          <label>Layanan</label>
          <select
            name="service_id"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          >
            <option value="">Pilih layanan</option>

            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Paket</label>

          <select name="package_id">
            <option value="">
              Belum memilih paket
            </option>

            {filteredPackages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Tanggal</label>
          <input
            type="date"
            name="booking_date"
            required
          />
        </div>

        <div className="field">
          <label>Jumlah Peserta</label>
          <input
            type="number"
            name="participant_count"
            min="1"
            defaultValue="2"
            required
          />
        </div>

        <div className="field field-full">
          <label>
            Lokasi Pickup / Meeting Point
          </label>

          <input
            name="pickup_location"
            placeholder="Opsional"
          />
        </div>

        <div className="field field-full">
          <label>Catatan</label>

          <textarea
            name="notes"
            rows={4}
            placeholder="Contoh: rombongan keluarga, ada anak 8 tahun, dll."
          />
        </div>
      </div>

      {error && (
        <div className="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={busy}
      >
        {busy
          ? "Menyimpan..."
          : "Booking via WhatsApp"}
      </button>
    </form>
  );
}