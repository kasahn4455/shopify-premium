import Image from "next/image";
import { ArrowRight } from "lucide-react";

type HeroProduct = { title: string; image?: string; price?: string; handle?: string };

export default function PremiumHero({ products }: { products: HeroProduct[] }) {
  const lead = products[0];
  const second = products[1];
  const third = products[2];

  return (
    <section className="kismaHero">
      <Image
        src="/lifestyle/mrk-hero.webp"
        alt="Bright premium everyday lifestyle workspace"
        fill
        priority
        sizes="100vw"
        className="kismaHeroImage"
      />
      <div className="kismaHeroOverlay" />

      <div className="kismaHeroInner shell">
        <div className="kismaHeroCopy">
          <span className="kismaEyebrow">MRK Ventures · Curated for everyday life</span>
          <h1>Practical finds with a brighter point of view.</h1>
          <p>Useful home, tech, car and everyday products — selected for function, presented with more clarity, colour and depth.</p>
          <div className="kismaHeroActions">
            <a href="#shop" className="kismaPrimary">Shop products <ArrowRight size={15}/></a>
            <a href="#new" className="kismaSecondary">View new arrivals</a>
          </div>
        </div>

        <div className="kismaHero3D" aria-hidden="true">
          {lead?.image && (
            <div className="kismaHeroTile kismaHeroTileMain">
              <Image src={lead.image} alt="" fill sizes="34vw" />
              <span>{lead.title}</span>
            </div>
          )}
          {second?.image && (
            <div className="kismaHeroTile kismaHeroTileTop">
              <Image src={second.image} alt="" fill sizes="20vw" />
              <span>{second.title}</span>
            </div>
          )}
          {third?.image && (
            <div className="kismaHeroTile kismaHeroTileBottom">
              <Image src={third.image} alt="" fill sizes="18vw" />
              <span>{third.title}</span>
            </div>
          )}
          <div className="kismaHeroOrb orbOne" />
          <div className="kismaHeroOrb orbTwo" />
          <div className="kismaHeroRing ringOne" />
          <div className="kismaHeroRing ringTwo" />
        </div>
      </div>
    </section>
  );
}
