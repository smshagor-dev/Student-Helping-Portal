import Link from "next/link";
import { Bell, GraduationCap, Award, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
import { noticeTypeLabel } from "@/lib/content-meta";
import type { Notice } from "@prisma/client";

const noticeIcon = {
  UNIVERSITY: GraduationCap,
  EXAM: Bell,
  SCHOLARSHIP: Award,
  GENERAL: Megaphone,
} as const;

export function NoticeListItem({ notice }: { notice: Notice }) {
  const Icon = noticeIcon[notice.noticeType];
  const isExpired = notice.expiryDate && new Date(notice.expiryDate) < new Date();

  return (
    <Link
      href={`/notices/${notice.slug}`}
      className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-secondary/50"
    >
      <div className="rounded-full bg-primary/10 p-2.5 shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="font-normal text-xs">
            {noticeTypeLabel[notice.noticeType]}
          </Badge>
          {isExpired && (
            <Badge variant="outline" className="font-normal text-xs">
              Expired
            </Badge>
          )}
        </div>
        <h3 className="font-medium leading-snug line-clamp-1">{notice.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Published {formatDateShort(notice.publishDate)}
        </p>
      </div>
    </Link>
  );
}
