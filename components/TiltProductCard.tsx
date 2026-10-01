import Image from "next/image";
import Link from "next/link";

export default function TiltProductCard({ index, handle, title, image, alt, price, available, featured }: { index: number; handle: string; title: string; image?: string; alt?: string | null; price?: string; available: boolean; featured?: boolean; }) {
  return (
    <Link className={featured ? "editorialProductCard featured" : "editorialProductCard"} href={"/products/" + handle}>
      <div className="editorialProductImage">
        {image ? <Image src={image} alt={alt || title} fill sizes="(max-width: 700px) 50vw, 25vw" /> : <div className="imageFallback">RV</div>}
        {featured && <span className="editorialBadge">Editor’s choice</span>}
        <span className="editorialIndex">{String(index + 1).padStart(2,"0")}</span>
      </div>
      <div className="editorialProductMeta">
        <div><h3>{title}</h3><span>{available ? "Available" : "Unavailable"}</span></div>
        {price && <strong>{price}</strong>}
      </div>
    </Link>
  );
}