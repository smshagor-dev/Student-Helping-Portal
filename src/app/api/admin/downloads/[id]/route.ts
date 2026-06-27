import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { downloadSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const download = await prisma.download.findUnique({ where: { id } });
  if (!download) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }
  return NextResponse.json({ download });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json();
  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.download.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return NextResponse.json({ error: "A download with this slug already exists" }, { status: 409 });
  }

  const { categoryId, ...rest } = parsed.data;

  try {
    const download = await prisma.download.update({
      where: { id },
      data: { ...rest, categoryId: categoryId || null },
    });
    return NextResponse.json({ download });
  } catch {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
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
    await prisma.download.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }
}
