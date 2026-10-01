"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TiltProductCard({ index, handle, title, image, alt, price, available, featured }: { index: number; handle: string; title: string; image?: string; alt?: string | null; price?: string; available: boolean; featured?: boolean; }) {
  const card = useRef<HTMLAnchorElement>(null);
  function move(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = card.current;
    if (!el || !window.matchMedia("(hover:hover)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--card-rx", String((-y * 5).toFixed(2)) + "deg");
    el.style.setProperty("--card-ry", String((x * 7).toFixed(2)) + "deg");
    el.style.setProperty("--glare-x", String(((x + 0.5) * 100).toFixed(1)) + "%");
    el.style.setProperty("--glare-y", String(((y + 0.5) * 100).toFixed(1)) + "%");
  }
  function reset() {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--card-rx", "0deg");
    el.style.setProperty("--card-ry", "0deg");
  }
  return (
    <Link ref={card} className="productCard premiumCard tiltCard" href={"/products/" + handle} onMouseMove={move} onMouseLeave={reset}>
      <div className="productImage">
        <span className="productIndex">{String(index + 1).padStart(2, "0")}</span>
        {featured && <span className="productBadge">FEATURED</span>}
        {image ? <Image src={image} alt={alt || title} fill sizes="(max-width: 700px) 50vw, 25vw" /> : <div className="imageFallback">MRK</div>}
        <div className="cardGlare" aria-hidden="true" />
        <div className="productHoverAction">View product <ArrowRight size={15}/></div>
      </div>
      <div className="productMeta">
        <div><h3>{title}</h3><span>{available ? "Ready to ship" : "Currently unavailable"}</span></div>
        {price && <strong>{price}</strong>}
      </div>
    </Link>
  );
}