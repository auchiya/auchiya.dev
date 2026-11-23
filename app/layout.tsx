import type { Metadata } from "next";
import { Archivo, Inter, PT_Serif } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";
import { Analytics } from "./components/Analytics";
import { ConsentBanner } from "./components/ConsentBanner";
import { SiteShell } from "./components/SiteShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Agustin Uchiya (打矢 アグスティン) — Software Engineer",
    template: "%s — Agustin Uchiya",
  },
  description: "Personal site of Agustin Uchiya, a full-stack software engineer.",
  manifest: "/site.webmanifest",
  // Resolved against metadataBase, so relative paths become absolute URLs.
  // Page-level title/description are inherited into og/twitter by Next.js.
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        type: "image/webp",
        alt: `${site.name} — Software Engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: `${site.name} — Software Engineer`,
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

/**
 * FOUC prevention only: sync the <meta> with a stored override before paint.
 * CSS maps the meta back to `color-scheme` and all color tokens, so no class
 * toggling (and no JS) is needed for the page to render in the right scheme.
 * Kept inline, not module/defer, and deliberately minimal.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("color-scheme") || localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      document.querySelector('meta[name="color-scheme"]').content = stored;
    }
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} ${archivo.variable}`}>
      <head>
        <meta name="color-scheme" content="light dark" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Analytics />
        <ConsentBanner />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
