import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const download = await prisma.download.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
      select: { downloadCount: true },
    });
    return NextResponse.json({ downloadCount: download.downloadCount });
  } catch {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }
}
