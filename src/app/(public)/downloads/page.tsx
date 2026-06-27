import { Download as DownloadIcon, FileDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DownloadTrackButton } from "@/components/shared/download-track-button";

const PAGE_SIZE = 12;

export const metadata = { title: "Downloads" };

export default async function DownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where = { status: "PUBLISHED" as const };

  const [downloads, total] = await Promise.all([
    prisma.download.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.download.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Downloads</h1>
        <p className="text-muted-foreground mt-1">
          Forms, syllabus, templates, and other important documents.
        </p>
      </div>

      {downloads.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="rounded-full bg-primary/10 p-2.5">
                      <FileDown className="h-5 w-5 text-primary" />
                    </div>
                    {item.category && (
                      <Badge variant="secondary" className="font-normal">
                        {item.category.name}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display font-semibold leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <DownloadIcon className="h-3.5 w-3.5" /> {item.downloadCount} downloads
                    </span>
                    <DownloadTrackButton
                      trackEndpoint={`/api/downloads/${item.id}`}
                      fileUrl={item.fileUrl}
                      label="Download"
                      size="sm"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={(p) => `/downloads${p === 1 ? "" : `?page=${p}`}`}
          />
        </>
      ) : (
        <EmptyState
          icon={DownloadIcon}
          title="No downloads available"
          description="Check back later for forms, templates, and documents."
        />
      )}
    </div>
  );
}
