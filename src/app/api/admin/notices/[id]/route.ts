import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { noticeSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return NextResponse.json({ error: "Notice not found" }, { status: 404 });
  }
  return NextResponse.json({ notice });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json();
  const parsed = noticeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.notice.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return NextResponse.json({ error: "A notice with this slug already exists" }, { status: 409 });
  }

  const { categoryId, expiryDate, ...rest } = parsed.data;

  try {
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        ...rest,
        expiryDate: expiryDate || null,
        categoryId: categoryId || null,
      },
    });
    return NextResponse.json({ notice });
  } catch {
    return NextResponse.json({ error: "Notice not found" }, { status: 404 });
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
    await prisma.notice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Notice not found" }, { status: 404 });
  }
}
