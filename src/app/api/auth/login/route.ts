import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_USERS: Record<string, any> = {
  "admin@spsurya.com": {
    id: "usr-admin-01",
    email: "admin@spsurya.com",
    name: "SP Surya Admin",
    role: "ADMIN",
    phone: "+91 98532 89304",
  },
  "sales@spsurya.com": {
    id: "usr-sales-01",
    email: "sales@spsurya.com",
    name: "Priyabrata Jena (Sales)",
    role: "SALES_MANAGER",
    phone: "+91 94371 00223",
  },
  "engineer@spsurya.com": {
    id: "usr-eng-01",
    email: "engineer@spsurya.com",
    name: "Biswajit Sahoo (Engineer)",
    role: "FIELD_ENGINEER",
    phone: "+91 98612 34567",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    let authUser = DEMO_USERS[cleanEmail];

    // Try database if available
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (dbUser) {
        authUser = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          phone: dbUser.phone,
        };
      } else if (!authUser) {
        // Create user in DB
        const defaultRole = cleanEmail.includes("admin")
          ? "ADMIN"
          : cleanEmail.includes("engineer")
          ? "FIELD_ENGINEER"
          : "SALES_MANAGER";

        try {
          const newUser = await prisma.user.create({
            data: {
              email: cleanEmail,
              name: cleanEmail.split("@")[0].toUpperCase(),
              role: defaultRole,
              password: password || "spsurya123",
              phone: "+91 98532 89304",
            },
          });
          authUser = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            phone: newUser.phone,
          };
        } catch (createErr) {
          // Fallback if DB insert fails in serverless
          authUser = {
            id: `usr-${Date.now()}`,
            email: cleanEmail,
            name: cleanEmail.split("@")[0].toUpperCase(),
            role: defaultRole,
            phone: "+91 98532 89304",
          };
        }
      }
    } catch (dbErr) {
      console.warn("DB query fallback in serverless:", dbErr);
      if (!authUser) {
        const defaultRole = cleanEmail.includes("admin")
          ? "ADMIN"
          : cleanEmail.includes("engineer")
          ? "FIELD_ENGINEER"
          : "SALES_MANAGER";

        authUser = {
          id: `usr-${Date.now()}`,
          email: cleanEmail,
          name: cleanEmail.split("@")[0].toUpperCase(),
          role: defaultRole,
          phone: "+91 98532 89304",
        };
      }
    }

    const response = NextResponse.json({
      success: true,
      user: authUser,
    });

    response.cookies.set("sps_session", JSON.stringify(authUser), {
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
