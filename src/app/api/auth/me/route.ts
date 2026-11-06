import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("sps_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    try {
      const parsed = JSON.parse(sessionCookie);
      return NextResponse.json({
        user: {
          id: parsed.id || "usr-admin-01",
          email: parsed.email || "admin@spsurya.com",
          name: parsed.name || "SP Surya Admin",
          role: parsed.role || "ADMIN",
          phone: parsed.phone || "+91 98532 89304",
        },
      });
    } catch {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
