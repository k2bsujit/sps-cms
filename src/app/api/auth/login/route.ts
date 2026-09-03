import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Auto-create user if demo login
      const defaultRole = email.includes("admin")
        ? "ADMIN"
        : email.includes("engineer")
        ? "FIELD_ENGINEER"
        : "SALES_MANAGER";

      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: email.split("@")[0].toUpperCase(),
          role: defaultRole,
          password: password || "spsurya123",
          phone: "+91 98532 89304",
        },
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          phone: newUser.phone,
        },
      });

      response.cookies.set("sps_session", JSON.stringify(newUser), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });

    response.cookies.set("sps_session", JSON.stringify(user), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
