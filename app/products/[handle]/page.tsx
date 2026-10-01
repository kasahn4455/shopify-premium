export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Box, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import VariantBuy from "@/components/VariantBuy";
import ProductGallery from "@/components/ProductGallery";
import PremiumHeader from "@/components/PremiumHeader";
import TiltProductCard from "@/components/TiltProductCard";
import { getProduct, getProducts, getShopifyDomain, type Product } from "@/lib/shopify";

type PageProps = { params: Promise<{ handle: string }> };

function money(product: Product) {
  const variant = product.variants.edges[0]?.node;
  if (!variant) return "";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: variant.price.currencyCode
  }).format(Number(variant.price.amount));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product unavailable | MRK Ventures" };

  const description = product.description || "A useful everyday product from MRK Ventures.";
  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      type: "website",
      images: product.featuredImage ? [{ url: product.featuredImage.url, alt: product.featuredImage.altText || product.title }] : []
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: product.featuredImage ? [product.featuredImage.url] : []
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(handle),
    getProducts(12).catch(() => [] as Product[])
  ]);

  if (!product) {
    return (
      <main className="notFound shell">
        <span className="eyebrow">PRODUCT UNAVAILABLE</span>
        <h1>This product is no longer available.</h1>
        <Link href="/" className="primaryButton">Back to MRK Ventures</Link>
      </main>
    );
  }

  const variants = product.variants.edges.map(edge => edge.node);
  const galleryImages = product.images?.length ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const firstVariant = variants[0];
  const related = allProducts.filter(item => item.handle !== product.handle).slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: galleryImages.map(image => image.url),
    brand: { "@type": "Brand", name: "MRK Ventures" },
    offers: firstVariant ? {
      "@type": "Offer",
      priceCurrency: firstVariant.price.currencyCode,
      price: firstVariant.price.amount,
      availability: firstVariant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    } : undefined
  };

  return (
    <div className="kismaInspired pdpRetail">
      <div className="kismaAnnouncement">
        Secure Shopify checkout <span>·</span> UK delivery options <span>·</span> Simple returns
      </div>
      <PremiumHeader storeName="MRK Ventures" />

      <main className="productPage shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
        />

        <div className="pdpBreadcrumb">
          <Link href="/"><ArrowLeft size={14}/> Shop</Link>
          <span>/</span>
          <span>{product.productType || "Product"}</span>
        </div>

        <div className="productDetail">
          <div className="detailVisual">
            <ProductGallery images={galleryImages} title={product.title} />
          </div>

          <div className="detailCopy">
            <span className="kismaEyebrow">MRK Ventures · Everyday utility</span>
            <h1>{product.title}</h1>
            <p className="productDescription">
              {product.description || "A useful everyday product selected for practical function, straightforward value and easy daily use."}
            </p>

            <VariantBuy variants={variants} shopDomain={getShopifyDomain()} />

            <div className="productAssurance">
              <div><ShieldCheck size={18}/><span><strong>Secure checkout</strong><small>Payments handled through Shopify</small></span></div>
              <div><Truck size={18}/><span><strong>UK delivery</strong><small>Options shown clearly at checkout</small></span></div>
              <div><RotateCcw size={18}/><span><strong>Simple returns</strong><small>Clear support after purchase</small></span></div>
              <div><Headphones size={18}/><span><strong>Customer support</strong><small>Help with product and order questions</small></span></div>
            </div>
          </div>
        </div>

        <section className="pdpLifestyle">
          <Image
            src="/lifestyle/mrk-everyday.webp"
            alt="Bright premium everyday essentials lifestyle scene"
            fill
            sizes="100vw"
          />
          <div className="pdpLifestyleShade"/>
          <div className="pdpLifestyleCopy">
            <span>MRK / EVERYDAY EDIT</span>
            <h2>Useful things should fit naturally into real life.</h2>
            <p>That is the standard behind the MRK edit: practical choices, clear information and a simple route from product to checkout.</p>
            <Link href="/#shop">Continue shopping <ArrowRight size={15}/></Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="pdpRelated">
            <div className="kismaSectionHead">
              <h2>You may also like</h2>
              <Link href="/#shop">View all <ArrowRight size={14}/></Link>
            </div>
            <div className="kismaProductGrid pdpRelatedGrid">
              {related.map((item, index) => {
                const variant = item.variants.edges[0]?.node;
                return (
                  <TiltProductCard
                    key={item.id}
                    index={index}
                    handle={item.handle}
                    title={item.title}
                    image={item.featuredImage?.url}
                    alt={item.featuredImage?.altText}
                    price={variant ? money(item) : undefined}
                    available={Boolean(variant?.availableForSale)}
                  />
                );
              })}
            </div>
          </section>
        )}

        <section className="pdpShopperNote">
          <div><Box size={20}/><strong>Clear product information</strong><span>No marketplace clutter.</span></div>
          <div><ShieldCheck size={20}/><strong>Secure payment handoff</strong><span>Shopify checkout infrastructure.</span></div>
          <div><Truck size={20}/><strong>Delivery clarity</strong><span>Final options and costs shown before payment.</span></div>
        </section>
      </main>
    </div>
  );
}
