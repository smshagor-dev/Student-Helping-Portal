import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { noticeTypeLabel } from "@/lib/content-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notice = await prisma.notice.findUnique({ where: { slug } });
  if (!notice) return {};
  return { title: notice.title };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notice = await prisma.notice.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!notice || notice.status !== "PUBLISHED") {
    notFound();
  }

  const isExpired = notice.expiryDate && new Date(notice.expiryDate) < new Date();

  return (
    <div className="container py-10 max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{noticeTypeLabel[notice.noticeType]}</Badge>
        {notice.category && <Badge variant="outline">{notice.category.name}</Badge>}
        {isExpired && (
          <Badge variant="outline" className="gap-1">
            <AlertTriangle className="h-3 w-3" /> Expired
          </Badge>
        )}
      </div>

      <h1 className="font-display text-3xl font-semibold leading-tight">
        {notice.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" /> Published {formatDate(notice.publishDate)}
        </span>
        {notice.expiryDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Expires {formatDate(notice.expiryDate)}
          </span>
        )}
      </div>

      <Separator className="my-6" />

      <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed text-foreground/90">
        {notice.content}
      </div>

      <div className="mt-8">
        <Link href="/notices" className="text-sm text-primary hover:underline">
          ← Back to all notices
        </Link>
      </div>
    </div>
  );
}
