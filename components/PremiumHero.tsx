import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HeroProduct = { title: string; image?: string; price?: string; handle?: string };

export default function PremiumHero({ products }: { products: HeroProduct[] }) {
  const lead = products[0];
  const second = products[1];
  return (
    <section className="editorialHero shell">
      <div className="editorialHeroMedia">
        {lead?.image ? (
          <Image src={lead.image} alt={lead.title} fill priority sizes="(max-width: 900px) 100vw, 70vw" />
        ) : <div className="imageFallback">RV</div>}
        <div className="editorialHeroShade" />
        <div className="editorialHeroCaption">
          <span>THE AUTUMN EDIT / 01</span>
          <strong>{lead?.title || "Objects for everyday living"}</strong>
          {lead?.price && <small>{lead.price}</small>}
        </div>
      </div>

      <div className="editorialHeroCopy">
        <span className="eyebrow">RAHEEM VENTURES</span>
        <h1>Useful things.<br/><em>Beautifully chosen.</em></h1>
        <p>A considered collection for the home: functional objects, calm materials and everyday pieces that earn their place.</p>
        <div className="editorialHeroActions">
          <a href="#shop" className="editorialPrimary">Shop the collection <ArrowRight size={15}/></a>
          <a href="#story" className="editorialText">Our approach</a>
        </div>
        {second && (
          <Link href={"/products/" + second.handle} className="secondaryFeature">
            <div className="secondaryFeatureImage">
              {second.image ? <Image src={second.image} alt={second.title} fill sizes="180px"/> : <div className="imageFallback">RV</div>}
            </div>
            <div><span>Also selected</span><strong>{second.title}</strong><small>{second.price}</small></div>
          </Link>
        )}
      </div>
    </section>
  );
}