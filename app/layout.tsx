import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

// Metadata is sourced from content/site-content.json like everything else.
export async function generateMetadata(): Promise<Metadata> {
  const { meta, personal } = await getContent();
  return {
    title: meta.siteTitle,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: personal.name }],
    metadataBase: new URL(meta.siteUrl),
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.siteUrl,
      siteName: personal.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: meta.ogTitle,
      description: meta.ogDescription,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
