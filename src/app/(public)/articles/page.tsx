import { Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/shared/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";

const PAGE_SIZE = 9;

export const metadata = { title: "Articles" };

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const where = { status: "PUBLISHED" as const };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Articles</h1>
        <p className="text-muted-foreground mt-1">
          Study tips, technology, programming, research, and student life.
        </p>
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={(p) => `/articles${p === 1 ? "" : `?page=${p}`}`}
          />
        </>
      ) : (
        <EmptyState
          icon={Newspaper}
          title="No articles yet"
          description="Published articles will appear here."
        />
      )}
    </div>
  );
}
