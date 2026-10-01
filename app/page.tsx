export const dynamic = "force-dynamic";

import Image from "next/image";
import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import PremiumHero from "@/components/PremiumHero";
import PremiumHeader from "@/components/PremiumHeader";
import CatalogExperience from "@/components/CatalogExperience";
import { getProducts, type Product } from "@/lib/shopify";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Raheem Ventures";

function money(product: Product) {
  const variant = product.variants.edges[0]?.node;
  if (!variant) return "";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: variant.price.currencyCode }).format(Number(variant.price.amount));
}

export default async function Home() {
  let products: Product[] = [];
  let setupError = false;
  try { products = await getProducts(12); } catch { setupError = true; }

  const categories = Array.from(new Set(products.map(product => (product.productType || "Essentials").trim()).filter(Boolean)));
  const heroProducts = products.slice(0, 2).map(product => ({ title: product.title, image: product.featuredImage?.url, price: money(product), handle: product.handle }));
  const storyProduct = products[2] || products[0];

  return (
    <main>
      <div className="editorialAnnouncement">
        <span>Complimentary UK delivery on qualifying orders</span>
        <span>Secure checkout by Shopify</span>
      </div>
      <PremiumHeader storeName={storeName} categories={categories}/>
      <PremiumHero products={heroProducts}/>

      <section className="editorialIntro shell" id="story">
        <div className="editorialIntroIndex">01</div>
        <div className="editorialIntroText">
          <span className="eyebrow">Our approach</span>
          <h2>Less choice.<br/><em>Better choice.</em></h2>
        </div>
        <p>We select products for usefulness, finish and ease of living. The collection stays intentionally focused so browsing feels considered rather than crowded.</p>
      </section>

      <section className="shop editorialShop shell" id="shop">
        <div className="editorialSectionHead">
          <div><span className="eyebrow">Shop</span><h2>The collection</h2></div>
          <p>Objects for everyday use, selected with the same standard across every category.</p>
        </div>
        {setupError ? (
          <div className="setupCard"><span className="eyebrow">Store connection</span><strong>Shopify products are temporarily unavailable.</strong><p>Products will return automatically when the catalogue is reachable.</p></div>
        ) : <CatalogExperience products={products}/>} 
      </section>

      {storyProduct?.featuredImage && (
        <section className="editorialStory shell">
          <div className="editorialStoryMedia">
            <Image src={storyProduct.featuredImage.url} alt={storyProduct.featuredImage.altText || storyProduct.title} fill sizes="(max-width: 800px) 100vw, 58vw"/>
          </div>
          <div className="editorialStoryCopy">
            <span className="eyebrow">Selected detail / 02</span>
            <h2>Made for the rhythm of everyday life.</h2>
            <p>Useful objects should feel effortless. We look for proportion, practical detail and a visual calm that works naturally in the home.</p>
            <a href={"/products/" + storyProduct.handle}>View {storyProduct.title}</a>
          </div>
        </section>
      )}

      <section className="editorialServices" id="service">
        <div className="shell editorialServiceGrid">
          <div><Truck size={18}/><strong>Tracked delivery</strong><span>Clear updates from dispatch to door.</span></div>
          <div><ShieldCheck size={18}/><strong>Secure checkout</strong><span>Payments handled securely by Shopify.</span></div>
          <div><RotateCcw size={18}/><strong>Simple returns</strong><span>Straightforward support if something is not right.</span></div>
          <div><Headphones size={18}/><strong>Human support</strong><span>Help when you need it, without marketplace clutter.</span></div>
        </div>
      </section>

      <footer className="editorialFooter shell">
        <div className="editorialFooterBrand"><strong>{storeName}</strong><span>Objects for everyday living.</span></div>
        <div className="editorialFooterLinks"><a href="#shop">Shop</a><a href="#story">About</a><a href="#service">Delivery & returns</a></div>
        <span>© {new Date().getFullYear()} {storeName}</span>
      </footer>
    </main>
  );
}