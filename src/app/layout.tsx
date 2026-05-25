import type { Metadata } from "next";
import HeroContainer from "@/components/HeroContainer";
import Navbar from "@/components/Navbar";
import ThemeProviderWrapper from "@/components/ThemeProvider";
import { PageTransitionProvider } from "@/components/PageTransitionProvider";
import TopLoaderWrapper from "@/components/TopLoaderWrapper";
import BackgroundLayer from "@/components/BackgroundLayer";
import { siteConfig } from "@/lib/config.server";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: siteConfig.title || "MoGuSpace",
  description: siteConfig.description || "A minimal geometric portfolio",
  icons: {
    icon: siteConfig.favicon || "/favicon.png",
  },
  openGraph: {
    title: siteConfig.title || "MoGuSpace",
    description: siteConfig.description || "A minimal geometric portfolio",
    url: siteConfig.siteUrl || undefined,
    siteName: siteConfig.title || "MoGuSpace",
    ...(siteConfig.siteImage && {
      images: [siteConfig.siteImage],
    }),
    locale: siteConfig.siteLocale || "zh-CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title || "MoGuSpace",
    description: siteConfig.description || "A minimal geometric portfolio",
    ...(siteConfig.siteImage && {
      images: [siteConfig.siteImage],
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <ThemeProviderWrapper>
          <TopLoaderWrapper />
          <BackgroundLayer src={siteConfig.background} />
          <Navbar config={siteConfig} />
          <HeroContainer>
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
          </HeroContainer>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}