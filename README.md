# Shopify Premium Store

Standalone reusable headless Shopify storefront built with Next.js for Vercel.

## Included

- Premium responsive storefront
- Shopify Storefront API product feed
- Product detail pages
- Shopify cart creation
- Shopify-hosted checkout
- Vercel-ready configuration
- No Lovable dependency

## Environment variables

Add these in Vercel:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NEXT_PUBLIC_STORE_NAME=Your Store
NEXT_PUBLIC_STORE_TAGLINE=Your tagline
```

## Deploy

Import the repository directly into Vercel. No custom Root Directory is required because the Next.js app is at the repository root.

For another store, duplicate this repository, change the Shopify credentials and branding variables, then deploy it as a separate Vercel project.
