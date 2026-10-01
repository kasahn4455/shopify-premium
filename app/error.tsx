"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="notFound shell">
      <span className="eyebrow">STORE TEMPORARILY UNAVAILABLE</span>
      <h1>Something interrupted this page.</h1>
      <p>The storefront is still intact. Retry the page to continue.</p>
      <button className="primaryButton" onClick={reset}>Try again</button>
    </main>
  );
}