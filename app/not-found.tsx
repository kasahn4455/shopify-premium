import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notFound shell">
      <span className="eyebrow">404 / NOT FOUND</span>
      <h1>The page you’re looking for isn’t part of this edit.</h1>
      <p>Return to the collection and continue browsing.</p>
      <Link href="/" className="primaryButton">Back to Raheem Ventures</Link>
    </main>
  );
}