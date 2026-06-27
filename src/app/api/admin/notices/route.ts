import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { noticeSchema } from "@/lib/validations";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ notices });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = noticeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.notice.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A notice with this slug already exists" }, { status: 409 });
  }

  const { categoryId, expiryDate, ...rest } = parsed.data;

  const notice = await prisma.notice.create({
    data: {
      ...rest,
      expiryDate: expiryDate || null,
      categoryId: categoryId || null,
    },
  });
  return NextResponse.json({ notice }, { status: 201 });
}
