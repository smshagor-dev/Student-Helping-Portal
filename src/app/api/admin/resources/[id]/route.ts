import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { resourceSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
  return NextResponse.json({ resource });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json();
  const parsed = resourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.resource.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return NextResponse.json({ error: "A resource with this slug already exists" }, { status: 409 });
  }

  const { categoryId, departmentId, fileUrl, videoUrl, thumbnailUrl, ...rest } = parsed.data;

  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...rest,
        fileUrl: fileUrl || null,
        videoUrl: videoUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        categoryId: categoryId || null,
        departmentId: departmentId || null,
      },
    });
    return NextResponse.json({ resource });
  } catch {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
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
    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
}
