"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

type HeroProduct = { title: string; image?: string; price?: string; handle?: string };

export default function PremiumHero({ products }: { products: HeroProduct[] }) {
  const stage = useRef<HTMLDivElement>(null);

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = stage.current;
    if (!el || !window.matchMedia("(hover:hover)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", String((-y * 6).toFixed(2)) + "deg");
    el.style.setProperty("--ry", String((x * 8).toFixed(2)) + "deg");
    el.style.setProperty("--mx", String((x * 24).toFixed(2)) + "px");
    el.style.setProperty("--my", String((y * 18).toFixed(2)) + "px");
    el.style.setProperty("--px", String(((x + .5) * 100).toFixed(1)) + "%");
    el.style.setProperty("--py", String(((y + .5) * 100).toFixed(1)) + "%");
  }

  function reset() {
    const el = stage.current;
    if (!el) return;
    ["--rx","--ry"].forEach((k) => el.style.setProperty(k, "0deg"));
    ["--mx","--my"].forEach((k) => el.style.setProperty(k, "0px"));
    el.style.setProperty("--px", "50%");
    el.style.setProperty("--py", "50%");
  }

  const lead = products[0];
  const second = products[1];

  return (
    <section className="heroCinematic shell">
      <div className="heroCinematicCopy">
        <div className="heroTopline">
          <span>MRK VENTURES / CURATED COMMERCE</span>
          <span>UK / 2026</span>
        </div>

        <div className="kineticTitle" aria-label="Objects with presence">
          <span className="titleLine titleLineOne">OBJECTS</span>
          <span className="titleLine titleLineTwo"><em>WITH</em> PRESENCE.</span>
        </div>

        <div className="heroLowerGrid">
          <p>Useful things, selected with an editorial eye. Designed to feel considered before you even touch them.</p>
          <div className="heroActions">
            <a href="#shop" className="primaryButton magneticButton">Explore collection <ArrowRight size={17}/></a>
            <a href="#story" className="textButton">Discover the standard <ArrowDownRight size={17}/></a>
          </div>
        </div>

        <div className="heroProof heroProofCinematic">
          <span><Truck size={15}/> Tracked UK delivery</span>
          <span><ShieldCheck size={15}/> Shopify secure checkout</span>
          <span><Sparkles size={15}/> Curated selection</span>
        </div>
      </div>

      <div className="cinematicStageWrap">
        <div ref={stage} className="cinematicStage" onMouseMove={move} onMouseLeave={reset}>
          <div className="stageLight" />
          <div className="stageGrid" />

          <div className="orbit orbitOuter"><span /></div>
          <div className="orbit orbitInner"><span /></div>
          <div className="glassDisc discOne" />
          <div className="glassDisc discTwo" />
          <div className="chromeSphere sphereOne" />
          <div className="chromeSphere sphereTwo" />

          <div className="productPlane planePrimary">
            <div className="productPlaneImage">
              {lead?.image ? <Image src={lead.image} alt={lead.title} fill priority sizes="(max-width: 900px) 80vw, 38vw"/> : <div className="objectPlaceholder">MRK</div>}
            </div>
            <div className="planeCaption">
              <span>01 / FEATURED OBJECT</span>
              <strong>{lead?.title || "Modern utility, refined."}</strong>
              {lead?.price && <small>{lead.price}</small>}
            </div>
          </div>

          <div className="productPlane planeSecondary">
            <div className="productPlaneImage">
              {second?.image ? <Image src={second.image} alt={second.title} fill sizes="(max-width: 900px) 44vw, 20vw"/> : <div className="objectPlaceholder">MRK</div>}
            </div>
            <div className="planeCaption mini">
              <span>02 / SELECTED</span>
              <strong>{second?.title || "Quietly distinctive."}</strong>
            </div>
          </div>

          <div className="brandTotem" aria-hidden="true"><img src="/mrk-mark.svg" alt=""/></div>

          {lead?.handle && <Link href={"/products/" + lead.handle} className="stageLink cinematicLink">View featured object <ArrowRight size={14}/></Link>}
        </div>
      </div>

      <div className="heroVerticalType" aria-hidden="true">MRK / VENTURES / OBJECTS / FORM / FUNCTION</div>
    </section>
  );
}