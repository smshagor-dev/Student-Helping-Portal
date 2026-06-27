import { Building2, CalendarDays, ClipboardList, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage } from "@/lib/site-settings";

export const metadata = { title: "Academic Information" };

const resultLinks = [
  {
    label: "Undergraduate Results Portal",
    href: "https://results.gov.bd/",
    description: "Check semester and published exam results through the national result system.",
  },
  {
    label: "University Main Website",
    href: "https://www.du.ac.bd/",
    description: "Visit your university website for department-specific result notices and archives.",
  },
  {
    label: "UGC Bangladesh",
    href: "https://www.ugc.gov.bd/",
    description: "Useful for official higher-education notices, circulars, and result-related updates.",
  },
];

export default async function AcademicPage() {
  const currentLanguage = await getCurrentLanguage();
  const dict = await getRuntimeDictionary(currentLanguage);

  const [departments, calendarEvents, examSchedules] = await Promise.all([
    prisma.department.findMany({
      include: { subjects: true, _count: { select: { resources: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.academicCalendar.findMany({
      orderBy: { startDate: "asc" },
      where: { endDate: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } },
    }),
    prisma.examSchedule.findMany({
      include: { department: true, subject: true },
      orderBy: { examDate: "asc" },
      where: { examDate: { gte: new Date(new Date().setDate(new Date().getDate() - 1)) } },
    }),
  ]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">{dict.academic.title}</h1>
        <p className="text-muted-foreground mt-1">
          {dict.academic.description}
        </p>
      </div>

      <Tabs defaultValue="departments">
        <TabsList>
          <TabsTrigger value="departments">{dict.academic.departments}</TabsTrigger>
          <TabsTrigger value="calendar">{dict.academic.calendar}</TabsTrigger>
          <TabsTrigger value="exams">{dict.academic.exams}</TabsTrigger>
          <TabsTrigger value="results">{dict.academic.results}</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="pt-4">
          {departments.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <Card key={dept.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="rounded-full bg-primary/10 p-2.5 w-fit">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold">{dept.name}</h3>
                    {dept.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {dept.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="font-normal">
                        {dept.subjects.length} {dict.academic.subjects}
                      </Badge>
                      <Badge variant="secondary" className="font-normal">
                        {dept._count.resources} {dict.academic.resources}
                      </Badge>
                    </div>
                    {dept.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {dept.subjects.map((subject) => (
                          <Badge key={subject.id} variant="outline" className="font-normal">
                            {subject.code} - {subject.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Building2} title={dict.academic.noDepartments} />
          )}
        </TabsContent>

        <TabsContent value="calendar" className="pt-4">
          {calendarEvents.length > 0 ? (
            <div className="space-y-3">
              {calendarEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2.5 shrink-0">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-normal">{event.type}</Badge>
                      </div>
                      <h3 className="font-medium">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title={dict.academic.noCalendar} />
          )}
        </TabsContent>

        <TabsContent value="exams" className="pt-4">
          {examSchedules.length > 0 ? (
            <div className="space-y-3">
              {examSchedules.map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2.5 shrink-0">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{exam.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {exam.department && (
                          <Badge variant="secondary" className="font-normal">
                            {exam.department.name}
                          </Badge>
                        )}
                        {exam.subject && (
                          <Badge variant="outline" className="font-normal">
                            {exam.subject.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(exam.examDate)} • {exam.startTime} - {exam.endTime}
                        {exam.room && ` • Room ${exam.room}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={ClipboardList} title={dict.academic.noExams} />
          )}
        </TabsContent>

        <TabsContent value="results" className="pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {resultLinks.map((link) => (
              <Card key={link.href}>
                <CardContent className="p-5">
                  <ExternalLink className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-display font-semibold mb-2">{link.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {dict.academic.openResultLink}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
