import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-guard";
import { academicCalendarSchema } from "@/lib/validations";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const events = await prisma.academicCalendar.findMany({ orderBy: { startDate: "asc" } });
  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await req.json();
  const parsed = academicCalendarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  if (parsed.data.endDate < parsed.data.startDate) {
    return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
  }

  const event = await prisma.academicCalendar.create({ data: parsed.data });
  return NextResponse.json({ event }, { status: 201 });
}
