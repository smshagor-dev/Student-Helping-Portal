import { NextResponse } from "next/server";
import { LANGUAGE_COOKIE_NAME, getActiveLanguages } from "@/lib/site-settings";

export async function POST(req: Request) {
  const body = await req.json();
  const code = typeof body?.code === "string" ? body.code.trim().toLowerCase() : "";
  const activeLanguages = await getActiveLanguages();
  const isValid = activeLanguages.some((language) => language.code === code);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(LANGUAGE_COOKIE_NAME, code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
