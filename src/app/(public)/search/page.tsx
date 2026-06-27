import { SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ResourceCard } from "@/components/shared/resource-card";
import { NoticeListItem } from "@/components/shared/notice-list-item";
import { ArticleCard } from "@/components/shared/article-card";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <div className="container py-10">
        <EmptyState
          icon={SearchX}
          title="Enter a search term"
          description="Use the search bar above to find resources, notices, and articles."
        />
      </div>
    );
  }

  const [resources, notices, articles] = await Promise.all([
    prisma.resource.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: { category: true, department: true },
      take: 9,
    }),
    prisma.notice.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ title: { contains: query } }, { content: { contains: query } }],
      },
      take: 6,
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } },
        ],
      },
      include: { category: true },
      take: 6,
    }),
  ]);

  const totalResults = resources.length + notices.length + articles.length;

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">
          Search results for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground mt-1">
          {totalResults} result{totalResults !== 1 ? "s" : ""} found
        </p>
      </div>

      {totalResults === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No results found"
          description="Try different keywords or browse our resources, notices, and articles sections directly."
        />
      ) : (
        <div className="space-y-10">
          {resources.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-semibold mb-4">
                Resources ({resources.length})
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            </section>
          )}

          {notices.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-semibold mb-4">
                Notices ({notices.length})
              </h2>
              <div className="space-y-3 max-w-2xl">
                {notices.map((n) => (
                  <NoticeListItem key={n.id} notice={n} />
                ))}
              </div>
            </section>
          )}

          {articles.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-semibold mb-4">
                Articles ({articles.length})
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
