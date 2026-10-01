export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Box, ShieldCheck, Sparkles, Truck } from "lucide-react";
import VariantBuy from "@/components/VariantBuy";
import { getProduct, getShopifyDomain } from "@/lib/shopify";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
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

  return (
    <main className="productPage shell">
      <header className="productHeader">
        <Link href="/" className="backLink"><ArrowLeft size={15}/> Back to collection</Link>
        <Link href="/" className="brandMark compactBrand">
          <span className="brandMonogram">RV</span>
          <span className="brandWords">Raheem Ventures</span>
        </Link>
      </header>

      <div className="productDetail">
        <div className="detailVisual">
          <div className="detailImage">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                priority
                sizes="(max-width: 850px) 100vw, 58vw"
              />
            ) : (
              <div className="imageFallback large">RV</div>
            )}
          </div>
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
