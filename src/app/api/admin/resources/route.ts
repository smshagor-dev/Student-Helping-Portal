import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { resourceSchema } from "@/lib/validations";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, department: true },
  });
  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = resourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.resource.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A resource with this slug already exists" }, { status: 409 });
  }

  const { categoryId, departmentId, fileUrl, videoUrl, thumbnailUrl, ...rest } = parsed.data;

  const resource = await prisma.resource.create({
    data: {
      ...rest,
      fileUrl: fileUrl || null,
      videoUrl: videoUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      categoryId: categoryId || null,
      departmentId: departmentId || null,
    },
  });
  return NextResponse.json({ resource }, { status: 201 });
}
