"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, LogOut } from "lucide-react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { cn } from "@/lib/utils";

interface AdminLabels {
  panel: string;
  dashboard: string;
  categories: string;
  departments: string;
  subjects: string;
  resources: string;
  notices: string;
  articles: string;
  downloads: string;
  guides: string;
  academicCalendar: string;
  examSchedule: string;
  messages: string;
  users: string;
  languages: string;
  settings: string;
  openMenu: string;
  logout: string;
  detail: string;
}

interface CommonLabels {
  home: string;
}

export function AdminTopbar({
  session,
  labels,
  common,
}: {
  session: Session | null;
  labels: AdminLabels;
  common: CommonLabels;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const flatLinks = [
    { href: "/admin", label: labels.dashboard },
    { href: "/admin/categories", label: labels.categories },
    { href: "/admin/departments", label: labels.departments },
    { href: "/admin/subjects", label: labels.subjects },
    { href: "/admin/resources", label: labels.resources },
    { href: "/admin/notices", label: labels.notices },
    { href: "/admin/articles", label: labels.articles },
    { href: "/admin/downloads", label: labels.downloads },
    { href: "/admin/guides", label: labels.guides },
    { href: "/admin/calendar", label: labels.academicCalendar },
    { href: "/admin/exams", label: labels.examSchedule },
    { href: "/admin/messages", label: labels.messages },
    { href: "/admin/users", label: labels.users },
    { href: "/admin/languages", label: labels.languages },
    { href: "/admin/settings", label: labels.settings },
  ];

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label={labels.openMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Breadcrumbs homeLabel={common.home} detailLabel={labels.detail} />
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" /> {labels.logout}
          </Button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-card p-4 overflow-y-auto">
            <p className="mb-4 font-display font-semibold">{labels.panel}</p>
            <nav className="space-y-1">
              {flatLinks.map((link) => {
                const active =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
