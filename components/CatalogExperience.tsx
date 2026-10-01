"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import TiltProductCard from "@/components/TiltProductCard";
import type { Product } from "@/lib/shopify";

function money(product: Product) {
  const variant = product.variants.edges[0]?.node;
  if (!variant) return "";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: variant.price.currencyCode }).format(Number(variant.price.amount));
}

export default function CatalogExperience({ products }: { products: Product[] }) {
  const categories = useMemo(() => Array.from(new Set(products.map(p => (p.productType || "Essentials").trim()).filter(Boolean))), [products]);
  const [active, setActive] = useState("All");
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  const visible = useMemo(() => {
    const filtered = active === "All" ? products : products.filter(p => (p.productType || "Essentials") === active);
    const next = [...filtered];
    if (sort === "price-low") next.sort((a,b) => Number(a.variants.edges[0]?.node.price.amount || 0) - Number(b.variants.edges[0]?.node.price.amount || 0));
    if (sort === "price-high") next.sort((a,b) => Number(b.variants.edges[0]?.node.price.amount || 0) - Number(a.variants.edges[0]?.node.price.amount || 0));
    if (sort === "name") next.sort((a,b) => a.title.localeCompare(b.title));
    return next;
  }, [active, products, sort]);

  return (
    <div className="catalogExperience">
      <div className="catalogCategoryBar">
        <button className={active === "All" ? "active" : ""} onClick={() => setActive("All")}>All <span>{products.length}</span></button>
        {categories.map(category => {
          const count = products.filter(p => (p.productType || "Essentials") === category).length;
          return <button id={"cat-" + encodeURIComponent(category)} key={category} className={active === category ? "active" : ""} onClick={() => setActive(category)}>{category} <span>{count}</span></button>;
        })}
      </div>

      <div className="catalogToolbar">
        <button className="mobileFilterTrigger" onClick={() => setMobileFilters(v => !v)}><SlidersHorizontal size={15}/> Categories</button>
        <span>{String(visible.length).padStart(2,"0")} objects</span>
        <label className="sortControl">Sort
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
          <ChevronDown size={13}/>
        </label>
      </div>

      <div className="catalogLayout">
        <aside className={mobileFilters ? "catalogSidebar open" : "catalogSidebar"}>
          <div className="sidebarHeading"><span>Browse by</span><strong>Category</strong></div>
          <button className={active === "All" ? "active" : ""} onClick={() => { setActive("All"); setMobileFilters(false); }}><span>All objects</span><b>{products.length}</b></button>
          {categories.map(category => {
            const count = products.filter(p => (p.productType || "Essentials") === category).length;
            return <button key={category} className={active === category ? "active" : ""} onClick={() => { setActive(category); setMobileFilters(false); }}><span>{category}</span><b>{count}</b></button>;
          })}
          <div className="sidebarNote">
            <span className="eyebrow">THE EDIT</span>
            <p>Each category is intentionally compact: fewer products, stronger selection.</p>
          </div>
        </aside>

        <div className="productGrid premiumGrid catalogGrid">
          {visible.map((product, index) => {
            const variant = product.variants.edges[0]?.node;
            return <TiltProductCard key={product.id} index={index} handle={product.handle} title={product.title} image={product.featuredImage?.url} alt={product.featuredImage?.altText} price={variant ? money(product) : undefined} available={Boolean(variant?.availableForSale)} featured={index < 2 && active === "All"}/>;
          })}
        </div>
      </div>
    </div>
  );
}