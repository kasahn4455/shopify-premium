"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import TiltProductCard from "@/components/TiltProductCard";
import type { Product } from "@/lib/shopify";

const DEPARTMENTS = ["Home","Kitchen","Cleaning","Laundry","Car","Tech","Travel","Toys","Pets","Gifts"] as const;

function money(product: Product) {
  const variant = product.variants.edges[0]?.node;
  if (!variant) return "";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: variant.price.currencyCode }).format(Number(variant.price.amount));
}

function searchable(product: Product) {
  return [product.title, product.description, product.productType, product.vendor].filter(Boolean).join(" ").toLowerCase();
}

function matchesDepartment(product: Product, department: string) {
  const text = searchable(product);
  const has = (...terms: string[]) => terms.some(term => text.includes(term));
  switch (department) {
    case "Home": return has("household","home","brush","laundry","fan");
    case "Kitchen": return has("kitchen","dish","pot","utensil","soap");
    case "Cleaning": return has("vacuum","clean","brush","washing","laundry");
    case "Laundry": return has("laundry","washing","shoe","trainer");
    case "Car": return has("car","dashboard","windscreen","phone holder","vacuum");
    case "Tech": return has("usb","rechargeable","phone","fan","mount");
    case "Travel": return has("portable","travel","car","neck fan","handheld");
    case "Toys": return has("toy","bunny","plush","fidget","sensory","cube");
    case "Pets": return has("pet","dog","cat","grooming","travel bowl","carrier","crate");
    case "Gifts": return has("gift","bunny","plush","fidget","fan","toy","candle","stationery");
    default: return true;
  }
}

export default function CatalogExperience({ products }: { products: Product[] }) {
  const [active, setActive] = useState("All");
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  const counts = useMemo(() => Object.fromEntries(DEPARTMENTS.map(department => [
    department,
    products.filter(product => matchesDepartment(product, department)).length
  ])), [products]);

  const visible = useMemo(() => {
    const filtered = active === "All" ? products : products.filter(product => matchesDepartment(product, active));
    const next = [...filtered];
    if (sort === "price-low") next.sort((a,b) => Number(a.variants.edges[0]?.node.price.amount || 0) - Number(b.variants.edges[0]?.node.price.amount || 0));
    if (sort === "price-high") next.sort((a,b) => Number(b.variants.edges[0]?.node.price.amount || 0) - Number(a.variants.edges[0]?.node.price.amount || 0));
    if (sort === "name") next.sort((a,b) => a.title.localeCompare(b.title));
    return next;
  }, [active, products, sort]);

  return (
    <div className="catalogExperience">
      <div className="catalogCategoryBar" aria-label="Browse departments">
        <button className={active === "All" ? "active" : ""} onClick={() => setActive("All")}>All <span>{products.length}</span></button>
        {DEPARTMENTS.map(department => (
          <button id={"cat-" + encodeURIComponent(department)} key={department} className={active === department ? "active" : ""} onClick={() => setActive(department)}>
            {department} <span>{counts[department]}</span>
          </button>
        ))}
      </div>

      <div className="catalogToolbar">
        <button className="mobileFilterTrigger" onClick={() => setMobileFilters(v => !v)}><SlidersHorizontal size={15}/> Departments</button>
        <span>{String(visible.length).padStart(2,"0")} products</span>
        <label className="sortControl">Sort
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">A–Z</option>
          </select>
          <ChevronDown size={13}/>
        </label>
      </div>

      <div className="catalogLayout">
        <aside className={mobileFilters ? "catalogSidebar open" : "catalogSidebar"}>
          <div className="sidebarHeading"><span>Shop by</span><strong>Department</strong></div>
          <button className={active === "All" ? "active" : ""} onClick={() => { setActive("All"); setMobileFilters(false); }}><span>View all</span><b>{products.length}</b></button>
          {DEPARTMENTS.map(department => (
            <button key={department} className={active === department ? "active" : ""} onClick={() => { setActive(department); setMobileFilters(false); }}>
              <span>{department}</span><b>{counts[department]}</b>
            </button>
          ))}
          <div className="sidebarNote">
            <span className="eyebrow">CURATED RANGE</span>
            <p>Practical products, grouped simply so you can get to the right thing faster.</p>
          </div>
        </aside>

        {visible.length ? (
          <div className="productGrid premiumGrid catalogGrid">
            {visible.map((product, index) => {
              const variant = product.variants.edges[0]?.node;
              return <TiltProductCard key={product.id} index={index} handle={product.handle} title={product.title} image={product.featuredImage?.url} alt={product.featuredImage?.altText} price={variant ? money(product) : undefined} available={Boolean(variant?.availableForSale)} featured={index < 2 && active === "All"}/>;
            })}
          </div>
        ) : (
          <div className="catalogEmpty">
            <span className="eyebrow">{active}</span>
            <h3>More products are being added here.</h3>
            <p>Browse all products for now, or choose another department.</p>
            <button onClick={() => setActive("All")}>View all products</button>
          </div>
        )}
      </div>
    </div>
  );
}
