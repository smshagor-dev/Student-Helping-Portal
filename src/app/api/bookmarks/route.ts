import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const bookmarkSchema = z.object({
  type: z.enum(["RESOURCE", "ARTICLE"]),
  resourceId: z.string().optional(),
  articleId: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bookmarkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { type, resourceId, articleId } = parsed.data;

  if (type === "RESOURCE" && !resourceId) {
    return NextResponse.json({ error: "resourceId is required" }, { status: 400 });
  }
  if (type === "ARTICLE" && !articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        type,
        resourceId: type === "RESOURCE" ? resourceId : null,
        articleId: type === "ARTICLE" ? articleId : null,
      },
    });
    return NextResponse.json({ bookmark }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Already bookmarked or invalid item" },
      { status: 409 }
    );
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const resourceId = searchParams.get("resourceId") || undefined;
  const articleId = searchParams.get("articleId") || undefined;

  try {
    if (type === "RESOURCE" && resourceId) {
      await prisma.bookmark.delete({
        where: { userId_resourceId: { userId: user.id, resourceId } },
      });
    } else if (type === "ARTICLE" && articleId) {
      await prisma.bookmark.delete({
        where: { userId_articleId: { userId: user.id, articleId } },
      });
    } else {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
  }
}
