import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { guideTypeLabel } from "@/lib/content-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await prisma.guide.findUnique({ where: { slug } });
  if (!guide) return {};
  return { title: guide.title };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await prisma.guide.findUnique({ where: { slug } });

  if (!guide || guide.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="container py-10 max-w-2xl">
      <Badge variant="secondary" className="mb-4">
        {guideTypeLabel[guide.guideType]}
      </Badge>
      <h1 className="font-display text-3xl font-semibold leading-tight">
        {guide.title}
      </h1>

      <Separator className="my-6" />

      <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed text-foreground/90">
        {guide.content}
      </div>

      <div className="mt-8">
        <Link href="/guides" className="text-sm text-primary hover:underline">
          ← Back to all guides
        </Link>
      </div>
    </div>
  );
}
