import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { examScheduleSchema } from "@/lib/validations";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const exams = await prisma.examSchedule.findMany({
    orderBy: { examDate: "asc" },
    include: { department: true, subject: true },
  });
  return NextResponse.json({ exams });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = examScheduleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { departmentId, subjectId, ...rest } = parsed.data;

  const exam = await prisma.examSchedule.create({
    data: { ...rest, departmentId: departmentId || null, subjectId: subjectId || null },
  });
  return NextResponse.json({ exam }, { status: 201 });
}
