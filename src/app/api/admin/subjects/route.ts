import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { subjectSchema } from "@/lib/validations";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const subjects = await prisma.subject.findMany({
    orderBy: { createdAt: "desc" },
    include: { department: true },
  });
  return NextResponse.json({ subjects });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = subjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const subject = await prisma.subject.create({ data: parsed.data });
    return NextResponse.json({ subject }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid department reference" }, { status: 400 });
  }
}
