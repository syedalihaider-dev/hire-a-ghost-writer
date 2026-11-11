import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/content/siteConfig";
import Header from "@/components/Layout/Header/Header";
import Footer from "@/components/Layout/Footer/Footer";
import Preloader from "@/components/Layout/Preloader/Preloader";
import Cursor from "@/components/Layout/Cursor/Cursor";
import ScrollProvider from "@/components/Animation/ScrollProvider";
import QuoteModal from "@/components/Forms/QuoteModal";
import WebGLRoot from "@/components/WebGL/WebGLRoot";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
  display: "swap",
});

const body = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
  preload: false,
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500"],
  display: "swap",
});

const { seo, brand } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: seo.title,
  description: seo.description,
  applicationName: brand.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: brand.name,
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.ogImage.src, width: seo.ogImage.width, height: seo.ogImage.height, alt: brand.name }],
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.ogImage.src] },
  verification: { google: seo.googleSiteVerification },
};

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  colorScheme: "dark light",
};

const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Preloader />
        <ScrollProvider />
        <WebGLRoot />
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <QuoteModal />
        <Cursor />
      </body>
    </html>
  );
}
