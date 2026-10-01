export const dynamic = "force-dynamic";

import Image from "next/image";
import { ArrowRight, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import PremiumHero from "@/components/PremiumHero";
import PremiumHeader from "@/components/PremiumHeader";
import TiltProductCard from "@/components/TiltProductCard";
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

function searchText(product: Product) {
  return [product.title, product.description, product.productType, product.vendor].filter(Boolean).join(" ").toLowerCase();
}

function findBy(products: Product[], terms: string[], fallback: number) {
  return products.find(product => terms.some(term => searchText(product).includes(term))) || products[fallback] || products[0];
}

function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="kismaProductGrid">
      {products.map((product, index) => {
        const variant = product.variants.edges[0]?.node;
        return (
          <TiltProductCard
            key={product.id}
            index={index}
            handle={product.handle}
            title={product.title}
            image={product.featuredImage?.url}
            alt={product.featuredImage?.altText}
            price={variant ? money(product) : undefined}
            available={Boolean(variant?.availableForSale)}
          />
        );
      })}
    </div>
  );
}

export default async function Home() {
  let products: Product[] = [];
  let setupError = false;

  try {
    products = await getProducts(64);
  } catch {
    setupError = true;
  }

  const heroProducts = products.slice(0, 3).map(product => ({
    title: product.title,
    image: product.featuredImage?.url,
    price: money(product),
    handle: product.handle
  }));

  const categories = [
    { title: "Home & Living", terms: ["home","lamp","clock","decor","plant","household"] },
    { title: "Tech & Accessories", terms: ["usb","phone","charger","fan","tech"] },
    { title: "Car Accessories", terms: ["car","vacuum","dashboard","mount"] },
    { title: "Everyday Essentials", terms: ["soap","bottle","clean","travel","everyday"] }
  ].map((category, index) => ({
    ...category,
    product: findBy(products, category.terms, index)
  }));

  const featured = products.slice(0, 10);
  const newArrivals = products.slice(10, 20).length ? products.slice(10, 20) : products.slice(0, 10);
  const promo = findBy(products, ["car","vacuum","travel","portable"], 4);

  return (
    <main className="kismaInspired">
      <div className="kismaAnnouncement">
        Secure Shopify checkout <span>·</span> UK delivery options <span>·</span> Simple returns
      </div>

      <PremiumHeader storeName={storeName} />
      <PremiumHero products={heroProducts} />

      <section className="kismaCategories shell" id="categories">
        <div className="kismaSectionHead">
          <h2>Shop by category</h2>
          <a href="#shop">All products <ArrowRight size={14}/></a>
        </div>

        <div className="kismaCategoryGrid">
          {categories.map((category, index) => (
            <a href="#shop" className="kismaCategoryCard" key={category.title}>
              <div className="kismaCategoryImage">
                {category.product?.featuredImage ? (
                  <Image
                    src={category.product.featuredImage.url}
                    alt={category.product.featuredImage.altText || category.title}
                    fill
                    sizes="(max-width: 760px) 70vw, 25vw"
                  />
                ) : <div className="imageFallback">MRK</div>}
                <span className="kismaCategoryIndex">0{index + 1}</span>
              </div>
              <div className="kismaCategoryMeta">
                <span>{category.title}</span>
                <ArrowRight size={14}/>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="kismaProducts shell" id="shop">
        <div className="kismaSectionHead">
          <h2>Shop all products</h2>
          <span>{products.length} products</span>
        </div>

        {setupError ? (
          <div className="setupCard">
            <strong>Products are temporarily unavailable.</strong>
            <p>The storefront is live and inventory will return automatically when Shopify reconnects.</p>
          </div>
        ) : (
          <ProductRow products={featured} />
        )}
      </section>

      {promo?.featuredImage && (
        <section className="kismaPromo shell">
          <div className="kismaPromoImage">
            <Image
              src={promo.featuredImage.url}
              alt={promo.featuredImage.altText || promo.title}
              fill
              sizes="100vw"
            />
            <div className="kismaPromoOverlay"/>
            <div className="kismaPromoCopy">
              <span>MRK EDIT / EVERYDAY UTILITY</span>
              <h2>Useful products, thoughtfully selected.</h2>
              <a href={"/products/" + promo.handle}>Explore the product <ArrowRight size={15}/></a>
            </div>
          </div>
        </section>
      )}

      <section className="kismaProducts shell" id="new">
        <div className="kismaSectionHead">
          <h2>New arrivals</h2>
          <a href="#shop">View all <ArrowRight size={14}/></a>
        </div>
        {!setupError && <ProductRow products={newArrivals} />}
      </section>

      <section className="kismaTrust">
        <div className="shell kismaTrustGrid">
          <div><ShieldCheck size={18}/><span><strong>Secure checkout</strong><small>Payments handled through Shopify.</small></span></div>
          <div><Truck size={18}/><span><strong>UK delivery options</strong><small>Available methods shown at checkout.</small></span></div>
          <div><RotateCcw size={18}/><span><strong>Simple returns</strong><small>Clear support after purchase.</small></span></div>
          <div><Headphones size={18}/><span><strong>Customer support</strong><small>Help for product and order questions.</small></span></div>
        </div>
      </section>

      <section className="kismaClosing">
        <div className="shell">
          <span>MRK VENTURES</span>
          <h2>Practical products.<br/>Straightforward shopping.</h2>
          <p>Useful products for everyday homes, journeys and routines — presented with more clarity, colour and depth.</p>
          <a href="#shop">Shop all products</a>
        </div>
      </section>
    </main>
  );
}
