import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { departmentSchema } from "@/lib/validations";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const departments = await prisma.department.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { subjects: true, resources: true } } },
  });
  return NextResponse.json({ departments });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = departmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.department.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A department with this slug already exists" }, { status: 409 });
  }

  const department = await prisma.department.create({ data: parsed.data });
  return NextResponse.json({ department }, { status: 201 });
}
