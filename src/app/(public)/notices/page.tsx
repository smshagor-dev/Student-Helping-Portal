import Link from "next/link";
import { Bell } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { NoticeListItem } from "@/components/shared/notice-list-item";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { noticeTypeLabel } from "@/lib/content-meta";
import type { NoticeType } from "@prisma/client";

const PAGE_SIZE = 10;

export const metadata = { title: "Notices" };

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where = {
    status: "PUBLISHED" as const,
    ...(params.type ? { noticeType: params.type as NoticeType } : {}),
  };

  const [notices, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: { publishDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.notice.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildHref(overrides: { type?: string; page?: number }) {
    const sp = new URLSearchParams();
    const type = overrides.type !== undefined ? overrides.type : params.type;
    if (type) sp.set("type", type);
    if (overrides.page && overrides.page !== 1) sp.set("page", String(overrides.page));
    const qs = sp.toString();
    return `/notices${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Notices</h1>
        <p className="text-muted-foreground mt-1">
          University, exam, scholarship, and general notices.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link href={buildHref({ type: "" })}>
          <Badge variant={!params.type ? "default" : "outline"} className="cursor-pointer">
            All
          </Badge>
        </Link>
        {Object.entries(noticeTypeLabel).map(([key, label]) => (
          <Link key={key} href={buildHref({ type: key })}>
            <Badge variant={params.type === key ? "default" : "outline"} className="cursor-pointer">
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      {notices.length > 0 ? (
        <>
          <div className="space-y-3">
            {notices.map((notice) => (
              <NoticeListItem key={notice.id} notice={notice} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={(p) => buildHref({ page: p })}
          />
        </>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notices found"
          description="Check back later for new announcements."
        />
      )}
    </div>
  );
}
