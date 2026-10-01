export const dynamic = "force-dynamic";

import { ArrowRight, BadgeCheck, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import PremiumHero from "@/components/PremiumHero";
import PremiumHeader from "@/components/PremiumHeader";
import CatalogExperience from "@/components/CatalogExperience";
import { getProducts, type Product } from "@/lib/shopify";

const storeName = "MRK Ventures";

function money(product: Product) {
  const variant = product.variants.edges[0]?.node;
  if (!variant) return "";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: variant.price.currencyCode
  }).format(Number(variant.price.amount));
}

export default async function Home() {
  let products: Product[] = [];
  let setupError = false;

  try {
    products = await getProducts(64);
  } catch {
    setupError = true;
  }

  const heroProducts = products.slice(0, 2).map(product => ({
    title: product.title,
    image: product.featuredImage?.url,
    price: money(product),
    handle: product.handle
  }));

  return (
    <main>
      <div className="announcement">
        <span>Complimentary UK delivery on qualifying orders</span>
        <span className="announcementDot">•</span>
        <span>Secure checkout powered by Shopify</span>
      </div>

      <PremiumHeader storeName={storeName} />

      <PremiumHero products={heroProducts} />

      <section className="marquee" aria-label="MRK Ventures values">
        <div className="marqueeTrack">
          <span>CURATED UTILITY</span><i>◆</i>
          <span>MODERN FORM</span><i>◆</i>
          <span>EVERYDAY FUNCTION</span><i>◆</i>
          <span>CONSIDERED QUALITY</span><i>◆</i>
          <span>CURATED UTILITY</span><i>◆</i>
          <span>MODERN FORM</span><i>◆</i>
          <span>EVERYDAY FUNCTION</span><i>◆</i>
          <span>CONSIDERED QUALITY</span><i>◆</i>
        </div>
      </section>

      <section className="typeStage shell" aria-label="MRK Ventures design statement">
        <div className="typeStageRule"><span>FORM</span><span>FUNCTION</span><span>DETAIL</span></div>
        <div className="typeStageMain">
          <span className="typeStageGhost">MRK</span>
          <div className="typeStageCopy">
            <span className="eyebrow">THE MRK STANDARD</span>
            <h2><span>Quiet luxury.</span><em>Real utility.</em></h2>
            <p>Simple products. Clear purpose. Better everyday choices without the clutter.</p>
          </div>
          <div className="kineticObject" aria-hidden="true">
            <div className="kineticOrb"/>
            <div className="kineticRing ringOne"/>
            <div className="kineticRing ringTwo"/>
            <div className="kineticAxis"/>
          </div>
        </div>
      </section>

      <section className="shop shell" id="shop">
        <div className="sectionHead premiumHead">
          <div>
            <span className="eyebrow">THE EDIT</span>
            <h2>Everything useful. Nothing unnecessary.</h2>
          </div>
          <div className="sectionIntro">
            <p>Browse practical everyday products across home, kitchen, car, travel, tech and gifts — organised to help you find what you need quickly.</p>
            <span>{String(products.length).padStart(2, "0")} PRODUCTS</span>
          </div>
        </div>

        {setupError ? (
          <div className="setupCard">
            <span className="eyebrow">STORE CONNECTION</span>
            <strong>Shopify products are temporarily unavailable.</strong>
            <p>The storefront itself is live. Product inventory will appear automatically when the Shopify public catalogue is reachable.</p>
          </div>
        ) : (
          <CatalogExperience products={products} />
        )}
      </section>

      <section className="editorialBreak shell" id="story">
        <div className="editorialNumber">01</div>
        <div className="editorialCopy">
          <span className="eyebrow">OUR STANDARD</span>
          <h2>Practical first.<br/><em>Chosen with care.</em></h2>
          <p>
            We focus on useful products that solve everyday problems, feel easy to use and offer clear value.
          </p>
        </div>
        <div className="editorialSculpture" aria-hidden="true">
          <div className="sculptureRing ringA"/>
          <div className="sculptureRing ringB"/>
          <div className="sculptureCore">MRK</div>
        </div>
      </section>

      <section className="serviceBand" id="service">
        <div className="shell serviceGrid">
          <div className="serviceItem">
            <Truck size={22}/>
            <div><strong>Tracked UK delivery</strong><span>Clear fulfilment from checkout to door.</span></div>
          </div>
          <div className="serviceItem">
            <ShieldCheck size={22}/>
            <div><strong>Secure checkout</strong><span>Payments handled through Shopify.</span></div>
          </div>
          <div className="serviceItem">
            <RotateCcw size={22}/>
            <div><strong>Simple returns</strong><span>Clear post-purchase support when needed.</span></div>
          </div>
          <div className="serviceItem">
            <Headphones size={22}/>
            <div><strong>Human support</strong><span>Real help for product and order questions.</span></div>
          </div>
        </div>
      </section>

      <section className="manifesto shell">
        <div className="manifestoTop">
          <span>MRK VENTURES / 2026</span>
          <BadgeCheck size={22}/>
        </div>
        <h2>
          A better store is not more crowded.
          <span> It is more considered.</span>
        </h2>
        <div className="manifestoBottom">
          <p>Clear categories, straightforward product choices and a secure checkout from start to finish.</p>
          <a href="#shop">Explore the collection <ArrowRight size={15}/></a>
        </div>
      </section>

      <footer className="footer shell">
        <div className="footerBrand">
          <img className="brandLogo footerLogo" src="/mrk-logo.svg" alt="MRK Ventures"/>
          <span>Curated essentials for everyday life.</span>
        </div>
        <div className="footerLinks">
          <a href="#shop">Shop</a>
          <a href="#story">Our standard</a>
          <a href="#service">Service</a>
        </div>
        <span>© {new Date().getFullYear()} {storeName}. Shopify-powered commerce.</span>
      </footer>
    </main>
  );
}
