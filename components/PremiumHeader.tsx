"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export default function PremiumHeader({ storeName }: { storeName: string }) {
  const categories = ["Home","Kitchen","Cleaning","Laundry","Car","Tech","Travel","Toys","Pets","Gifts"];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
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
      <header className={scrolled ? "siteHeader shell isScrolled" : "siteHeader shell"}>
        <div className="headerMainRow">
          <Link href="/" className="brandMark mrkBrand" aria-label={storeName}>
            <img className="brandLogo" src="/mrk-logo.svg" alt={storeName}/>
          </Link>
          <nav className="navLinks" aria-label="Primary navigation">
            <a href="#shop">Shop</a>
            <a href="#story">Our standard</a>
            <a href="#service">Service</a>
          </nav>
          <a href="#shop" className="navCta">Explore <ArrowRight size={14}/></a>
          <button className="mobileMenuButton" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(v => !v)}>
            {open ? <X size={19}/> : <Menu size={19}/>} 
          </button>
        </div>
        <div className="headerCategoryRow" aria-label="Shop categories">
          <a className="categoryLead" href="#shop">All categories</a>
          <div className="categoryDivider" />
          <div className="categoryRail">
            {categories.slice(0, 7).map((category) => (
              <a key={category} href={"#cat-" + encodeURIComponent(category)}>{category}</a>
            ))}
          </div>
          <span className="categoryMeta">Curated / UK</span>
        </div>
      </header>

      <div className={open ? "mobileMenu open" : "mobileMenu"} aria-hidden={!open}>
        <div className="mobileMenuInner">
          <span className="eyebrow">SHOP</span>
          <a href="#shop" onClick={() => setOpen(false)}>All categories <ArrowRight size={18}/></a>
          {categories.slice(0, 5).map((category) => (
            <a key={category} href={"#cat-" + encodeURIComponent(category)} onClick={() => setOpen(false)}>{category} <ArrowRight size={18}/></a>
          ))}
          <div className="mobileMenuMeta"><span>{storeName}</span><span>Curated essentials. Built for everyday life.</span></div>
        </div>
      </div>
    </>
  );
}