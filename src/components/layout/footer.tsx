import Link from "next/link";
import { GraduationCap, Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage, getSiteSettings } from "@/lib/site-settings";

export async function Footer() {
  const [settings, currentLanguage] = await Promise.all([getSiteSettings(), getCurrentLanguage()]);
  const dict = await getRuntimeDictionary(currentLanguage);

  return (
    <footer className="border-t bg-secondary/40">
      <div className="container py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
            <GraduationCap className="h-6 w-6" />
            {settings.siteName}
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            {dict.footer.description}
          </p>
          <div className="mt-4 flex gap-3">
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {settings.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {settings.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold mb-3">{dict.footer.explore}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/resources" className="hover:text-foreground">{dict.footer.studyResources}</Link></li>
            <li><Link href="/academic" className="hover:text-foreground">{dict.footer.academicInfo}</Link></li>
            <li><Link href="/guides" className="hover:text-foreground">{dict.footer.studentGuides}</Link></li>
            <li><Link href="/downloads" className="hover:text-foreground">{dict.footer.downloads}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold mb-3">{dict.footer.updates}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/notices" className="hover:text-foreground">{dict.footer.notices}</Link></li>
            <li><Link href="/articles" className="hover:text-foreground">{dict.footer.articles}</Link></li>
            <li><Link href="/about" className="hover:text-foreground">{dict.footer.aboutUs}</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">{dict.footer.contactUs}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold mb-3">{dict.footer.contact}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" /> {settings.contactEmail}
            </li>
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> {settings.phone}
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" /> {settings.address}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t py-4">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {settings.siteName}. {dict.footer.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
}
