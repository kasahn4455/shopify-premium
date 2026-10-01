import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const merchandiseId = typeof body?.merchandiseId === "string" ? body.merchandiseId : "";
    const quantity = Number.isInteger(body?.quantity) ? Math.max(1, Math.min(20, body.quantity)) : 1;

    if (!merchandiseId) {
      return NextResponse.json({ error: "A valid product option is required." }, { status: 400 });
    }

    const data = await shopifyFetch<{
      cartCreate: {
        cart: { checkoutUrl: string } | null;
        userErrors: Array<{ field?: string[]; message: string }>;
      };
    }>(
      `mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { field message }
        }
      }`,
      { lines: [{ merchandiseId, quantity }] }
    );

    if (data.cartCreate.userErrors.length) {
      return NextResponse.json({ error: data.cartCreate.userErrors[0].message }, { status: 400 });
    }

    const checkoutUrl = data.cartCreate.cart?.checkoutUrl;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Checkout could not be created. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout" },
      { status: 500 }
    );
  }
}
