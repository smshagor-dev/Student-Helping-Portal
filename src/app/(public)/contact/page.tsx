import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/shared/contact-form";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage, getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const [settings, currentLanguage] = await Promise.all([getSiteSettings(), getCurrentLanguage()]);
  const dict = await getRuntimeDictionary(currentLanguage);

  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-semibold">{dict.contact.title}</h1>
        <p className="text-muted-foreground mt-1">
          {dict.contact.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="p-6">
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-display font-semibold mb-1">{dict.contact.getInTouch}</h3>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> {settings.contactEmail}
              </p>
              {settings.phone && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" /> {settings.phone}
                </p>
              )}
              {settings.address && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" /> {settings.address}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-2xl font-semibold mb-6 text-center">
          {dict.contact.faqTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {dict.contact.faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-5">
                <h3 className="font-medium mb-1.5">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
