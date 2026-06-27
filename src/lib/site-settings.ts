import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const LANGUAGE_COOKIE_NAME = "site_language";
export type SiteLanguage = string;

export type SiteSettingsSnapshot = {
  siteName: string;
  siteLanguage: SiteLanguage;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

const defaultSettings: SiteSettingsSnapshot = {
  siteName: "Student Helping Portal",
  siteLanguage: "en",
  contactEmail: "info@studentportal.com",
  phone: null,
  address: null,
  facebookUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
  youtubeUrl: null,
  seoTitle: null,
  seoDescription: null,
};

function normalizeLanguage(input: string | null | undefined): SiteLanguage {
  return input?.trim().toLowerCase() || "en";
}

export async function getSiteSettings(): Promise<SiteSettingsSnapshot> {
  try {
    const settings = await prisma.siteSetting.findFirst();
    if (!settings) return defaultSettings;

    return {
      siteName: settings.siteName,
      siteLanguage: normalizeLanguage(settings.siteLanguage),
      contactEmail: settings.contactEmail,
      phone: settings.phone,
      address: settings.address,
      facebookUrl: settings.facebookUrl,
      twitterUrl: settings.twitterUrl,
      linkedinUrl: settings.linkedinUrl,
      youtubeUrl: settings.youtubeUrl,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
    };
  } catch {
    return defaultSettings;
  }
}

export async function getActiveLanguages() {
  try {
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      select: { code: true, name: true, nativeName: true, isDefault: true },
    });
    if (languages.length > 0) return languages;
  } catch {
    // fall back to defaults below
  }

  return [
    { code: "en", name: "English", nativeName: "English", isDefault: true },
    { code: "bn", name: "Bangla", nativeName: "বাংলা", isDefault: false },
  ];
}

export async function getCurrentLanguage() {
  const [settings, activeLanguages, cookieStore] = await Promise.all([
    getSiteSettings(),
    getActiveLanguages(),
    cookies(),
  ]);

  const requested = normalizeLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);
  const activeCodes = new Set(activeLanguages.map((language) => language.code));

  if (activeCodes.has(requested)) {
    return requested;
  }

  if (activeCodes.has(settings.siteLanguage)) {
    return settings.siteLanguage;
  }

  return activeLanguages.find((language) => language.isDefault)?.code ?? activeLanguages[0]?.code ?? "en";
}
