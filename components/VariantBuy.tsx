"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};

export default function VariantBuy({
  variants,
  shopDomain
}: {
  variants: Variant[];
  shopDomain: string;
}) {
  const available = variants.find(v => v.availableForSale) || variants[0];
  const [selectedId, setSelectedId] = useState(available?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => variants.find(v => v.id === selectedId) || available,
    [variants, selectedId, available]
  );

  if (!selected) return null;

  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: selected.price.currencyCode
  }).format(Number(selected.price.amount));

  async function checkout() {
    if (!selected.availableForSale) return;
    setLoading(true);
    try {
      if (/^\d+$/.test(selected.id)) {
        window.location.href = `https://${shopDomain}/cart/${selected.id}:${quantity}`;
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: selected.id, quantity })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to create checkout");
      window.location.href = data.checkoutUrl;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="buyModule">
      <div className="buyPriceRow">
        <span className="buyPrice">{price}</span>
        <span className={selected.availableForSale ? "stock inStock" : "stock outStock"}>
          <Check size={13}/> {selected.availableForSale ? "In stock" : "Sold out"}
        </span>
      </div>

      {variants.length > 1 && (
        <div className="variantBlock">
          <label>Choose option</label>
          <div className="variantPills">
            {variants.map(variant => (
              <button
                key={variant.id}
                className={variant.id === selected.id ? "variantPill active" : "variantPill"}
                onClick={() => setSelectedId(variant.id)}
                disabled={!variant.availableForSale}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="purchaseRow">
        <div className="quantityPicker">
          <button aria-label="Decrease quantity" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={14}/></button>
          <span>{quantity}</span>
          <button aria-label="Increase quantity" onClick={() => setQuantity(q => q + 1)}><Plus size={14}/></button>
        </div>
        <button className="primaryButton buyNow" disabled={!selected.availableForSale || loading} onClick={checkout}>
          <ShoppingBag size={17}/>
          {loading ? "Preparing checkout…" : "Buy now"}
        </button>
      </div>

      <div className="checkoutNotes">
        <span>Secure checkout</span>
        <span>Tracked delivery</span>
        <span>Simple returns</span>
      </div>
    </div>
  );
}
