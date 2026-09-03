import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("sps_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const parsed = JSON.parse(sessionCookie);
    const user = await prisma.user.findUnique({
      where: { id: parsed.id },
    });

    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
          }
        : parsed,
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
