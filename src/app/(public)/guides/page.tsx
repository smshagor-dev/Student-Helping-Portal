import Link from "next/link";
import { Compass, GraduationCap, Award, Briefcase, TrendingUp, FlaskConical } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { guideTypeLabel } from "@/lib/content-meta";
import type { GuideType } from "@prisma/client";

const guideIcon: Record<GuideType, typeof GraduationCap> = {
  ADMISSION: GraduationCap,
  SCHOLARSHIP: Award,
  INTERNSHIP: Briefcase,
  CAREER: TrendingUp,
  RESEARCH: FlaskConical,
};

export const metadata = { title: "Student Guides" };

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;

  const where = {
    status: "PUBLISHED" as const,
    ...(params.type ? { guideType: params.type as GuideType } : {}),
  };

  const guides = await prisma.guide.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Student Guides</h1>
        <p className="text-muted-foreground mt-1">
          Admission, scholarship, internship, career, and research guidance.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/guides">
          <Badge variant={!params.type ? "default" : "outline"} className="cursor-pointer">
            All
          </Badge>
        </Link>
        {Object.entries(guideTypeLabel).map(([key, label]) => (
          <Link key={key} href={`/guides?type=${key}`}>
            <Badge variant={params.type === key ? "default" : "outline"} className="cursor-pointer">
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      {guides.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guideIcon[guide.guideType];
            return (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-5 space-y-3">
                    <div className="rounded-full bg-primary/10 p-2.5 w-fit">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="font-normal">
                      {guideTypeLabel[guide.guideType]}
                    </Badge>
                    <h3 className="font-display font-semibold leading-snug line-clamp-2">
                      {guide.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No guides available"
          description="Check back later for student guidance content."
        />
      )}
    </div>
  );
}
