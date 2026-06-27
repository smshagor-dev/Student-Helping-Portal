import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { examScheduleSchema } from "@/lib/validations";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json();
  const parsed = examScheduleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { departmentId, subjectId, ...rest } = parsed.data;

  try {
    const exam = await prisma.examSchedule.update({
      where: { id },
      data: { ...rest, departmentId: departmentId || null, subjectId: subjectId || null },
    });
    return NextResponse.json({ exam });
  } catch {
    return NextResponse.json({ error: "Exam schedule not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  try {
    await prisma.examSchedule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Exam schedule not found" }, { status: 404 });
  }
}
