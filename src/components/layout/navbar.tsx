import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { getActiveLanguages, getCurrentLanguage, getSiteSettings } from "@/lib/site-settings";
import { getRuntimeDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const session = await auth();
  const [settings, currentLanguage, languages, latestUser] = await Promise.all([
    getSiteSettings(),
    getCurrentLanguage(),
    getActiveLanguages(),
    session?.user?.id
      ? prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true, email: true, image: true, role: true },
        })
      : Promise.resolve(null),
  ]);
  const dict = await getRuntimeDictionary(currentLanguage);
  const displaySession: Session | null =
    session && latestUser
      ? {
          ...session,
          user: {
            ...session.user,
            name: latestUser.name,
            email: latestUser.email,
            image: latestUser.image,
            role: latestUser.role,
          },
        }
      : session;

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
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.siteName}
              className="h-8 w-8 rounded-md object-cover"
            />
          ) : (
            <GraduationCap className="h-6 w-6" />
          )}
          <span className="hidden sm:inline">{settings.siteName}</span>
          <span className="sm:hidden">SHP</span>
        </Link>
        <NavbarClient
          links={navLinks}
          session={displaySession}
          labels={dict.nav}
          languages={languages}
          currentLanguage={currentLanguage}
        />
      </div>
    </header>
  );
}
