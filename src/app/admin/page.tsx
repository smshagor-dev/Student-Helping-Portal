import Link from "next/link";
import { Users, FileText, Bell, Newspaper, Download, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateShort } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalResources,
    totalNotices,
    totalArticles,
    totalDownloads,
    recentMessages,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resource.count(),
    prisma.notice.count(),
    prisma.article.count(),
    prisma.download.count(),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "bg-blue-50 text-blue-700" },
    { label: "Total Resources", value: totalResources, icon: FileText, color: "bg-emerald-50 text-emerald-700" },
    { label: "Total Notices", value: totalNotices, icon: Bell, color: "bg-amber-50 text-amber-700" },
    { label: "Total Articles", value: totalArticles, icon: Newspaper, color: "bg-purple-50 text-purple-700" },
    { label: "Total Downloads", value: totalDownloads, icon: Download, color: "bg-rose-50 text-rose-700" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Overview of your Student Helping Portal content and activity.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className={`rounded-full p-2.5 w-fit mb-3 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5" /> Recent Contact Messages
        </h2>
        <Link href="/admin/messages" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>

      {recentMessages.length > 0 ? (
        <div className="space-y-3">
          {recentMessages.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{msg.name}</p>
                    {!msg.isRead && <Badge variant="accent" className="text-xs">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDateShort(msg.createdAt)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Mail} title="No messages yet" />
      )}
    </div>
  );
}
