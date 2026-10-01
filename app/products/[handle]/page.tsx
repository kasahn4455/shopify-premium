export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Box, ShieldCheck, Sparkles, Truck } from "lucide-react";
import VariantBuy from "@/components/VariantBuy";
import ProductGallery from "@/components/ProductGallery";
import { getProduct, getShopifyDomain } from "@/lib/shopify";

type PageProps = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product unavailable | Raheem Ventures" };
  const description = product.description || "A considered everyday essential from Raheem Ventures.";
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
  const product = await getProduct(handle);
  if (!product) {
    return (
      <main className="notFound shell">
        <span className="eyebrow">PRODUCT UNAVAILABLE</span>
        <h1>This piece is no longer in the current edit.</h1>
        <Link href="/" className="primaryButton">Return to collection</Link>
      </main>
    );
  }

  const variants = product.variants.edges.map(edge => edge.node);
  const galleryImages = product.images?.length ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const firstVariant = variants[0];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: galleryImages.map(image => image.url),
    brand: { "@type": "Brand", name: "Raheem Ventures" },
    offers: firstVariant ? {
      "@type": "Offer",
      priceCurrency: firstVariant.price.currencyCode,
      price: firstVariant.price.amount,
      availability: firstVariant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: "/products/" + product.handle
    } : undefined
  };

  return (
    <main className="productPage shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="productHeader">
        <Link href="/" className="backLink"><ArrowLeft size={15}/> Back to collection</Link>
        <Link href="/" className="brandMark compactBrand">
          <span className="brandMonogram">RV</span>
          <span className="brandWords">Raheem Ventures</span>
        </Link>
      </header>

      <div className="productDetail">
        <div className="detailVisual">
          <ProductGallery images={galleryImages} title={product.title} />
          <span className="detailStamp">CURATED / RV</span>
        </div>

        <div className="detailCopy">
          <span className="eyebrow">RAHEEM VENTURES EDIT</span>
          <h1>{product.title}</h1>
          <p className="productDescription">
            {product.description || "A considered everyday essential selected for useful design, dependable function and a clean finish."}
          </p>

          <VariantBuy variants={variants} shopDomain={getShopifyDomain()} />

          <div className="productAssurance">
            <div><Truck size={18}/><span><strong>Tracked delivery</strong><small>Clear fulfilment updates</small></span></div>
            <div><ShieldCheck size={18}/><span><strong>Secure payment</strong><small>Shopify-powered checkout</small></span></div>
            <div><Box size={18}/><span><strong>Carefully selected</strong><small>Focused product assortment</small></span></div>
            <div><Sparkles size={18}/><span><strong>Premium presentation</strong><small>Designed around the product</small></span></div>
          </div>
        </div>
      </div>

      <section className="productStatement">
        <span className="eyebrow">THE DETAIL MATTERS</span>
        <h2>Designed to make the decision feel simple.</h2>
        <p>Clean information, clear availability and a direct route to secure checkout — without marketplace clutter.</p>
      </section>
    </main>
  );
}