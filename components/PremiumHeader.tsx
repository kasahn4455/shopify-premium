"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";

export default function PremiumHeader({ storeName }: { storeName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      <header className={scrolled ? "kismaHeader isScrolled" : "kismaHeader"}>
        <div className="shell kismaHeaderInner">
          <div className="kismaHeaderLeft">
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="kismaIconButton"><Menu size={18}/></button>
            <nav className="kismaDesktopNav" aria-label="Main navigation">
              <a href="#shop">Shop</a>
              <a href="#new">New Arrivals</a>
              <a href="#categories">Categories</a>
            </nav>
          </div>

          <Link href="/" className="kismaWordmark" aria-label={storeName}>
            <strong>MRK</strong>
            <span>VENTURES</span>
          </Link>

          <div className="kismaHeaderRight">
            <a href="#shop">Shop all</a>
            <a href="#shop" className="kismaIconButton" aria-label="Shop products"><ShoppingBag size={18}/></a>
          </div>
        </div>
      </header>

      <div className={open ? "kismaDrawer open" : "kismaDrawer"} aria-hidden={!open}>
        <div className="kismaDrawerTop">
          <span className="kismaWordmark"><strong>MRK</strong><span>VENTURES</span></span>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="kismaIconButton"><X size={20}/></button>
        </div>
        <nav>
          <a href="#shop" onClick={() => setOpen(false)}>Shop all</a>
          <a href="#new" onClick={() => setOpen(false)}>New arrivals</a>
          <a href="#categories" onClick={() => setOpen(false)}>Categories</a>
          <a href="#service" onClick={() => setOpen(false)}>Delivery & support</a>
        </nav>
      </div>
    </>
  );
}
