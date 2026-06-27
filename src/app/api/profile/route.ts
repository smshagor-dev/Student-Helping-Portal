import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { profileUpdateSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, image } = parsed.data;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, image: image || null },
    select: { id: true, name: true, email: true, image: true },
  });

  return NextResponse.json({ user: updated });
}
