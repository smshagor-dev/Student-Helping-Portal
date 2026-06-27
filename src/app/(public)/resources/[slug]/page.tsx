import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, Download, Calendar, Building2, FolderOpen, PlayCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { resourceTypeMeta } from "@/lib/content-meta";
import { formatDate } from "@/lib/utils";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import { DownloadTrackButton } from "@/components/shared/download-track-button";
import { ViewTracker } from "@/components/shared/view-tracker";
import { ResourceCard } from "@/components/shared/resource-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await prisma.resource.findUnique({ where: { slug } });
  if (!resource) return {};
  return { title: resource.title, description: resource.description.slice(0, 160) };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await prisma.resource.findUnique({
    where: { slug },
    include: { category: true, department: true },
  });

  if (!resource || resource.status !== "PUBLISHED") {
    notFound();
  }

  const user = await getCurrentUser();
  let isBookmarked = false;
  if (user) {
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId: user.id, resourceId: resource.id, type: "RESOURCE" },
    });
    isBookmarked = !!bookmark;
  }

  const relatedFilters = [];
  if (resource.categoryId) relatedFilters.push({ categoryId: resource.categoryId });
  if (resource.departmentId) relatedFilters.push({ departmentId: resource.departmentId });

  const related = relatedFilters.length
    ? await prisma.resource.findMany({
        where: {
          status: "PUBLISHED",
          id: { not: resource.id },
          OR: relatedFilters,
        },
        include: { category: true, department: true },
        take: 3,
      })
    : [];

  const meta = resourceTypeMeta[resource.resourceType];
  const Icon = meta.icon;

  return (
    <div className="container py-10 max-w-4xl">
      <ViewTracker endpoint={`/api/resources/${resource.id}/view`} />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="secondary" className="gap-1">
          <Icon className="h-3 w-3" /> {meta.label}
        </Badge>
        {resource.category && (
          <Badge variant="outline" className="gap-1">
            <FolderOpen className="h-3 w-3" /> {resource.category.name}
          </Badge>
        )}
        {resource.department && (
          <Badge variant="outline" className="gap-1">
            <Building2 className="h-3 w-3" /> {resource.department.name}
          </Badge>
        )}
      </div>

      <h1 className="font-display text-3xl font-semibold leading-tight">
        {resource.title}
      </h1>

      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" /> {formatDate(resource.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" /> {resource.viewCount} views
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-4 w-4" /> {resource.downloadCount} downloads
        </span>
      </div>

      {resource.thumbnailUrl && (
        <div className="relative mt-6 h-64 w-full overflow-hidden rounded-lg bg-secondary">
          <Image
            src={resource.thumbnailUrl}
            alt={resource.title}
            fill
            className="object-cover"
            unoptimized={resource.thumbnailUrl.startsWith("/uploads/")}
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {resource.fileUrl && (
          <DownloadTrackButton
            trackEndpoint={`/api/resources/${resource.id}/download`}
            fileUrl={resource.fileUrl}
            label="Download File"
          />
        )}
        {resource.videoUrl && (
          <Button variant="secondary" size="lg" asChild>
            <a href={resource.videoUrl} target="_blank" rel="noopener noreferrer">
              <PlayCircle className="h-4 w-4" /> Watch Video
            </a>
          </Button>
        )}
        <BookmarkButton
          type="RESOURCE"
          resourceId={resource.id}
          initialBookmarked={isBookmarked}
          isLoggedIn={!!user}
        />
      </div>

      <Separator className="my-8" />

      <div className="prose prose-sm max-w-none">
        <h2 className="font-display text-xl font-semibold mb-3">Description</h2>
        <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
          {resource.description}
        </p>
      </div>

      {related.length > 0 && (
        <>
          <Separator className="my-10" />
          <h2 className="font-display text-xl font-semibold mb-5">
            Related Resources
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <Link href="/resources" className="text-sm text-primary hover:underline">
          ← Back to all resources
        </Link>
      </div>
    </div>
  );
}
