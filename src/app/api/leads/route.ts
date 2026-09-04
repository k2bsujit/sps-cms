import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// In-memory cache for serverless resilience
let memoryLeads: any[] = [
  {
    id: "lead-mem-1",
    customerName: "ADITYA KUMAR BARIK",
    contactNumber: "9437102938",
    email: "aditya.barik@gmail.com",
    consumerNumber: "TPNODL-BLS-88349",
    location: "Bartana, Somanathpur, Khantapada",
    district: "Balasore",
    pin: "756019",
    category: "RESIDENTIAL",
    capacityKw: 3.0,
    phase: "SINGLE_PHASE",
    brandPreference: "WAAREE",
    source: "PM Surya Ghar Portal",
    status: "QUOTATION_CREATED",
    notes: "Site surveyed. 3 kW system feasible on RCC south roof.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-mem-2",
    customerName: "Ramesh Chandra Mahapatra",
    contactNumber: "9861234567",
    email: "ramesh.mahapatra@yahoo.com",
    consumerNumber: "TPNODL-BLS-99120",
    location: "Remuna Golei, Balasore",
    district: "Balasore",
    pin: "756019",
    category: "RESIDENTIAL",
    capacityKw: 3.0,
    phase: "SINGLE_PHASE",
    brandPreference: "TATA Solar",
    source: "Direct Walk-in",
    status: "SURVEY_SCHEDULED",
    notes: "Customer interested in Tata Solar panels with Net Metering.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-mem-3",
    customerName: "Balasore Cold Storage & Logistics",
    contactNumber: "9778019283",
    email: "info@balasorecoldstorage.com",
    consumerNumber: "TPNODL-HT-44910",
    location: "Kuruda Industrial Area",
    district: "Balasore",
    pin: "756003",
    category: "COMMERCIAL",
    capacityKw: 25.0,
    phase: "THREE_PHASE",
    brandPreference: "Adani Solar",
    source: "Field Campaign",
    status: "CONTACTED",
    notes: "Commercial rooftop 25 kW. Accelerated depreciation analysis requested.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const dbLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbLeads && dbLeads.length > 0) {
      return NextResponse.json(dbLeads);
    }
    return NextResponse.json(memoryLeads);
  } catch (error: any) {
    console.warn("GET /api/leads DB fallback to memory:", error.message);
    return NextResponse.json(memoryLeads);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const leadPayload = {
      customerName: data.customerName?.trim() || "Prospective Client",
      contactNumber: data.contactNumber?.trim() || "",
      email: data.email?.trim() || null,
      consumerNumber: data.consumerNumber?.trim() || null,
      location: data.location?.trim() || "Nilagiri, Balasore",
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
    };

    try {
      const newLead = await prisma.lead.create({
        data: leadPayload,
      });
      memoryLeads = [newLead, ...memoryLeads];
      return NextResponse.json(newLead);
    } catch (dbErr: any) {
      console.warn("Prisma lead insert fallback to memory:", dbErr.message);
      const fallbackLead = {
        id: `lead-${Date.now()}`,
        ...leadPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryLeads = [fallbackLead, ...memoryLeads];
      return NextResponse.json(fallbackLead);
    }
  } catch (error: any) {
    console.error("POST /api/leads parsing error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updatePayload = {
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
    };

    try {
      const updated = await prisma.lead.update({
        where: { id },
        data: updatePayload,
      });
      memoryLeads = memoryLeads.map((l) => (l.id === id ? updated : l));
      return NextResponse.json(updated);
    } catch (dbErr) {
      const updatedFallback = { id, ...updatePayload, updatedAt: new Date().toISOString() };
      memoryLeads = memoryLeads.map((l) => (l.id === id ? updatedFallback : l));
      return NextResponse.json(updatedFallback);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
      await prisma.lead.delete({ where: { id } });
    } catch (dbErr) {}

    memoryLeads = memoryLeads.filter((l) => l.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
