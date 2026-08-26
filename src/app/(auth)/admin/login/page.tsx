"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });

    if (loginError) {
      setError(loginError.message);
      setBusy(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      await supabase.auth.signOut();
      setError("Session admin tidak ditemukan. Silakan login kembali.");
      setBusy(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError(
        "Akun ini belum memiliki akses admin. Pastikan data akun ada di tabel profiles dan role-nya adalah admin."
      );
      setBusy(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <span className="badge">Admin CMS</span>
        <h1 style={{ fontSize: "2.6rem", color: "#10231f" }}>Masuk Admin</h1>
        <p className="muted">Kelola konten website, layanan, paket, galeri, dan booking.</p>
        <div className="field">
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
        <div className="field" style={{ marginTop: 14 }}>
          <label>Password</label>
          <input type="password" name="password" required />
        </div>
        {error && <div className="alert">{error}</div>}
        <button className="btn btn-dark" style={{ width: "100%", marginTop: 18 }} disabled={busy}>
          {busy ? "Masuk..." : "Login"}
        </button>
      </form>
    </main>
  );
}
