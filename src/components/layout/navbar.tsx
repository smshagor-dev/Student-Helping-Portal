import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { getActiveLanguages, getCurrentLanguage, getSiteSettings } from "@/lib/site-settings";
import { getRuntimeDictionary } from "@/lib/i18n";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const session = await auth();
  const [settings, currentLanguage, languages] = await Promise.all([
    getSiteSettings(),
    getCurrentLanguage(),
    getActiveLanguages(),
  ]);
  const dict = await getRuntimeDictionary(currentLanguage);

  const navLinks = [
    { href: "/resources", label: dict.nav.resources },
    { href: "/academic", label: dict.nav.academic },
    { href: "/guides", label: dict.nav.guides },
    { href: "/downloads", label: dict.nav.downloads },
    { href: "/notices", label: dict.nav.notices },
    { href: "/articles", label: dict.nav.articles },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
          <GraduationCap className="h-6 w-6" />
          <span className="hidden sm:inline">{settings.siteName}</span>
          <span className="sm:hidden">SHP</span>
        </Link>
        <NavbarClient
          links={navLinks}
          session={session}
          labels={dict.nav}
          languages={languages}
          currentLanguage={currentLanguage}
        />
      </div>
    </header>
  );
}
