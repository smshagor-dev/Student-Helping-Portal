import Link from "next/link";
import { Bookmark, FileText, Bell, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import { NoticeListItem } from "@/components/shared/notice-list-item";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [bookmarkCount, recentNotices] = await Promise.all([
    prisma.bookmark.count({ where: { userId: user.id } }),
    prisma.notice.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishDate: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">
        Welcome back, {user.name?.split(" ")[0]}
      </h1>
      <p className="text-muted-foreground mb-8">
        Here&apos;s a quick look at your saved items and recent updates.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Bookmark className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{bookmarkCount}</p>
              <p className="text-sm text-muted-foreground">Saved items</p>
            </div>
          </CardContent>
        </Card>
        <Link href="/resources">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-accent/15 p-3">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-medium">Browse Study Resources</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" /> Recent Notices
        </h2>
        <Link href="/notices" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      {recentNotices.length > 0 ? (
        <div className="space-y-3">
          {recentNotices.map((notice) => (
            <NoticeListItem key={notice.id} notice={notice} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Bell} title="No notices yet" />
      )}
    </div>
  );
}
