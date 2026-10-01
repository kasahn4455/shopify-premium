import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HeroProduct = { title: string; image?: string; price?: string; handle?: string };

export default function PremiumHero({ products }: { products: HeroProduct[] }) {
  const lead = products[0];
  return (
    <section className="kismaHero">
      {lead?.image ? (
        <Image
          src={lead.image}
          alt={lead.title}
          fill
          priority
          sizes="100vw"
          className="kismaHeroImage"
        />
      ) : (
        <div className="kismaHeroFallback" />
      )}
      <div className="kismaHeroOverlay" />
      <div className="kismaHeroInner shell">
        <div className="kismaHeroCopy">
          <span className="kismaEyebrow">Useful everyday products</span>
          <h1>Practical finds for everyday life</h1>
          <p>Useful home, tech, car and everyday products at straightforward prices.</p>
          <div className="kismaHeroActions">
            <a href="#shop" className="kismaPrimary">Shop products <ArrowRight size={15}/></a>
            <a href="#new" className="kismaSecondary">View new arrivals</a>
          </div>
        </div>
      </div>
    </section>
  );
}
