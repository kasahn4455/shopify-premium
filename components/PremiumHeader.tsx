"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";

export default function PremiumHeader({ storeName, categories }: { storeName: string; categories: string[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <>
      <header className={scrolled ? "editorialHeader isScrolled" : "editorialHeader"}>
        <div className="editorialHeaderMain shell">
          <button className="editorialMenuButton" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(v => !v)}>{open ? <X size={18}/> : <Menu size={18}/>}<span>Menu</span></button>
          <Link href="/" className="editorialBrand">{storeName}</Link>
          <div className="editorialHeaderActions"><a href="#shop">Shop</a><button aria-label="Search"><Search size={17}/></button></div>
        </div>
        <div className="editorialCategoryNav shell">
          <a href="#shop">New & selected</a>
          {categories.slice(0,6).map(category => <a key={category} href={"#cat-" + encodeURIComponent(category)}>{category}</a>)}
          <a href="#story">Journal</a>
        </div>
      </header>

      <div className={open ? "editorialDrawer open" : "editorialDrawer"}>
        <div className="editorialDrawerInner">
          <div className="drawerKicker">Raheem Ventures</div>
          <nav>
            <a href="#shop" onClick={() => setOpen(false)}>New & selected</a>
            {categories.slice(0,8).map(category => <a key={category} href={"#cat-" + encodeURIComponent(category)} onClick={() => setOpen(false)}>{category}</a>)}
          </nav>
          <div className="drawerMeta"><span>Curated in the UK</span><span>Secure Shopify checkout</span></div>
        </div>
      </div>
    </>
  );
}