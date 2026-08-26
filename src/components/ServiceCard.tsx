import Link from "next/link";
import { Service } from "@/lib/types";
import { rupiah } from "@/lib/format";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card">
      {service.image_url ? <img className="card-image" src={service.image_url} alt={service.name} /> : <div className="card-image" />}
      <div className="card-body">
        <span className="badge">{service.category}</span>
        <h3 style={{marginTop:12}}>{service.name}</h3>
        <p>{service.short_description || "Pengalaman wisata yang bisa disesuaikan dengan kebutuhan Anda."}</p>
        <div className="card-meta">
          <strong>Mulai {rupiah(service.price_from)}</strong>
          <Link href={`/services/${service.slug}`}>Detail →</Link>
        </div>
      </div>
    </article>
  );
}
