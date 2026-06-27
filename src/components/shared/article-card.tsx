import Link from "next/link";
import Image from "next/image";
import { Newspaper, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort, truncate } from "@/lib/utils";
import type { Article, Category } from "@prisma/client";

type ArticleCardData = Article & { category?: Category | null };

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-40 w-full bg-secondary">
          {article.thumbnailUrl ? (
            <Image
              src={article.thumbnailUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Newspaper className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          {article.category && (
            <Badge variant="secondary" className="font-normal">
              {article.category.name}
            </Badge>
          )}
          <h3 className="font-display font-semibold leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {truncate(article.excerpt, 110)}
          </p>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span>{formatDateShort(article.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {article.viewCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
