export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import PremiumHero from "@/components/PremiumHero";
import { getProducts, type Product } from "@/lib/shopify";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Raheem Ventures";

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
    products = await getProducts(12);
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

      <header className="siteHeader shell">
        <Link href="/" className="brandMark" aria-label={storeName}>
          <span className="brandMonogram">RV</span>
          <span className="brandWords">{storeName}</span>
        </Link>
        <nav className="navLinks">
          <a href="#shop">Collection</a>
          <a href="#story">Our standard</a>
          <a href="#service">Delivery & returns</a>
        </nav>
        <a href="#shop" className="navCta">
          Shop now <ArrowRight size={14}/>
        </a>
      </header>

      <PremiumHero products={heroProducts} />

      <section className="marquee" aria-label="Raheem Ventures values">
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

      <section className="shop shell" id="shop">
        <div className="sectionHead premiumHead">
          <div>
            <span className="eyebrow">THE EDIT</span>
            <h2>Selected, not saturated.</h2>
          </div>
          <div className="sectionIntro">
            <p>A focused collection of useful products chosen to look good, work well and earn their place in your home.</p>
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
          <div className="productGrid premiumGrid">
            {products.map((product, index) => {
              const variant = product.variants.edges[0]?.node;
              return (
                <Link
                  className="productCard premiumCard"
                  href={"/products/" + product.handle}
                  key={product.id}
                >
                  <div className="productImage">
                    <span className="productIndex">{String(index + 1).padStart(2, "0")}</span>
                    {index < 2 && <span className="productBadge">FEATURED</span>}
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        sizes="(max-width: 700px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="imageFallback">RV</div>
                    )}
                    <div className="productHoverAction">
                      View product <ArrowRight size={15}/>
                    </div>
                  </div>
                  <div className="productMeta">
                    <div>
                      <h3>{product.title}</h3>
                      <span>{variant?.availableForSale ? "Ready to ship" : "Currently unavailable"}</span>
                    </div>
                    {variant && <strong>{money(product)}</strong>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="editorialBreak shell" id="story">
        <div className="editorialNumber">01</div>
        <div className="editorialCopy">
          <span className="eyebrow">OUR STANDARD</span>
          <h2>Useful first.<br/><em>Beautiful by default.</em></h2>
          <p>
            We favour pieces that solve a real problem without adding visual noise. The result is a tighter collection with a clearer reason to exist.
          </p>
        </div>
        <div className="editorialSculpture" aria-hidden="true">
          <div className="sculptureRing ringA"/>
          <div className="sculptureRing ringB"/>
          <div className="sculptureCore">RV</div>
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
          <span>RAHEEM VENTURES / 2026</span>
          <BadgeCheck size={22}/>
        </div>
        <h2>
          A better store is not more crowded.
          <span> It is more considered.</span>
        </h2>
        <div className="manifestoBottom">
          <p>Quality, clarity and confidence — from first scroll to final checkout.</p>
          <a href="#shop">Explore the collection <ArrowRight size={15}/></a>
        </div>
      </section>

      <footer className="footer shell">
        <div className="footerBrand">
          <span className="brandMonogram">RV</span>
          <strong>{storeName}</strong>
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
