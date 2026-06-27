import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { languageSchema } from "@/lib/validations";

async function ensureDefaultLanguage(code: string) {
  await prisma.language.updateMany({
    data: { isDefault: false },
  });

  await prisma.language.update({
    where: { code },
    data: { isDefault: true, isActive: true },
  });

  const existingSettings = await prisma.siteSetting.findFirst();
  if (existingSettings) {
    await prisma.siteSetting.update({
      where: { id: existingSettings.id },
      data: { siteLanguage: code },
    });
  } else {
    await prisma.siteSetting.create({
      data: { siteLanguage: code },
    });
  }
}

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const languages = await prisma.language.findMany({
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    include: {
      _count: {
        select: { translations: true },
      },
    },
  });

  return NextResponse.json({ languages });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = languageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.language.findUnique({
    where: { code: parsed.data.code },
  });

  if (existing) {
    return NextResponse.json({ error: "A language with this code already exists" }, { status: 409 });
  }

  const language = await prisma.language.create({
    data: {
      code: parsed.data.code,
      name: parsed.data.name,
      nativeName: parsed.data.nativeName || null,
      isActive: parsed.data.isActive,
      isDefault: false,
    },
  });

  if (parsed.data.isDefault) {
    await ensureDefaultLanguage(language.code);
  }

  return NextResponse.json({ language }, { status: 201 });
}
