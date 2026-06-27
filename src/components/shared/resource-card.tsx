import Link from "next/link";
import Image from "next/image";
import { Eye, Download, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resourceTypeMeta } from "@/lib/content-meta";
import { truncate } from "@/lib/utils";
import type { Resource, Category, Department } from "@prisma/client";

type ResourceCardData = Resource & {
  category?: Category | null;
  department?: Department | null;
};

export function ResourceCard({ resource }: { resource: ResourceCardData }) {
  const meta = resourceTypeMeta[resource.resourceType];
  const Icon = meta.icon;

  return (
    <Link href={`/resources/${resource.slug}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-36 w-full bg-secondary">
          {resource.thumbnailUrl ? (
            <Image
              src={resource.thumbnailUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Icon className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          {resource.isFeatured && (
            <Badge variant="accent" className="absolute top-2 right-2 gap-1">
              <Star className="h-3 w-3" /> Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="gap-1 font-normal">
              <Icon className="h-3 w-3" /> {meta.label}
            </Badge>
            {resource.department && (
              <Badge variant="outline" className="font-normal">
                {resource.department.name}
              </Badge>
            )}
          </div>
          <h3 className="font-display font-semibold leading-snug line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {truncate(resource.description, 110)}
          </p>
          <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {resource.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" /> {resource.downloadCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
