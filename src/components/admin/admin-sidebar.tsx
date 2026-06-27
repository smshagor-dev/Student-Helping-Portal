"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Building2,
  BookOpen,
  FileText,
  Bell,
  Newspaper,
  Download,
  Compass,
  CalendarDays,
  ClipboardList,
  Mail,
  Users,
  Languages,
  Settings,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLabels {
  panel: string;
  overview: string;
  taxonomy: string;
  content: string;
  academics: string;
  administration: string;
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
  backToSite: string;
}

export function AdminSidebar({ labels }: { labels: AdminLabels }) {
  const pathname = usePathname();

  const navGroups = [
    {
      label: labels.overview,
      items: [{ href: "/admin", label: labels.dashboard, icon: LayoutDashboard }],
    },
    {
      label: labels.taxonomy,
      items: [
        { href: "/admin/categories", label: labels.categories, icon: FolderTree },
        { href: "/admin/departments", label: labels.departments, icon: Building2 },
        { href: "/admin/subjects", label: labels.subjects, icon: BookOpen },
      ],
    },
    {
      label: labels.content,
      items: [
        { href: "/admin/resources", label: labels.resources, icon: FileText },
        { href: "/admin/notices", label: labels.notices, icon: Bell },
        { href: "/admin/articles", label: labels.articles, icon: Newspaper },
        { href: "/admin/downloads", label: labels.downloads, icon: Download },
        { href: "/admin/guides", label: labels.guides, icon: Compass },
      ],
    },
    {
      label: labels.academics,
      items: [
        { href: "/admin/calendar", label: labels.academicCalendar, icon: CalendarDays },
        { href: "/admin/exams", label: labels.examSchedule, icon: ClipboardList },
      ],
    },
    {
      label: labels.administration,
      items: [
        { href: "/admin/messages", label: labels.messages, icon: Mail },
        { href: "/admin/users", label: labels.users, icon: Users },
        { href: "/admin/languages", label: labels.languages, icon: Languages },
        { href: "/admin/settings", label: labels.settings, icon: Settings },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-card h-screen sticky top-0 overflow-y-auto">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="font-display font-semibold">{labels.panel}</span>
      </div>
      <nav className="flex-1 space-y-6 p-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {labels.backToSite}
        </Link>
      </div>
    </aside>
  );
}
