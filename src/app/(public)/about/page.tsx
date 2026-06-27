import { GraduationCap, Target, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage, getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const [settings, currentLanguage] = await Promise.all([getSiteSettings(), getCurrentLanguage()]);
  const dict = await getRuntimeDictionary(currentLanguage);

  return (
    <div className="container py-16 max-w-3xl">
      <div className="text-center mb-12">
        <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="font-display text-3xl md:text-4xl font-semibold">
          {dict.about.titlePrefix} {settings.siteName}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          {dict.about.description}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-3" />
            <h3 className="font-display font-semibold mb-1.5">{dict.about.mission}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.about.missionDescription}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-3" />
            <h3 className="font-display font-semibold mb-1.5">{dict.about.offer}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.about.offerDescription}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-3" />
            <h3 className="font-display font-semibold mb-1.5">{dict.about.builtForStudents}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.about.builtForStudentsDescription}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-5 text-center">
          {dict.about.behindProject}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {dict.about.team.map((member) => (
            <Card key={member.name}>
              <CardContent className="p-5 text-center">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
