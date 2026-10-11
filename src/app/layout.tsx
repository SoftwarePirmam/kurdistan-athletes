import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import { Providers } from "@/components/providers";
import { PresenceHeartbeat } from "@/components/presence-heartbeat";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Kurdistan Athletes",
    template: "%s | Kurdistan Athletes",
  },
  description:
    "A platform created to support, connect, and inspire athletes across Kurdistan.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://kurdistanathletes.com"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getPageContent("site");

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..100,500..900&family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <PresenceHeartbeat />
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <SiteHeader brand={site.brand_name || "KURDISTAN ATHLETES"} />
          {children}
          <SiteFooter
            brand={site.brand_name || "KURDISTAN ATHLETES"}
            tagline={site.footer_tagline || ""}
            copyright={site.footer_copyright || ""}
          />
        </Providers>
      </body>
    </html>
  );
}
