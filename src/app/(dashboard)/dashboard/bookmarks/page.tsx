import Link from "next/link";
import { Bookmark, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { RemoveBookmarkButton } from "@/components/shared/remove-bookmark-button";
import { resourceTypeMeta } from "@/lib/content-meta";
import { formatDateShort } from "@/lib/utils";

export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      resource: { include: { category: true, department: true } },
      article: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (bookmarks.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6">My Bookmarks</h1>
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Save resources and articles you want to revisit later."
          action={
            <Link href="/resources" className="text-sm text-primary font-medium hover:underline">
              Browse resources
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">
        My Bookmarks ({bookmarks.length})
      </h1>
      <div className="space-y-3">
        {bookmarks.map((bookmark) => {
          if (bookmark.type === "RESOURCE" && bookmark.resource) {
            const meta = resourceTypeMeta[bookmark.resource.resourceType];
            const Icon = meta.icon;
            return (
              <Card key={bookmark.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <Link href={`/resources/${bookmark.resource.slug}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="font-normal text-xs">
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="font-medium leading-snug line-clamp-1 hover:underline">
                      {bookmark.resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Saved {formatDateShort(bookmark.createdAt)}
                    </p>
                  </Link>
                  <RemoveBookmarkButton type="RESOURCE" resourceId={bookmark.resourceId!} />
                </CardContent>
              </Card>
            );
          }

          if (bookmark.type === "ARTICLE" && bookmark.article) {
            return (
              <Card key={bookmark.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 shrink-0">
                    <Newspaper className="h-4 w-4 text-primary" />
                  </div>
                  <Link href={`/articles/${bookmark.article.slug}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="font-normal text-xs">
                        Article
                      </Badge>
                    </div>
                    <p className="font-medium leading-snug line-clamp-1 hover:underline">
                      {bookmark.article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Saved {formatDateShort(bookmark.createdAt)}
                    </p>
                  </Link>
                  <RemoveBookmarkButton type="ARTICLE" articleId={bookmark.articleId!} />
                </CardContent>
              </Card>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
