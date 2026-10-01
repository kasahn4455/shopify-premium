const domain = process.env.SHOPIFY_STORE_DOMAIN || "v7ct1b-qn.myshopify.com";
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export type ProductImage = { url: string; altText?: string | null };

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: ProductImage;
  images?: ProductImage[];
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }>;
  };
};

type StorefrontProduct = Omit<Product, "images"> & {
  images: { edges: Array<{ node: ProductImage }> };
};

type AjaxImage = string | { src?: string; url?: string; alt?: string | null; altText?: string | null };
type AjaxProduct = {
  id: number;
  handle: string;
  title: string;
  body_html?: string;
  image?: AjaxImage;
  featured_image?: string;
  images?: AjaxImage[];
  variants: Array<{ id: number; title: string; available: boolean; price: string | number }>;
};

function normalizeImage(image: AjaxImage | undefined, fallbackAlt: string): ProductImage | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return { url: image, altText: fallbackAlt };
  const url = image.url || image.src;
  if (!url) return undefined;
  return { url, altText: image.altText || image.alt || fallbackAlt };
}

function normalizeAjaxPrice(value: string | number) {
  if (typeof value === "number") return (value / 100).toFixed(2);
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0.00";
  return numeric.toFixed(2);
}

function normalize(product: AjaxProduct): Product {
  const allImages = (product.images || []).map(image => normalizeImage(image, product.title)).filter(Boolean) as ProductImage[];
  const featured = normalizeImage(product.image, product.title) ||
    (product.featured_image ? { url: product.featured_image, altText: product.title } : undefined) ||
    allImages[0];

  return {
    id: String(product.id),
    handle: product.handle,
    title: product.title,
    description: (product.body_html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    featuredImage: featured,
    images: allImages.length ? allImages : featured ? [featured] : [],
    variants: {
      edges: product.variants.map((variant) => ({
        node: {
          id: String(variant.id),
          title: variant.title,
          availableForSale: variant.available,
          price: { amount: normalizeAjaxPrice(variant.price), currencyCode: "GBP" }
        }
      }))
    }
  };
}

async function publicProducts(first = 12): Promise<Product[]> {
  const response = await fetch("https://" + domain + "/products.json?limit=" + first, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error("Unable to load Shopify products");
  const json = await response.json() as { products: AjaxProduct[] };
  return json.products.map(normalize);
}

async function publicProduct(handle: string): Promise<Product | null> {
  const response = await fetch("https://" + domain + "/products/" + handle + ".js", { next: { revalidate: 60 } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load Shopify product");
  return normalize(await response.json() as AjaxProduct);
}

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!token) throw new Error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  const response = await fetch("https://" + domain + "/api/2026-07/graphql.json", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }
  });
  const json = await response.json();
  if (!response.ok || json.errors) throw new Error(JSON.stringify(json.errors || json));
  return json.data as T;
}

export async function getProducts(first = 12) {
  if (!token) return publicProducts(first);
  const data = await shopifyFetch<{ products: { edges: Array<{ node: StorefrontProduct }> } }>(
    "query Products($first: Int!) { products(first: $first, sortKey: BEST_SELLING) { edges { node { id handle title description featuredImage { url altText } images(first: 6) { edges { node { url altText } } } variants(first: 10) { edges { node { id title availableForSale price { amount currencyCode } } } } } } } }",
    { first }
  );
  return data.products.edges.map(({ node }) => ({ ...node, images: node.images.edges.map(edge => edge.node) })) as Product[];
}

export async function getProduct(handle: string) {
  if (!token) return publicProduct(handle);
  const data = await shopifyFetch<{ product: StorefrontProduct | null }>(
    "query Product($handle: String!) { product(handle: $handle) { id handle title description featuredImage { url altText } images(first: 8) { edges { node { url altText } } } variants(first: 25) { edges { node { id title availableForSale price { amount currencyCode } } } } } }",
    { handle }
  );
  if (!data.product) return null;
  const raw = data.product;
  const images = raw.images.edges.map(edge => edge.node);
  return { ...raw, images: images.length ? images : raw.featuredImage ? [raw.featuredImage] : [] } as Product;
}

export function getShopifyDomain() { return domain; }