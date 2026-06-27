import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage } from "@/lib/site-settings";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentLanguage = await getCurrentLanguage();
  const dict = await getRuntimeDictionary(currentLanguage);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-display text-xl font-semibold text-primary"
      >
        <GraduationCap className="h-7 w-7" />
        {dict.auth.siteTitle}
      </Link>
      {children}
    </div>
  );
}
