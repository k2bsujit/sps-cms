import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newLead = await prisma.lead.create({
      data: {
        customerName: data.customerName,
        contactNumber: data.contactNumber,
        email: data.email || null,
        consumerNumber: data.consumerNumber || null,
        location: data.location,
        district: data.district || "Balasore",
        pin: data.pin || null,
        category: data.category || "RESIDENTIAL",
        capacityKw: parseFloat(data.capacityKw) || 3.0,
        phase: data.phase || "SINGLE_PHASE",
        brandPreference: data.brandPreference || "WAAREE",
        source: data.source || "PM Surya Ghar Portal",
        status: data.status || "NEW",
        notes: data.notes || null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      },
    });

    return NextResponse.json(newLead);
  } catch (error: any) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        customerName: data.customerName,
        contactNumber: data.contactNumber,
        email: data.email || null,
        consumerNumber: data.consumerNumber || null,
        location: data.location,
        district: data.district,
        pin: data.pin || null,
        category: data.category,
        capacityKw: parseFloat(data.capacityKw) || 3.0,
        phase: data.phase,
        brandPreference: data.brandPreference,
        source: data.source,
        status: data.status,
        notes: data.notes || null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/leads error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/leads error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
