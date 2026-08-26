"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setOpen(!open)}
        aria-label="Buka menu navigasi"
        aria-expanded={open}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <nav className="mobile-nav-links">
          <Link href="/#tentang" onClick={() => setOpen(false)}>
            Tentang
          </Link>

          <Link href="/services" onClick={() => setOpen(false)}>
            Layanan
          </Link>

          <Link href="/#keunggulan" onClick={() => setOpen(false)}>
            Keunggulan
          </Link>

          <Link href="/gallery" onClick={() => setOpen(false)}>
            Galeri
          </Link>

          <Link href="/booking" onClick={() => setOpen(false)}>
            Booking
          </Link>

          <Link
            href="/booking"
            className="btn btn-primary"
            onClick={() => setOpen(false)}
          >
            Pesan Sekarang
          </Link>
        </nav>
      )}
    </div>
  );
}