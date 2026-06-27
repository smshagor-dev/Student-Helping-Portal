import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage, getSiteSettings } from "@/lib/site-settings";

const display = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, currentLanguage] = await Promise.all([getSiteSettings(), getCurrentLanguage()]);
  const dict = await getRuntimeDictionary(currentLanguage);
  const siteName = settings.siteName;
  const seoTitle = settings.seoTitle ?? undefined;
  const seoDescription = settings.seoDescription ?? undefined;

  return {
    title: {
      default: seoTitle || siteName,
      template: `%s | ${siteName}`,
    },
    description: seoDescription || dict.footer.description,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentLanguage = await getCurrentLanguage();

  return (
    <html lang={currentLanguage} suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
