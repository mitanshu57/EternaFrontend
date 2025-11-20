import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axiom Trade - Token Discovery",
  description: "Token trading table with real-time price updates",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  keywords: ["crypto", "tokens", "trading", "real-time", "price updates"],
  authors: [{ name: "Axiom Trade" }],
  creator: "Axiom Trade",
  publisher: "Axiom Trade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Axiom Trade - Token Discovery",
    description: "Token trading table with real-time price updates",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axiom Trade - Token Discovery",
    description: "Token trading table with real-time price updates",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

