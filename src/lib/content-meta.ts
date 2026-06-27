import {
  NotebookText,
  BookText,
  FileQuestion,
  ClipboardCheck,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { ResourceType, NoticeType, GuideType } from "@prisma/client";

export const resourceTypeMeta: Record<
  ResourceType,
  { label: string; icon: LucideIcon }
> = {
  NOTES: { label: "Notes", icon: NotebookText },
  PDF_BOOK: { label: "PDF Book", icon: BookText },
  PREVIOUS_QUESTION: { label: "Previous Question", icon: FileQuestion },
  ASSIGNMENT: { label: "Assignment", icon: ClipboardCheck },
  VIDEO_TUTORIAL: { label: "Video Tutorial", icon: Video },
};

export const noticeTypeLabel: Record<NoticeType, string> = {
  UNIVERSITY: "University",
  EXAM: "Exam",
  SCHOLARSHIP: "Scholarship",
  GENERAL: "General",
};

export const guideTypeLabel: Record<GuideType, string> = {
  ADMISSION: "Admission",
  SCHOLARSHIP: "Scholarship",
  INTERNSHIP: "Internship",
  CAREER: "Career",
  RESEARCH: "Research",
};
