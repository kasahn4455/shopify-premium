"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export default function PremiumHeader({ storeName }: { storeName: string }) {
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
        <Link href="/" className="brandMark" aria-label={storeName}>
          <span className="brandMonogram">RV</span>
          <span className="brandWords">{storeName}</span>
        </Link>
        <nav className="navLinks" aria-label="Primary navigation">
          <a href="#shop">Collection</a>
          <a href="#story">Our standard</a>
          <a href="#service">Delivery & returns</a>
        </nav>
        <a href="#shop" className="navCta">Shop now <ArrowRight size={14}/></a>
        <button className="mobileMenuButton" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(v => !v)}>
          {open ? <X size={19}/> : <Menu size={19}/>}
        </button>
      </header>
      <div className={open ? "mobileMenu open" : "mobileMenu"} aria-hidden={!open}>
        <div className="mobileMenuInner">
          <span className="eyebrow">NAVIGATION</span>
          <a href="#shop" onClick={() => setOpen(false)}>Collection <ArrowRight size={18}/></a>
          <a href="#story" onClick={() => setOpen(false)}>Our standard <ArrowRight size={18}/></a>
          <a href="#service" onClick={() => setOpen(false)}>Delivery & returns <ArrowRight size={18}/></a>
          <div className="mobileMenuMeta"><span>Raheem Ventures</span><span>Curated modern utility.</span></div>
        </div>
      </div>
    </>
  );
}