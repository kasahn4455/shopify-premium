"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

type HeroProduct = {
  title: string;
  image?: string;
  price?: string;
  handle?: string;
};

export default function PremiumHero({ products }: { products: HeroProduct[] }) {
  const stage = useRef<HTMLDivElement>(null);

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 9).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 18).toFixed(2)}px`);
    el.style.setProperty("--my", `${(y * 14).toFixed(2)}px`);
  }

  function reset() {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

  const lead = products[0];
  const second = products[1];

  return (
    <section className="hero shell">
      <div className="heroCopy">
        <div className="eyebrowLine">
          <span className="eyebrow">CURATED FOR MODERN LIVING</span>
          <span className="edition">EST. 2026</span>
        </div>
        <h1>
          Everyday objects,
          <span> elevated.</span>
        </h1>
        <p>
          Considered products for a cleaner, calmer home. Chosen for function, finish and the details you notice every day.
        </p>
        <div className="heroActions">
          <a href="#shop" className="primaryButton">
            Shop the collection <ArrowRight size={17} />
          </a>
          <a href="#story" className="textButton">
            Our point of view <ArrowDownRight size={17} />
          </a>
        </div>
        <div className="heroProof">
          <span><Truck size={15}/> Tracked UK delivery</span>
          <span><ShieldCheck size={15}/> Secure Shopify checkout</span>
          <span><Sparkles size={15}/> Curated assortment</span>
        </div>
      </div>

      <div className="heroStageWrap">
        <div
          ref={stage}
          className="heroStage"
          onMouseMove={move}
          onMouseLeave={reset}
        >
          <div className="heroHalo haloOne" />
          <div className="heroHalo haloTwo" />
          <div className="heroGrid" />

          <div className="heroObject heroObjectMain">
            <div className="heroObjectFrame">
              {lead?.image ? (
                <img src={lead.image} alt={lead.title} />
              ) : (
                <div className="objectPlaceholder">RV</div>
              )}
            </div>
            <div className="heroObjectMeta">
              <span>01 / FEATURED</span>
              <strong>{lead?.title || "Refined everyday essentials"}</strong>
              {lead?.price && <small>{lead.price}</small>}
            </div>
          </div>

          <div className="heroObject heroObjectSide">
            <div className="heroObjectFrame">
              {second?.image ? (
                <img src={second.image} alt={second.title} />
              ) : (
                <div className="objectPlaceholder">RV</div>
              )}
            </div>
            <div className="heroObjectMeta compact">
              <span>02 / SELECTED</span>
              <strong>{second?.title || "Modern utility"}</strong>
            </div>
          </div>

          <div className="floatingSeal">
            <span>RAHEEM</span>
            <strong>V</strong>
            <span>VENTURES</span>
          </div>

          {lead?.handle && (
            <Link href={`/products/${lead.handle}`} className="stageLink">
              View featured product <ArrowRight size={14}/>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
