import Image from "next/image";
import Link from "next/link";

export default function TiltProductCard({ handle, title, image, alt, price, available }: { index?: number; handle: string; title: string; image?: string; alt?: string | null; price?: string; available: boolean; featured?: boolean; }) {
  return (
    <Link className="kismaProductCard" href={"/products/" + handle}>
      <div className="kismaProductImage">
        {image ? (
          <Image src={image} alt={alt || title} fill sizes="(max-width: 700px) 50vw, 20vw" />
        ) : (
          <div className="imageFallback">MRK</div>
        )}
        <span className="kismaQuickView">View product</span>
      </div>
      <div className="kismaProductMeta">
        <h3>{title}</h3>
        <div>
          {price && <strong>{price}</strong>}
          <span>{available ? "Available" : "Sold out"}</span>
        </div>
      </div>
    </Link>
  );
}
