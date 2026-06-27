import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { getDefaultTranslationEntries, getSeedTranslationsForLanguage } from "@/lib/i18n";
import { languageTranslationSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const language = await prisma.language.findUnique({
    where: { id },
    include: { translations: true },
  });

  if (!language) {
    return NextResponse.json({ error: "Language not found" }, { status: 404 });
  }

  const baseEntries =
    language.code === "en" || language.code === "bn"
      ? getSeedTranslationsForLanguage(language.code)
      : getDefaultTranslationEntries();

  const values = { ...baseEntries };
  for (const translation of language.translations) {
    values[translation.key] = translation.value;
  }

  return NextResponse.json({
    language: {
      id: language.id,
      code: language.code,
      name: language.name,
      nativeName: language.nativeName,
    },
    translations: values,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  const language = await prisma.language.findUnique({ where: { id } });
  if (!language) {
    return NextResponse.json({ error: "Language not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = languageTranslationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const entries = Object.entries(parsed.data.translations);
  for (const [key, value] of entries) {
    await prisma.languageTranslation.upsert({
      where: {
        languageId_key: {
          languageId: language.id,
          key,
        },
      },
      update: { value },
      create: {
        languageId: language.id,
        key,
        value,
      },
    });
  }

  return NextResponse.json({ success: true });
}
