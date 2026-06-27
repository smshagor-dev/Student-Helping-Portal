import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import { ViewTracker } from "@/components/shared/view-tracker";
import { ArticleCard } from "@/components/shared/article-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const user = await getCurrentUser();
  let isBookmarked = false;
  if (user) {
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId: user.id, articleId: article.id, type: "ARTICLE" },
    });
    isBookmarked = !!bookmark;
  }

  const related = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: article.id },
      categoryId: article.categoryId ?? undefined,
    },
    include: { category: true },
    take: 3,
  });

  return (
    <div className="container py-10 max-w-3xl">
      <ViewTracker endpoint={`/api/articles/${article.id}/view`} />

      <div className="flex items-center gap-2 mb-4">
        {article.category && <Badge variant="secondary">{article.category.name}</Badge>}
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
        {article.title}
      </h1>

      <p className="text-lg text-muted-foreground mt-3">{article.excerpt}</p>

      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" /> {formatDate(article.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" /> {article.viewCount} views
        </span>
      </div>

      {article.thumbnailUrl && (
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-lg bg-secondary">
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-6">
        <BookmarkButton
          type="ARTICLE"
          articleId={article.id}
          initialBookmarked={isBookmarked}
          isLoggedIn={!!user}
        />
      </div>

      <Separator className="my-8" />

      <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed text-foreground/90">
        {article.content}
      </div>

      {related.length > 0 && (
        <>
          <Separator className="my-10" />
          <h2 className="font-display text-xl font-semibold mb-5">
            Related Articles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <Link href="/articles" className="text-sm text-primary hover:underline">
          ← Back to all articles
        </Link>
      </div>
    </div>
  );
}
