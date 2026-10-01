import type { Metadata, Viewport } from "next";
import "./globals.css";

const storeName = "MRK Ventures";
const description = "Curated essentials for home, tech, travel and everyday life.";

export const metadata: Metadata = {
  title: { default: storeName, template: `%s | ${storeName}` },
  description,
  applicationName: storeName,
  category: "shopping",
  robots: { index: true, follow: true },
  openGraph: { title: storeName, description, type: "website", siteName: storeName },
  twitter: { card: "summary_large_image", title: storeName, description }
};

export const viewport: Viewport = {
  themeColor: "#f3efe5",
  colorScheme: "light"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skipLink">Skip to content</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}