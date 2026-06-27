import Link from "next/link";
import {
  Search,
  BookOpen,
  Bell,
  Download,
  Compass,
  Calendar,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "@/components/shared/resource-card";
import { NoticeListItem } from "@/components/shared/notice-list-item";
import { ArticleCard } from "@/components/shared/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage } from "@/lib/site-settings";

export default async function HomePage() {
  const currentLanguage = await getCurrentLanguage();
  const dict = await getRuntimeDictionary(currentLanguage);

  const quickLinks = [
    { href: "/resources", label: dict.home.quickLinks.resources, icon: BookOpen, color: "bg-blue-50 text-blue-700" },
    { href: "/notices", label: dict.home.quickLinks.notices, icon: Bell, color: "bg-amber-50 text-amber-700" },
    { href: "/downloads", label: dict.home.quickLinks.downloads, icon: Download, color: "bg-emerald-50 text-emerald-700" },
    { href: "/guides", label: dict.home.quickLinks.guides, icon: Compass, color: "bg-purple-50 text-purple-700" },
    { href: "/academic", label: dict.home.quickLinks.academic, icon: Calendar, color: "bg-rose-50 text-rose-700" },
  ];

  const [notices, popularResources, latestArticles] = await Promise.all([
    prisma.notice.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishDate: "desc" },
      take: 5,
    }),
    prisma.resource.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true, department: true },
      orderBy: [{ isFeatured: "desc" }, { viewCount: "desc" }],
      take: 6,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-secondary/60 to-background">
        <div className="container py-16 md:py-24 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
            <GraduationCap className="h-4 w-4 text-primary" />
            {dict.home.badge}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            {dict.home.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {dict.home.description}
          </p>
          <form action="/search" className="mt-8 flex max-w-lg mx-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder={dict.nav.mobileSearchPlaceholder}
                className="pl-9 h-11"
              />
            </div>
            <Button type="submit" size="lg" className="h-11">
              {dict.home.search}
            </Button>
          </form>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 rounded-lg border bg-card p-5 text-center transition-shadow hover:shadow-md"
              >
                <div className={`rounded-full p-3 ${link.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container py-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-semibold">{dict.home.popularResources}</h2>
            <Link href="/resources" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              {dict.home.viewAll} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {popularResources.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {popularResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title={dict.home.noResources}
              description={dict.home.noResourcesDescription}
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-semibold">{dict.home.latestNotices}</h2>
            <Link href="/notices" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              {dict.home.viewAll} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {notices.length > 0 ? (
            <div className="space-y-3">
              {notices.map((notice) => (
                <NoticeListItem key={notice.id} notice={notice} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title={dict.home.noNotices}
              description={dict.home.noNoticesDescription}
            />
          )}
        </div>
      </section>

      <section className="container py-10 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-semibold">{dict.home.latestArticles}</h2>
          <Link href="/articles" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            {dict.home.viewAll} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {latestArticles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title={dict.home.noArticles}
            description={dict.home.noArticlesDescription}
          />
        )}
      </section>
    </div>
  );
}
