import Link from "next/link";
import { LayoutDashboard, Bookmark, User } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getRuntimeDictionary } from "@/lib/i18n";
import { requireAuth } from "@/lib/session";
import { getCurrentLanguage } from "@/lib/site-settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const currentLanguage = await getCurrentLanguage();
  const dict = await getRuntimeDictionary(currentLanguage);

  const links = [
    { href: "/dashboard", label: dict.dashboard.overview, icon: LayoutDashboard },
    { href: "/dashboard/bookmarks", label: dict.dashboard.bookmarks, icon: Bookmark },
    { href: "/dashboard/profile", label: dict.dashboard.profile, icon: User },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container py-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </aside>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
