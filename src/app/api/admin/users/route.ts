import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      createdAt: true,
      _count: { select: { bookmarks: true } },
    },
  });
  return NextResponse.json({ users });
}
