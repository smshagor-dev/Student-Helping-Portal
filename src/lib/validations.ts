import { z } from "zod";

export const categoryTypeEnum = z.enum([
  "RESOURCE",
  "ARTICLE",
  "NOTICE",
  "DOWNLOAD",
  "GUIDE",
]);
export const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const resourceTypeEnum = z.enum([
  "NOTES",
  "PDF_BOOK",
  "PREVIOUS_QUESTION",
  "ASSIGNMENT",
  "VIDEO_TUTORIAL",
]);
export const noticeTypeEnum = z.enum([
  "UNIVERSITY",
  "EXAM",
  "SCHOLARSHIP",
  "GENERAL",
]);
export const guideTypeEnum = z.enum([
  "ADMISSION",
  "SCHOLARSHIP",
  "INTERNSHIP",
  "CAREER",
  "RESEARCH",
]);
export const roleEnum = z.enum(["ADMIN", "STUDENT"]);

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Slug must be at least 2 characters")
  .max(150)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase letters, numbers, hyphens)");

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug,
  type: categoryTypeEnum,
});

export const departmentSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug,
  description: z.string().trim().max(2000).optional().nullable(),
});

export const subjectSchema = z.object({
  name: z.string().trim().min(2).max(150),
  code: z.string().trim().min(1).max(30),
  departmentId: z.string().min(1, "Department is required"),
  description: z.string().trim().max(2000).optional().nullable(),
});

export const resourceSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug,
  description: z.string().trim().min(10).max(5000),
  resourceType: resourceTypeEnum,
  fileUrl: z.string().trim().url().optional().or(z.literal("")),
  videoUrl: z.string().trim().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().trim().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  status: statusEnum.default("DRAFT"),
  categoryId: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
});

export const noticeSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug,
  content: z.string().trim().min(10),
  noticeType: noticeTypeEnum,
  publishDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional().nullable(),
  status: statusEnum.default("DRAFT"),
  categoryId: z.string().optional().nullable(),
});

export const articleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug,
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().trim().min(20),
  thumbnailUrl: z.string().trim().url().optional().or(z.literal("")),
  status: statusEnum.default("DRAFT"),
  categoryId: z.string().optional().nullable(),
});

export const downloadSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug,
  description: z.string().trim().min(10).max(2000),
  fileUrl: z.string().trim().url(),
  status: statusEnum.default("DRAFT"),
  categoryId: z.string().optional().nullable(),
});

export const guideSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug,
  content: z.string().trim().min(20),
  guideType: guideTypeEnum,
  status: statusEnum.default("DRAFT"),
});

export const academicCalendarSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  type: z.string().trim().min(2).max(50),
});

export const examScheduleSchema = z.object({
  title: z.string().trim().min(2).max(200),
  departmentId: z.string().optional().nullable(),
  subjectId: z.string().optional().nullable(),
  examDate: z.coerce.date(),
  startTime: z.string().trim().min(1).max(20),
  endTime: z.string().trim().min(1).max(20),
  room: z.string().trim().max(50).optional().nullable(),
  description: z.string().trim().max(1000).optional().nullable(),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
});

export const siteSettingSchema = z.object({
  siteName: z.string().trim().min(2).max(100),
  siteLanguage: z.string().trim().min(2).max(10).regex(/^[a-z]{2,10}$/),
  logoUrl: z.string().trim().url().optional().or(z.literal("")),
  contactEmail: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  facebookUrl: z.string().trim().url().optional().or(z.literal("")),
  twitterUrl: z.string().trim().url().optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().optional().or(z.literal("")),
  youtubeUrl: z.string().trim().url().optional().or(z.literal("")),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(500).optional().or(z.literal("")),
});

export const languageSchema = z.object({
  code: z.string().trim().toLowerCase().min(2).max(10).regex(/^[a-z]{2,10}$/, "Language code must use lowercase letters only"),
  name: z.string().trim().min(2).max(100),
  nativeName: z.string().trim().max(100).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export const languageTranslationSchema = z.object({
  translations: z.record(z.string(), z.string()),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  image: z.string().trim().url().optional().or(z.literal("")),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
