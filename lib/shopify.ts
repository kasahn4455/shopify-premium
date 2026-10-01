const domain = process.env.SHOPIFY_STORE_DOMAIN || "v7ct1b-qn.myshopify.com";
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: { url: string; altText?: string | null };
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

type AjaxProduct = {
  id: number;
  handle: string;
  title: string;
  body_html?: string;
  image?: { src: string; alt?: string | null };
  images?: Array<{ src: string; alt?: string | null }>;
  variants: Array<{ id: number; title: string; available: boolean; price: string }>;
};

function normalize(product: AjaxProduct): Product {
  const image = product.image || product.images?.[0];
  return {
    id: String(product.id),
    handle: product.handle,
    title: product.title,
    description: (product.body_html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    featuredImage: image ? { url: image.src, altText: image.alt || product.title } : undefined,
    variants: {
      edges: product.variants.map((variant) => ({
        node: {
          id: String(variant.id),
          title: variant.title,
          availableForSale: variant.available,
          price: { amount: variant.price, currencyCode: "GBP" }
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
  const response = await fetch("https://" + domain + "/api/2025-07/graphql.json", {
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
  const data = await shopifyFetch<{ products: { edges: Array<{ node: Product }> } }>(
    "query Products($first: Int!) { products(first: $first, sortKey: BEST_SELLING) { edges { node { id handle title description featuredImage { url altText } variants(first: 10) { edges { node { id title availableForSale price { amount currencyCode } } } } } } } }",
    { first }
  );
  return data.products.edges.map(({ node }) => node);
}

export async function getProduct(handle: string) {
  if (!token) return publicProduct(handle);
  const data = await shopifyFetch<{ product: Product | null }>(
    "query Product($handle: String!) { product(handle: $handle) { id handle title description featuredImage { url altText } variants(first: 25) { edges { node { id title availableForSale price { amount currencyCode } } } } } }",
    { handle }
  );
  return data.product;
}

export function getShopifyDomain() {
  return domain;
}
