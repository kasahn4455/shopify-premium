"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { url: string; altText?: string | null };

export default function ProductGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) {
    return (
      <div className="detailImage">
        <div className="imageFallback large">MRK</div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="detailImage">
        <Image
          src={current.url}
          alt={current.altText || title}
          fill
          priority
          sizes="(max-width: 850px) 100vw, 58vw"
        />
        <span className="galleryCounter">
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {images.length > 1 && (
        <div className="galleryThumbs" aria-label="Product images">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={image.url}
              type="button"
              className={index === active ? "galleryThumb active" : "galleryThumb"}
              onClick={() => setActive(index)}
              aria-label={"View image " + (index + 1)}
              aria-pressed={index === active}
            >
              <Image
                src={image.url}
                alt={image.altText || title + " image " + (index + 1)}
                fill
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
