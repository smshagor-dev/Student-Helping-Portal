import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getSeedTranslationsForLanguage } from "../src/lib/i18n";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ---------------------------------------------------------------
  // Languages
  // ---------------------------------------------------------------
  const languageEntries = [
    { code: "en", name: "English", nativeName: "English", isDefault: true },
    { code: "bn", name: "Bangla", nativeName: "বাংলা", isDefault: false },
  ];

  const languages = [];
  for (const language of languageEntries) {
    const entry = await prisma.language.upsert({
      where: { code: language.code },
      update: {
        name: language.name,
        nativeName: language.nativeName,
        isActive: true,
        isDefault: language.isDefault,
      },
      create: {
        ...language,
        isActive: true,
      },
    });
    languages.push(entry);
  }

  for (const language of languages) {
    const seedTranslations = getSeedTranslationsForLanguage(language.code);
    for (const [key, value] of Object.entries(seedTranslations)) {
      await prisma.languageTranslation.upsert({
        where: {
          languageId_key: {
            languageId: language.id,
            key,
          },
        },
        update: { value },
        create: {
          languageId: language.id,
          key,
          value,
        },
      });
    }
  }
  console.log(`✅ Languages: ${languages.length}`);

  // ---------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const studentPassword = await bcrypt.hash("student123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@studentportal.com" },
    update: {},
    create: {
      name: "Portal Administrator",
      email: "admin@studentportal.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@studentportal.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@studentportal.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  console.log(`✅ Users ready: ${admin.email}, ${student.email}`);

  // ---------------------------------------------------------------
  // Departments
  // ---------------------------------------------------------------
  const departmentsData = [
    { name: "Computer Science & Engineering", slug: "cse", description: "Department of Computer Science & Engineering" },
    { name: "Electrical & Electronic Engineering", slug: "eee", description: "Department of Electrical & Electronic Engineering" },
    { name: "Business Administration", slug: "bba", description: "Department of Business Administration" },
    { name: "English", slug: "english", description: "Department of English" },
  ];

  const departments = [];
  for (const dept of departmentsData) {
    const d = await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: dept,
    });
    departments.push(d);
  }
  console.log(`✅ Departments: ${departments.length}`);

  // ---------------------------------------------------------------
  // Subjects
  // ---------------------------------------------------------------
  const cse = departments.find((d) => d.slug === "cse")!;
  const eee = departments.find((d) => d.slug === "eee")!;
  const bba = departments.find((d) => d.slug === "bba")!;

  const subjectsData = [
    { name: "Data Structures", code: "CSE201", departmentId: cse.id, description: "Core data structures course" },
    { name: "Algorithms", code: "CSE301", departmentId: cse.id, description: "Algorithm design and analysis" },
    { name: "Database Systems", code: "CSE303", departmentId: cse.id, description: "Relational database concepts" },
    { name: "Digital Logic Design", code: "EEE201", departmentId: eee.id, description: "Digital circuits and logic" },
    { name: "Principles of Management", code: "BBA101", departmentId: bba.id, description: "Introduction to management" },
  ];

  const subjects = [];
  for (const subj of subjectsData) {
    const existing = await prisma.subject.findFirst({ where: { code: subj.code } });
    const s = existing
      ? await prisma.subject.update({ where: { id: existing.id }, data: subj })
      : await prisma.subject.create({ data: subj });
    subjects.push(s);
  }
  console.log(`✅ Subjects: ${subjects.length}`);

  // ---------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------
  const categoriesData = [
    { name: "Programming", slug: "programming", type: "RESOURCE" as const },
    { name: "Database", slug: "database", type: "RESOURCE" as const },
    { name: "Exam Updates", slug: "exam-updates", type: "NOTICE" as const },
    { name: "Scholarships", slug: "scholarships", type: "NOTICE" as const },
    { name: "Study Tips", slug: "study-tips", type: "ARTICLE" as const },
    { name: "Technology", slug: "technology", type: "ARTICLE" as const },
    { name: "Forms", slug: "forms", type: "DOWNLOAD" as const },
    { name: "Templates", slug: "templates", type: "DOWNLOAD" as const },
    { name: "Admission", slug: "admission-guides", type: "GUIDE" as const },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(c);
  }
  console.log(`✅ Categories: ${categories.length}`);

  const programmingCat = categories.find((c) => c.slug === "programming")!;
  const databaseCat = categories.find((c) => c.slug === "database")!;
  const examUpdatesCat = categories.find((c) => c.slug === "exam-updates")!;
  const scholarshipsCat = categories.find((c) => c.slug === "scholarships")!;
  const studyTipsCat = categories.find((c) => c.slug === "study-tips")!;
  const technologyCat = categories.find((c) => c.slug === "technology")!;
  const formsCat = categories.find((c) => c.slug === "forms")!;
  const templatesCat = categories.find((c) => c.slug === "templates")!;

  // ---------------------------------------------------------------
  // Resources
  // ---------------------------------------------------------------
  const resourcesData = [
    {
      title: "Introduction to Data Structures — Lecture Notes",
      slug: "intro-data-structures-notes",
      description:
        "Comprehensive lecture notes covering arrays, linked lists, stacks, and queues with worked examples and diagrams suitable for first-year computer science students.",
      resourceType: "NOTES" as const,
      categoryId: programmingCat.id,
      departmentId: cse.id,
      status: "PUBLISHED" as const,
      isFeatured: true,
      viewCount: 245,
      downloadCount: 89,
    },
    {
      title: "Database Systems — Complete PDF Book",
      slug: "database-systems-pdf-book",
      description:
        "A full textbook PDF covering relational algebra, normalization, SQL, transactions, and indexing strategies for an introductory database course.",
      resourceType: "PDF_BOOK" as const,
      categoryId: databaseCat.id,
      departmentId: cse.id,
      status: "PUBLISHED" as const,
      isFeatured: true,
      viewCount: 412,
      downloadCount: 201,
    },
    {
      title: "Algorithms Midterm — Previous Year Questions",
      slug: "algorithms-midterm-previous-questions",
      description:
        "A collection of midterm exam questions from the past three years for the Algorithms course, including topics on sorting, recursion, and graph traversal.",
      resourceType: "PREVIOUS_QUESTION" as const,
      categoryId: programmingCat.id,
      departmentId: cse.id,
      status: "PUBLISHED" as const,
      viewCount: 178,
      downloadCount: 96,
    },
    {
      title: "Digital Logic Design — Assignment 3",
      slug: "digital-logic-design-assignment-3",
      description:
        "Assignment covering combinational logic circuits, Karnaugh maps, and multiplexer design with submission guidelines.",
      resourceType: "ASSIGNMENT" as const,
      departmentId: eee.id,
      status: "PUBLISHED" as const,
      viewCount: 64,
      downloadCount: 31,
    },
    {
      title: "SQL Joins Explained — Video Tutorial",
      slug: "sql-joins-video-tutorial",
      description:
        "A step-by-step video tutorial explaining inner joins, outer joins, and self joins with practical SQL query examples.",
      resourceType: "VIDEO_TUTORIAL" as const,
      categoryId: databaseCat.id,
      videoUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
      status: "PUBLISHED" as const,
      viewCount: 532,
      downloadCount: 0,
    },
    {
      title: "Principles of Management — Chapter Summary Notes",
      slug: "principles-management-chapter-notes",
      description:
        "Concise chapter-by-chapter summary notes for the Principles of Management course, ideal for last-minute exam revision.",
      resourceType: "NOTES" as const,
      departmentId: bba.id,
      status: "PUBLISHED" as const,
      viewCount: 87,
      downloadCount: 42,
    },
  ];

  for (const resource of resourcesData) {
    await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: {},
      create: resource,
    });
  }
  console.log(`✅ Resources: ${resourcesData.length}`);

  // ---------------------------------------------------------------
  // Notices
  // ---------------------------------------------------------------
  const now = new Date();
  const noticesData = [
    {
      title: "Mid-Semester Examination Routine Published",
      slug: "mid-semester-exam-routine-published",
      content:
        "The mid-semester examination routine for all departments has been published. Students are advised to check their respective department notice boards and the Academic Information page for exact dates, times, and room assignments. Any conflicts should be reported to the examination controller's office within three working days.",
      noticeType: "EXAM" as const,
      categoryId: examUpdatesCat.id,
      status: "PUBLISHED" as const,
      publishDate: now,
    },
    {
      title: "Merit Scholarship Applications Now Open",
      slug: "merit-scholarship-applications-open",
      content:
        "Applications for the semester merit scholarship are now open for all students with a GPA of 3.75 or higher. Interested students should submit their application along with the latest transcript to the financial aid office before the deadline. Late submissions will not be considered.",
      noticeType: "SCHOLARSHIP" as const,
      categoryId: scholarshipsCat.id,
      status: "PUBLISHED" as const,
      publishDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
    },
    {
      title: "University Library Extended Hours During Finals Week",
      slug: "library-extended-hours-finals-week",
      content:
        "To support students during the upcoming final examinations, the university library will remain open until midnight on weekdays and until 10 PM on weekends throughout the finals period. Please bring your student ID for after-hours access.",
      noticeType: "UNIVERSITY" as const,
      status: "PUBLISHED" as const,
      publishDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Campus Wi-Fi Maintenance This Weekend",
      slug: "campus-wifi-maintenance-weekend",
      content:
        "The IT department will be performing scheduled maintenance on the campus Wi-Fi network this weekend. Intermittent connectivity issues may occur between 11 PM Friday and 6 AM Saturday. We apologize for any inconvenience.",
      noticeType: "GENERAL" as const,
      status: "PUBLISHED" as const,
      publishDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const notice of noticesData) {
    await prisma.notice.upsert({
      where: { slug: notice.slug },
      update: {},
      create: notice,
    });
  }
  console.log(`✅ Notices: ${noticesData.length}`);

  // ---------------------------------------------------------------
  // Articles
  // ---------------------------------------------------------------
  const articlesData = [
    {
      title: "Five Study Techniques That Actually Work",
      slug: "five-study-techniques-that-work",
      excerpt:
        "Cramming the night before an exam rarely works. Here are five evidence-based study techniques that can genuinely improve retention and understanding.",
      content:
        "Cramming the night before an exam rarely works. Here are five evidence-based study techniques that can genuinely improve retention and understanding.\n\n1. Active Recall — Instead of simply re-reading notes, test yourself on the material. This forces your brain to retrieve information, which strengthens memory far more effectively than passive review.\n\n2. Spaced Repetition — Reviewing material at increasing intervals over time leads to much better long-term retention than reviewing everything in one sitting.\n\n3. The Pomodoro Technique — Working in focused 25-minute blocks followed by short breaks helps maintain concentration and avoid burnout during long study sessions.\n\n4. Teaching Others — Explaining a concept to a classmate or even to yourself out loud reveals gaps in understanding and reinforces what you already know.\n\n5. Interleaving — Mixing different subjects or problem types in a single study session, rather than focusing on one topic for hours, improves your ability to distinguish between concepts and apply the right approach.\n\nTry combining a few of these techniques rather than relying on just one — most students find a mix works best for their personal learning style.",
      categoryId: studyTipsCat.id,
      status: "PUBLISHED" as const,
      viewCount: 312,
    },
    {
      title: "Getting Started with Git and GitHub for Coursework",
      slug: "getting-started-git-github-coursework",
      excerpt:
        "Version control isn't just for professional developers — it can save your coursework from disaster. Here's a beginner-friendly introduction.",
      content:
        "Version control isn't just for professional developers — it can save your coursework from disaster. Here's a beginner-friendly introduction.\n\nGit is a version control system that tracks changes to your files over time, letting you revert to earlier versions, collaborate with classmates, and avoid the dreaded 'final_v3_FINAL_actually_final.docx' naming problem.\n\nTo get started, install Git on your machine and create a free GitHub account. Initialize a repository in your project folder with `git init`, then use `git add` and `git commit` to save snapshots of your work as you progress.\n\nFor group assignments, GitHub lets each member work on their own branch and merge changes without overwriting each other's work. This is far safer than emailing zip files back and forth.\n\nMost importantly, commit early and often. Small, frequent commits with clear messages make it much easier to find and fix mistakes later, and they create a useful record of your progress for project reports.",
      categoryId: technologyCat.id,
      status: "PUBLISHED" as const,
      viewCount: 198,
    },
    {
      title: "How to Choose a Research Topic for Your Thesis",
      slug: "how-to-choose-research-topic-thesis",
      excerpt:
        "Choosing a thesis topic can feel overwhelming. Here's a practical framework to narrow down your options and pick something you'll enjoy researching.",
      content:
        "Choosing a thesis topic can feel overwhelming. Here's a practical framework to narrow down your options and pick something you'll enjoy researching.\n\nStart by listing three or four broad areas within your field that genuinely interest you — not just what seems impressive on paper. You'll spend months on this topic, so authentic curiosity matters more than prestige.\n\nNext, do a quick literature scan for each area. Look for recent papers, identify what questions remain unanswered, and note where you could realistically contribute given your timeline and resources.\n\nTalk to your advisor early. They can flag topics that are too broad, too narrow, or that lack available data or tools. A short conversation can save weeks of wasted effort.\n\nFinally, write a one-paragraph problem statement before committing. If you can't clearly articulate the problem and why it matters in a few sentences, the topic likely needs more refinement.",
      categoryId: studyTipsCat.id,
      status: "PUBLISHED" as const,
      viewCount: 156,
    },
  ];

  for (const article of articlesData) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log(`✅ Articles: ${articlesData.length}`);

  // ---------------------------------------------------------------
  // Downloads
  // ---------------------------------------------------------------
  const downloadsData = [
    {
      title: "Course Registration Form",
      slug: "course-registration-form",
      description: "Official form for registering courses each semester. Must be submitted to the registrar's office.",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoryId: formsCat.id,
      status: "PUBLISHED" as const,
      downloadCount: 156,
    },
    {
      title: "CSE Department Syllabus (Latest)",
      slug: "cse-department-syllabus-latest",
      description: "Complete and updated syllabus for the Computer Science & Engineering program, covering all course requirements.",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoryId: templatesCat.id,
      status: "PUBLISHED" as const,
      downloadCount: 203,
    },
    {
      title: "Thesis Report Formatting Template",
      slug: "thesis-report-formatting-template",
      description: "Word document template pre-formatted with the university's required margins, headings, and citation style for thesis submissions.",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoryId: templatesCat.id,
      status: "PUBLISHED" as const,
      downloadCount: 312,
    },
    {
      title: "Scholarship Application Form",
      slug: "scholarship-application-form",
      description: "Application form required for submitting merit and need-based scholarship requests.",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoryId: formsCat.id,
      status: "PUBLISHED" as const,
      downloadCount: 98,
    },
  ];

  for (const download of downloadsData) {
    await prisma.download.upsert({
      where: { slug: download.slug },
      update: {},
      create: download,
    });
  }
  console.log(`✅ Downloads: ${downloadsData.length}`);

  // ---------------------------------------------------------------
  // Guides
  // ---------------------------------------------------------------
  const guidesData = [
    {
      title: "Undergraduate Admission Guide",
      slug: "undergraduate-admission-guide",
      content:
        "This guide walks prospective students through the undergraduate admission process from start to finish.\n\nStep 1: Eligibility — Review the minimum GPA and standardized test requirements for your intended program on the university's official admissions page.\n\nStep 2: Application — Submit the online application along with academic transcripts, recommendation letters, and a personal statement before the deadline.\n\nStep 3: Entrance Test / Interview — Depending on the program, you may be required to sit for an entrance examination or attend an interview.\n\nStep 4: Admission Offer — Successful candidates receive an admission offer letter, which must be accepted within the stated timeframe to secure a seat.\n\nStep 5: Enrollment — Complete enrollment formalities, pay the initial fees, and attend the orientation session before classes begin.",
      guideType: "ADMISSION" as const,
      status: "PUBLISHED" as const,
    },
    {
      title: "How to Apply for Need-Based Financial Aid",
      slug: "how-to-apply-need-based-financial-aid",
      content:
        "Need-based financial aid is available to students who demonstrate financial hardship.\n\nTo apply, gather your family's income documentation, a written statement explaining your financial situation, and any supporting evidence such as utility bills or medical expenses.\n\nSubmit the financial aid application form, available from the financial aid office, along with all supporting documents before the semester deadline. Applications are reviewed by a committee and decisions are typically communicated within four to six weeks.\n\nIf approved, aid is usually applied directly to your tuition account rather than disbursed as cash. Recipients are generally required to maintain a minimum GPA to continue receiving aid in subsequent semesters.",
      guideType: "SCHOLARSHIP" as const,
      status: "PUBLISHED" as const,
    },
    {
      title: "Finding and Landing Your First Internship",
      slug: "finding-landing-first-internship",
      content:
        "Internships are one of the best ways to gain practical experience before graduation. Here's how to approach the search.\n\nStart early — many competitive internship programs open applications six to twelve months before the actual internship period.\n\nBuild a focused resume — tailor it to highlight relevant coursework, projects, and any prior experience, even if it's from class assignments or personal projects.\n\nLeverage your network — talk to professors, alumni, and career services. A surprising number of internships are filled through referrals rather than public postings.\n\nPrepare for interviews — practice explaining your projects clearly and be ready to discuss what you learned, not just what you built.\n\nFollow up professionally — a brief thank-you message after an interview leaves a positive impression and keeps you on the recruiter's radar.",
      guideType: "INTERNSHIP" as const,
      status: "PUBLISHED" as const,
    },
    {
      title: "Building a Career Plan Before Graduation",
      slug: "building-career-plan-before-graduation",
      content:
        "Thinking about your career path early can make your final years of study far more productive.\n\nReflect on your interests and strengths, and research which roles in your field align with them. Talk to professionals already working in those roles if possible.\n\nIdentify skill gaps — compare job descriptions for roles you're interested in against your current skill set, and use electives, certifications, or personal projects to close those gaps.\n\nBuild a portfolio — whether it's code repositories, design work, or research publications, having tangible evidence of your abilities is invaluable during job searches.\n\nNetwork consistently — attend career fairs, join relevant student organizations, and maintain a professional online presence such as LinkedIn.\n\nStart applying before graduation — many graduate-level positions have application windows that open months before your final semester ends.",
      guideType: "CAREER" as const,
      status: "PUBLISHED" as const,
    },
    {
      title: "Writing a Strong Research Proposal",
      slug: "writing-strong-research-proposal",
      content:
        "A well-written research proposal sets the foundation for a successful thesis or research project.\n\nBegin with a clear problem statement that explains what gap in knowledge or practice your research addresses, and why it matters.\n\nInclude a focused literature review that situates your work within existing research, rather than attempting to cover everything ever written on the topic.\n\nDefine your methodology precisely — describe the data, tools, or experiments you'll use, and justify why this approach is appropriate for your research question.\n\nSet a realistic timeline broken into milestones, which helps both you and your advisor track progress and catch delays early.\n\nFinally, have your proposal reviewed by your advisor or peers before submission. Fresh eyes often catch unclear assumptions or overly ambitious scope that you may have missed.",
      guideType: "RESEARCH" as const,
      status: "PUBLISHED" as const,
    },
  ];

  for (const guide of guidesData) {
    await prisma.guide.upsert({
      where: { slug: guide.slug },
      update: {},
      create: guide,
    });
  }
  console.log(`✅ Guides: ${guidesData.length}`);

  // ---------------------------------------------------------------
  // Academic Calendar
  // ---------------------------------------------------------------
  const calendarData = [
    {
      title: "Spring Semester Classes Begin",
      description: "First day of classes for the Spring semester across all departments.",
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth(), 1),
      type: "Semester",
    },
    {
      title: "Mid-Semester Break",
      description: "One-week break for students between mid-term and final examinations.",
      startDate: new Date(now.getFullYear(), now.getMonth() + 1, 10),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 17),
      type: "Holiday",
    },
    {
      title: "Final Examination Period",
      description: "Final examinations for all undergraduate and graduate courses.",
      startDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 2, 14),
      type: "Examination",
    },
    {
      title: "Course Registration Window",
      description: "Registration period for the next semester's courses.",
      startDate: new Date(now.getFullYear(), now.getMonth() + 2, 20),
      endDate: new Date(now.getFullYear(), now.getMonth() + 2, 27),
      type: "Registration",
    },
  ];

  for (const event of calendarData) {
    const existing = await prisma.academicCalendar.findFirst({ where: { title: event.title } });
    if (!existing) {
      await prisma.academicCalendar.create({ data: event });
    }
  }
  console.log(`✅ Academic calendar events: ${calendarData.length}`);

  // ---------------------------------------------------------------
  // Exam Schedule
  // ---------------------------------------------------------------
  const dataStructures = subjects.find((s) => s.code === "CSE201")!;
  const algorithms = subjects.find((s) => s.code === "CSE301")!;
  const databaseSystems = subjects.find((s) => s.code === "CSE303")!;
  const digitalLogic = subjects.find((s) => s.code === "EEE201")!;

  const examScheduleData = [
    {
      title: "Data Structures Final Examination",
      departmentId: cse.id,
      subjectId: dataStructures.id,
      examDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      startTime: "09:00",
      endTime: "12:00",
      room: "Room 301",
      description: "Closed book examination. Bring your student ID and calculator.",
    },
    {
      title: "Algorithms Final Examination",
      departmentId: cse.id,
      subjectId: algorithms.id,
      examDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
      startTime: "09:00",
      endTime: "12:00",
      room: "Room 302",
      description: "Covers all topics from chapters 1 through 9.",
    },
    {
      title: "Database Systems Final Examination",
      departmentId: cse.id,
      subjectId: databaseSystems.id,
      examDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
      startTime: "14:00",
      endTime: "17:00",
      room: "Room 205",
      description: "Includes both theory and SQL practical sections.",
    },
    {
      title: "Digital Logic Design Final Examination",
      departmentId: eee.id,
      subjectId: digitalLogic.id,
      examDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      startTime: "09:00",
      endTime: "12:00",
      room: "Room 110",
      description: "Bring scientific calculator. No mobile phones allowed.",
    },
  ];

  for (const exam of examScheduleData) {
    const existing = await prisma.examSchedule.findFirst({ where: { title: exam.title } });
    if (!existing) {
      await prisma.examSchedule.create({ data: exam });
    }
  }
  console.log(`✅ Exam schedules: ${examScheduleData.length}`);

  // ---------------------------------------------------------------
  // Site Settings (singleton)
  // ---------------------------------------------------------------
  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        siteName: "Student Helping Portal",
        siteLanguage: "en",
        contactEmail: "info@studentportal.com",
        phone: "+1 (555) 123-4567",
        address: "123 University Avenue, Academic City",
        seoTitle: "Student Helping Portal — Academic Resources & Notices",
        seoDescription:
          "Find study resources, notices, guides, and downloads all in one place at Student Helping Portal.",
      },
    });
    console.log("✅ Site settings created");
  }

  // ---------------------------------------------------------------
  // Sample contact messages
  // ---------------------------------------------------------------
  const existingMessages = await prisma.contactMessage.count();
  if (existingMessages === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: "Aisha Rahman",
          email: "aisha.rahman@example.com",
          subject: "Question about resource upload",
          message: "Hi, I noticed the Data Structures notes link seems outdated. Could you update it with the latest semester's materials? Thanks!",
          isRead: false,
        },
        {
          name: "Tom Becker",
          email: "tom.becker@example.com",
          subject: "Suggestion for new guide topic",
          message: "It would be great to have a guide on preparing for graduate school applications. Many of us in the final year are looking for this kind of resource.",
          isRead: true,
        },
      ],
    });
    console.log("✅ Sample contact messages created");
  }

  // ---------------------------------------------------------------
  // Sample bookmark for demo student
  // ---------------------------------------------------------------
  const firstResource = await prisma.resource.findFirst({ where: { slug: "intro-data-structures-notes" } });
  if (firstResource) {
    await prisma.bookmark.upsert({
      where: { userId_resourceId: { userId: student.id, resourceId: firstResource.id } },
      update: {},
      create: { userId: student.id, type: "RESOURCE", resourceId: firstResource.id },
    });
  }

  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
