import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { languageSchema } from "@/lib/validations";

async function setDefaultLanguage(code: string) {
  await prisma.language.updateMany({ data: { isDefault: false } });
  await prisma.language.update({
    where: { code },
    data: { isDefault: true, isActive: true },
  });

  const settings = await prisma.siteSetting.findFirst();
  if (settings) {
    await prisma.siteSetting.update({
      where: { id: settings.id },
      data: { siteLanguage: code },
    });
  } else {
    await prisma.siteSetting.create({ data: { siteLanguage: code } });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const body = await req.json();
  const parsed = languageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const duplicate = await prisma.language.findFirst({
    where: {
      code: parsed.data.code,
      NOT: { id },
    },
  });

  if (duplicate) {
    return NextResponse.json({ error: "A language with this code already exists" }, { status: 409 });
  }

  try {
    const language = await prisma.language.update({
      where: { id },
      data: {
        code: parsed.data.code,
        name: parsed.data.name,
        nativeName: parsed.data.nativeName || null,
        isActive: parsed.data.isDefault ? true : parsed.data.isActive,
      },
    });

    if (parsed.data.isDefault) {
      await setDefaultLanguage(parsed.data.code);
    } else {
      const stillDefault = await prisma.language.findUnique({ where: { id } });
      if (stillDefault?.isDefault && !parsed.data.isDefault) {
        await prisma.language.update({ where: { id }, data: { isDefault: false } });
      }
    }

    return NextResponse.json({ language });
  } catch {
    return NextResponse.json({ error: "Language not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const language = await prisma.language.findUnique({ where: { id } });
  if (!language) {
    return NextResponse.json({ error: "Language not found" }, { status: 404 });
  }

  if (language.isDefault) {
    return NextResponse.json({ error: "Default language cannot be deleted" }, { status: 400 });
  }

  await prisma.language.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
