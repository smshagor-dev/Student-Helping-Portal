import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

/**
 * Use inside API route handlers. Returns a NextResponse if the request
 * should be rejected, or null if the caller is an authenticated admin
 * and the handler should proceed.
 */
export async function requireAdminApi() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
