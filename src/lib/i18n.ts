import { prisma } from "@/lib/prisma";
import type { SiteLanguage } from "@/lib/site-settings";

const dictionaries = {
  en: {
    nav: {
      resources: "Resources",
      academic: "Academic",
      guides: "Guides",
      downloads: "Downloads",
      notices: "Notices",
      articles: "Articles",
      about: "About",
      contact: "Contact",
      dashboard: "Dashboard",
      adminPanel: "Admin Panel",
      profile: "Profile",
      login: "Log in",
      signup: "Sign up",
      logout: "Log out",
      searchPlaceholder: "Search...",
      mobileSearchPlaceholder: "Search resources, notices, articles...",
      toggleMenu: "Toggle menu",
    },
    footer: {
      description:
        "A complete academic hub bringing notices, study resources, guides, and downloads together for students in one trusted place.",
      explore: "Explore",
      updates: "Updates",
      contact: "Contact",
      studyResources: "Study Resources",
      academicInfo: "Academic Info",
      studentGuides: "Student Guides",
      downloads: "Downloads",
      notices: "Notices",
      articles: "Articles",
      aboutUs: "About Us",
      contactUs: "Contact",
      copyrightSuffix: "Built as an academic thesis project.",
    },
    auth: {
      welcomeBack: "Welcome back",
      loginDescription: "Log in to access your dashboard and bookmarks.",
      invalidCredentials: "Invalid email or password.",
      genericError: "Something went wrong. Please try again.",
      email: "Email",
      password: "Password",
      login: "Log in",
      noAccount: "Don't have an account?",
      signup: "Sign up",
      demoCredentials: "Demo credentials",
      use: "Use",
      createAccount: "Create an account",
      registerDescription: "Sign up to bookmark resources and track your activity.",
      fullName: "Full Name",
      passwordHint: "At least 6 characters",
      hasAccount: "Already have an account?",
      siteTitle: "Student Helping Portal",
    },
    dashboard: {
      overview: "Overview",
      bookmarks: "Bookmarks",
      profile: "Profile",
    },
    admin: {
      panel: "Admin Panel",
      overview: "Overview",
      taxonomy: "Taxonomy",
      content: "Content",
      academics: "Academics",
      administration: "Administration",
      dashboard: "Dashboard",
      categories: "Categories",
      departments: "Departments",
      subjects: "Subjects",
      resources: "Resources",
      notices: "Notices",
      articles: "Articles",
      downloads: "Downloads",
      guides: "Guides",
      academicCalendar: "Academic Calendar",
      examSchedule: "Exam Schedule",
      messages: "Messages",
      users: "Users",
      settings: "Settings",
      languages: "Languages",
      backToSite: "Back to site",
      openMenu: "Open menu",
      logout: "Log out",
      detail: "Detail",
    },
    settings: {
      language: "Site Language",
      languageDescription: "Choose the default language used across shared site UI.",
      english: "English",
      bangla: "Bangla",
    },
    home: {
      badge: "Everything a student needs, in one place",
      title: "Your complete academic companion",
      description:
        "Find study notes, previous questions, notices, guides, and downloads organized by department and ready when you need them.",
      search: "Search",
      quickLinks: {
        resources: "Study Resources",
        notices: "Notices",
        downloads: "Downloads",
        guides: "Student Guides",
        academic: "Academic Calendar",
      },
      popularResources: "Popular Resources",
      latestNotices: "Latest Notices",
      latestArticles: "Latest Articles",
      viewAll: "View all",
      noResources: "No resources yet",
      noResourcesDescription: "Published study resources will appear here.",
      noNotices: "No notices yet",
      noNoticesDescription: "Published notices will appear here.",
      noArticles: "No articles yet",
      noArticlesDescription: "Published articles will appear here.",
    },
    about: {
      titlePrefix: "About",
      description:
        "A single, organized place for students to find the academic information, study materials, and guidance they need built as an academic thesis project.",
      mission: "Our Mission",
      missionDescription:
        "Make academic resources, notices, and guidance accessible to every student, regardless of department or year.",
      offer: "What We Offer",
      offerDescription:
        "Notes, previous questions, assignments, video tutorials, notices, and downloadable forms in one organized hub.",
      builtForStudents: "Built for Students",
      builtForStudentsDescription:
        "Designed with real student workflows in mind searchable, filterable, and mobile-friendly.",
      behindProject: "Behind the Project",
      team: [
        { name: "Academic Content Team", role: "Curates study resources and guides" },
        { name: "Platform Engineering", role: "Builds and maintains the portal" },
        { name: "Student Advisory Board", role: "Ensures content meets real student needs" },
      ],
    },
    contact: {
      title: "Contact Us",
      description: "Have a question or feedback? We'd love to hear from you.",
      getInTouch: "Get in Touch",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "How do I download a resource?",
          a: "Visit the Study Resources page, open any resource, and click the Download button. Your download is counted automatically.",
        },
        {
          q: "Do I need an account to browse the site?",
          a: "No, notices, resources, articles, and guides are public. You only need an account to bookmark items or access your dashboard.",
        },
        {
          q: "How can I report incorrect or outdated content?",
          a: "Use the contact form below with the details, and our team will review and update the content as needed.",
        },
        {
          q: "Can I suggest a new resource or guide topic?",
          a: "Absolutely, send your suggestion via the contact form and we'll consider it for a future update.",
        },
      ],
    },
    academic: {
      title: "Academic Information",
      description: "Departments, subjects, academic calendar, and exam schedules.",
      departments: "Departments",
      calendar: "Academic Calendar",
      exams: "Exam Schedule",
      results: "Results",
      noDepartments: "No departments added yet",
      noCalendar: "No upcoming calendar events",
      noExams: "No upcoming exams scheduled",
      subjects: "subjects",
      resources: "resources",
      openResultLink: "Open result link",
    },
    common: {
      home: "Home",
    },
  },
  bn: {
    nav: {
      resources: "রিসোর্স",
      academic: "একাডেমিক",
      guides: "গাইড",
      downloads: "ডাউনলোড",
      notices: "নোটিশ",
      articles: "আর্টিকেল",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ",
      dashboard: "ড্যাশবোর্ড",
      adminPanel: "অ্যাডমিন প্যানেল",
      profile: "প্রোফাইল",
      login: "লগ ইন",
      signup: "সাইন আপ",
      logout: "লগ আউট",
      searchPlaceholder: "সার্চ করুন...",
      mobileSearchPlaceholder: "রিসোর্স, নোটিশ, আর্টিকেল সার্চ করুন...",
      toggleMenu: "মেনু টগল করুন",
    },
    footer: {
      description:
        "নোটিশ, স্টাডি রিসোর্স, গাইড এবং ডাউনলোডকে এক জায়গায় এনে শিক্ষার্থীদের জন্য একটি নির্ভরযোগ্য একাডেমিক হাব তৈরি করা হয়েছে।",
      explore: "এক্সপ্লোর",
      updates: "আপডেট",
      contact: "যোগাযোগ",
      studyResources: "স্টাডি রিসোর্স",
      academicInfo: "একাডেমিক তথ্য",
      studentGuides: "স্টুডেন্ট গাইড",
      downloads: "ডাউনলোড",
      notices: "নোটিশ",
      articles: "আর্টিকেল",
      aboutUs: "আমাদের সম্পর্কে",
      contactUs: "যোগাযোগ",
      copyrightSuffix: "একাডেমিক থিসিস প্রজেক্ট হিসেবে তৈরি।",
    },
    auth: {
      welcomeBack: "আবার স্বাগতম",
      loginDescription: "ড্যাশবোর্ড এবং বুকমার্ক ব্যবহার করতে লগ ইন করুন।",
      invalidCredentials: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",
      genericError: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      email: "ইমেইল",
      password: "পাসওয়ার্ড",
      login: "লগ ইন",
      noAccount: "অ্যাকাউন্ট নেই?",
      signup: "সাইন আপ",
      demoCredentials: "ডেমো ক্রেডেনশিয়াল",
      use: "ব্যবহার করুন",
      createAccount: "অ্যাকাউন্ট তৈরি করুন",
      registerDescription: "রিসোর্স বুকমার্ক ও কার্যক্রম ট্র্যাক করতে সাইন আপ করুন।",
      fullName: "পূর্ণ নাম",
      passwordHint: "অন্তত ৬ অক্ষর",
      hasAccount: "আগে থেকেই অ্যাকাউন্ট আছে?",
      siteTitle: "স্টুডেন্ট হেল্পিং পোর্টাল",
    },
    dashboard: {
      overview: "ওভারভিউ",
      bookmarks: "বুকমার্ক",
      profile: "প্রোফাইল",
    },
    admin: {
      panel: "অ্যাডমিন প্যানেল",
      overview: "ওভারভিউ",
      taxonomy: "ট্যাক্সোনমি",
      content: "কনটেন্ট",
      academics: "একাডেমিকস",
      administration: "অ্যাডমিনিস্ট্রেশন",
      dashboard: "ড্যাশবোর্ড",
      categories: "ক্যাটাগরি",
      departments: "ডিপার্টমেন্ট",
      subjects: "সাবজেক্ট",
      resources: "রিসোর্স",
      notices: "নোটিশ",
      articles: "আর্টিকেল",
      downloads: "ডাউনলোড",
      guides: "গাইড",
      academicCalendar: "একাডেমিক ক্যালেন্ডার",
      examSchedule: "পরীক্ষার রুটিন",
      messages: "মেসেজ",
      users: "ইউজার",
      settings: "সেটিংস",
      languages: "ভাষা",
      backToSite: "সাইটে ফিরে যান",
      openMenu: "মেনু খুলুন",
      logout: "লগ আউট",
      detail: "ডিটেইল",
    },
    settings: {
      language: "সাইটের ভাষা",
      languageDescription: "শেয়ার্ড সাইট UI-তে ব্যবহৃত ডিফল্ট ভাষা নির্বাচন করুন।",
      english: "ইংরেজি",
      bangla: "বাংলা",
    },
    home: {
      badge: "একজন শিক্ষার্থীর যা দরকার, সব এক জায়গায়",
      title: "আপনার সম্পূর্ণ একাডেমিক সহচর",
      description:
        "স্টাডি নোট, আগের প্রশ্ন, নোটিশ, গাইড এবং ডাউনলোড বিভাগভিত্তিকভাবে খুঁজে নিন, যখনই প্রয়োজন।",
      search: "সার্চ",
      quickLinks: {
        resources: "স্টাডি রিসোর্স",
        notices: "নোটিশ",
        downloads: "ডাউনলোড",
        guides: "স্টুডেন্ট গাইড",
        academic: "একাডেমিক ক্যালেন্ডার",
      },
      popularResources: "জনপ্রিয় রিসোর্স",
      latestNotices: "সর্বশেষ নোটিশ",
      latestArticles: "সর্বশেষ আর্টিকেল",
      viewAll: "সব দেখুন",
      noResources: "এখনও কোনো রিসোর্স নেই",
      noResourcesDescription: "পাবলিশড স্টাডি রিসোর্স এখানে দেখা যাবে।",
      noNotices: "এখনও কোনো নোটিশ নেই",
      noNoticesDescription: "পাবলিশড নোটিশ এখানে দেখা যাবে।",
      noArticles: "এখনও কোনো আর্টিকেল নেই",
      noArticlesDescription: "পাবলিশড আর্টিকেল এখানে দেখা যাবে।",
    },
    about: {
      titlePrefix: "সম্পর্কে",
      description:
        "শিক্ষার্থীরা যাতে এক জায়গায় একাডেমিক তথ্য, স্টাডি ম্যাটেরিয়াল এবং প্রয়োজনীয় গাইডেন্স পায়, সেই লক্ষ্যেই এই থিসিস প্রজেক্টটি তৈরি।",
      mission: "আমাদের লক্ষ্য",
      missionDescription:
        "ডিপার্টমেন্ট বা শিক্ষাবর্ষ নির্বিশেষে প্রতিটি শিক্ষার্থীর কাছে একাডেমিক রিসোর্স, নোটিশ ও গাইডেন্স পৌঁছে দেওয়া।",
      offer: "আমরা যা দিচ্ছি",
      offerDescription:
        "নোট, আগের প্রশ্ন, অ্যাসাইনমেন্ট, ভিডিও টিউটোরিয়াল, নোটিশ এবং গুরুত্বপূর্ণ ফর্ম এক সংগঠিত প্ল্যাটফর্মে।",
      builtForStudents: "শিক্ষার্থীদের জন্য তৈরি",
      builtForStudentsDescription:
        "শিক্ষার্থীদের বাস্তব কাজের ধরন মাথায় রেখে সার্চযোগ্য, ফিল্টারযোগ্য এবং মোবাইল-ফ্রেন্ডলি ডিজাইন।",
      behindProject: "প্রজেক্টের পেছনের দল",
      team: [
        { name: "একাডেমিক কনটেন্ট টিম", role: "স্টাডি রিসোর্স ও গাইড কিউরেট করে" },
        { name: "প্ল্যাটফর্ম ইঞ্জিনিয়ারিং", role: "পোর্টাল তৈরি ও রক্ষণাবেক্ষণ করে" },
        { name: "স্টুডেন্ট অ্যাডভাইজরি বোর্ড", role: "কনটেন্ট যেন শিক্ষার্থীদের বাস্তব চাহিদা পূরণ করে তা নিশ্চিত করে" },
      ],
    },
    contact: {
      title: "যোগাযোগ করুন",
      description: "প্রশ্ন বা মতামত থাকলে আমাদের জানাতে পারেন।",
      getInTouch: "যোগাযোগের তথ্য",
      faqTitle: "সাধারণ জিজ্ঞাসা",
      faqs: [
        {
          q: "আমি কীভাবে একটি রিসোর্স ডাউনলোড করব?",
          a: "স্টাডি রিসোর্স পেজে গিয়ে যেকোনো রিসোর্স খুলুন এবং ডাউনলোড বাটনে ক্লিক করুন। ডাউনলোড স্বয়ংক্রিয়ভাবে গণনা হবে।",
        },
        {
          q: "সাইট ব্রাউজ করতে কি অ্যাকাউন্ট দরকার?",
          a: "না, নোটিশ, রিসোর্স, আর্টিকেল ও গাইড সবার জন্য উন্মুক্ত। বুকমার্ক বা ড্যাশবোর্ড ব্যবহার করতে অ্যাকাউন্ট দরকার।",
        },
        {
          q: "ভুল বা পুরোনো কনটেন্ট কীভাবে রিপোর্ট করব?",
          a: "নিচের কনট্যাক্ট ফর্মে বিস্তারিত লিখে পাঠান, আমরা রিভিউ করে আপডেট করব।",
        },
        {
          q: "নতুন রিসোর্স বা গাইড টপিক সাজেস্ট করা যাবে?",
          a: "অবশ্যই, কনট্যাক্ট ফর্মে আপনার পরামর্শ পাঠান। আমরা ভবিষ্যৎ আপডেটে বিবেচনা করব।",
        },
      ],
    },
    academic: {
      title: "একাডেমিক তথ্য",
      description: "ডিপার্টমেন্ট, সাবজেক্ট, একাডেমিক ক্যালেন্ডার এবং পরীক্ষার রুটিন।",
      departments: "ডিপার্টমেন্ট",
      calendar: "একাডেমিক ক্যালেন্ডার",
      exams: "পরীক্ষার রুটিন",
      results: "রেজাল্ট",
      noDepartments: "এখনও কোনো ডিপার্টমেন্ট যোগ করা হয়নি",
      noCalendar: "আসন্ন কোনো ক্যালেন্ডার ইভেন্ট নেই",
      noExams: "আসন্ন কোনো পরীক্ষা নির্ধারিত নেই",
      subjects: "সাবজেক্ট",
      resources: "রিসোর্স",
      openResultLink: "রেজাল্ট লিংক খুলুন",
    },
    common: {
      home: "হোম",
    },
  },
} as const;

type Dictionary = typeof dictionaries.en;

function flattenTranslations(value: unknown, prefix = "", result: Record<string, string> = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenTranslations(item, `${prefix}[${index}]`, result);
    });
    return result;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flattenTranslations(child, nextPrefix, result);
    });
    return result;
  }

  if (prefix) {
    result[prefix] = String(value ?? "");
  }
  return result;
}

function setNestedValue(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".");
  let current: Record<string, unknown> = target;

  parts.forEach((part, index) => {
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, rawIndex] = arrayMatch;
      const itemIndex = Number(rawIndex);
      const existing = Array.isArray(current[key]) ? current[key] as unknown[] : [];
      if (!current[key]) current[key] = existing;

      if (index === parts.length - 1) {
        existing[itemIndex] = value;
        return;
      }

      const next = typeof existing[itemIndex] === "object" && existing[itemIndex] !== null
        ? existing[itemIndex] as Record<string, unknown>
        : {};
      existing[itemIndex] = next;
      current = next;
      return;
    }

    if (index === parts.length - 1) {
      current[part] = value;
      return;
    }

    if (!current[part] || typeof current[part] !== "object") {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  });
}

function unflattenTranslations(flatTranslations: Record<string, string>) {
  const result: Record<string, unknown> = {};
  Object.entries(flatTranslations).forEach(([key, value]) => {
    setNestedValue(result, key, value);
  });
  return result;
}

export function getDictionary(language: SiteLanguage) {
  const allDictionaries = dictionaries as unknown as Record<string, Dictionary>;
  return allDictionaries[language] ?? dictionaries.en;
}

export function getDefaultTranslationEntries() {
  return flattenTranslations(dictionaries.en);
}

export function getSeedTranslationsForLanguage(languageCode: string) {
  const dictionary = getDictionary(languageCode);
  return flattenTranslations(dictionary);
}

export async function getRuntimeDictionary(language: SiteLanguage): Promise<Dictionary> {
  const defaultEntries = getDefaultTranslationEntries();

  try {
    const languageRecord = await prisma.language.findUnique({
      where: { code: language },
      include: { translations: true },
    });

    if (!languageRecord) {
      return getDictionary(language);
    }

    const entries = { ...defaultEntries };
    for (const translation of languageRecord.translations) {
      entries[translation.key] = translation.value;
    }

    return unflattenTranslations(entries) as Dictionary;
  } catch {
    return getDictionary(language);
  }
}
